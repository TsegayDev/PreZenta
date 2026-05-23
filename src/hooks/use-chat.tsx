
'use client';
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from 'react';
import toast from 'react-hot-toast';
import type { Message, Chat, HistoryItem } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import {
  generateOutlineAction,
  improveOutlineAction,
} from '@/app/actions';
import { useSlides } from './use-slides';
import { usePresentationSettings } from './use-presentation-settings';

interface SendMessagePayload {
  text: string;
  file?: File;
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  activeChat: Chat | undefined;
  isLoading: boolean;
  isImproving: boolean;
  improvingMessageId: string | null;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (payload: SendMessagePayload) => Promise<void>;
  retryMessage: (failedMessageId: string) => void;
  deleteMessage: (messageId: string) => void;
  updateMessageContent: (messageId: string, newContent: string) => void;
  improveOutline: (messageId: string, outline: string) => Promise<void>;
  cancelResponse?: () => void; // This needs to be implemented
  history: HistoryItem[];
  isHistoryLoaded: boolean;
  selectHistory: (item: HistoryItem) => void;
  removeHistory: (id: string) => void;
  removeHistoryItems: (ids: string[]) => void;
  clearHistory: () => void;
  createNewChat: () => void;
  selectedHistoryId: string | null;
}

const ChatContext = createContext<ChatState | undefined>(undefined);
const MAX_CONTENT_LENGTH = 250000; // Character limit to stay within token limits

const truncateFileName = (name: string, maxLength = 20) => {
  if (name.length <= maxLength) return name;
  
  const extensionIndex = name.lastIndexOf('.');
  if (extensionIndex === -1) {
      return name.substring(0, maxLength - 3) + '...';
  }

  const nameWithoutExt = name.substring(0, extensionIndex);
  const extension = name.substring(extensionIndex);
  
  const charsToKeep = maxLength - extension.length - 3;
  
  if (charsToKeep <= 0) {
      return '...' + extension;
  }
  
  return nameWithoutExt.substring(0, charsToKeep) + '...' + extension;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [improvingMessageId, setImprovingMessageId] = useState<string | null>(null);
  const { numberOfSlides } = useSlides();
  const { textAmount } = usePresentationSettings();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null
  );

  const activeChat = useMemo(
    () => chats.find(c => c.id === activeChatId),
    [chats, activeChatId]
  );

  const createNewChat = useCallback((activate = true) => {
    const newChatId = uuidv4();
    const newChat: Chat = {
      id: newChatId,
      title: 'New Presentation',
      messages: [],
      createdAt: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    if (activate) {
      setActiveChatId(newChatId);
      setSelectedHistoryId(null);
    }
    return newChat;
  }, []);
  
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem('prezenta_chats');
      const savedActiveId = localStorage.getItem('prezenta_active_chat_id');

      if (savedChats) {
        const parsedChats: Chat[] = JSON.parse(savedChats);
        setChats(parsedChats);

        if (savedActiveId && parsedChats.some(c => c.id === savedActiveId)) {
          setActiveChatId(savedActiveId);
        } else if (parsedChats.length > 0) {
          setActiveChatId(parsedChats[0].id);
        } else {
          createNewChat();
        }
      } else {
        createNewChat();
      }
    } catch (error) {
      console.error('Failed to load chats from local storage', error);
      createNewChat();
    }
  }, [createNewChat]);
  
  useEffect(() => {
    if (chats.length > 0) {
        localStorage.setItem('prezenta_chats', JSON.stringify(chats));
    }
    if (activeChatId) {
        localStorage.setItem('prezenta_active_chat_id', activeChatId);
    }
  }, [chats, activeChatId]);


  useEffect(() => {
    const derivedHistory = chats
        .filter(chat => chat.messages.length > 0)
        .map(chat => {
            const firstUserMessage = chat.messages.find(m => m.role === 'user');
            const lastAssistantMessage = [...chat.messages].reverse().find(m => m.role === 'assistant' && m.type === 'outline');
            return {
                id: chat.id,
                original: firstUserMessage?.content || chat.title,
                outline: lastAssistantMessage?.content || '',
                timestamp: chat.createdAt,
            } as HistoryItem;
        })
        .filter(item => item.outline);
    setHistory(derivedHistory);
    setIsHistoryLoaded(true);
  }, [chats]);

  useEffect(() => {
    if (isHistoryLoaded) {
      localStorage.setItem('prezenta_history', JSON.stringify(history));
    }
  }, [history, isHistoryLoaded]);
  
  const updateChat = (chatId: string, updates: Partial<Chat>) => {
      setChats(prev => prev.map(c => c.id === chatId ? {...c, ...updates} : c));
  }
  
  const addMessageToChat = (chatId: string, message: Message) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  };
  
  const updateMessageInChat = (chatId: string, messageId: string, updates: Partial<Message>) => {
      setChats(prev => prev.map(chat => chat.id === chatId ? {
          ...chat,
          messages: chat.messages.map(msg => msg.id === messageId ? {...msg, ...updates} : msg)
      } : chat));
  }
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleSendMessage = async (payload: SendMessagePayload) => {
    const { text, file } = payload;
    let topic = text;
    let userMessageContent = text;

    if (file) {
      try {
        const fileContent = await readFileAsText(file);
        topic = `${text}\n\nFile Content:\n${fileContent}`;
        userMessageContent = `${text}\n\nFile attached: ${truncateFileName(file.name)}`;
      } catch (error) {
        toast.error("Failed to read file.");
        console.error("File read error:", error);
        return;
      }
    }
    
    if (topic.length > MAX_CONTENT_LENGTH) {
        toast('Content is too long and will be truncated.');
        topic = topic.substring(0, MAX_CONTENT_LENGTH);
    }
    
    if (!topic.trim()) return;

    let currentChatId = activeChatId;

    if (!currentChatId || selectedHistoryId) {
      const newChat = createNewChat(true);
      currentChatId = newChat.id;
    }

    const currentChat = chats.find(c => c.id === currentChatId);
    
    if (currentChat && currentChat.messages.length === 0) {
      const newTitle = text.length > 30 ? `${text.substring(0, 27)}...` : (text || file?.name || 'New Chat');
      updateChat(currentChatId, { title: newTitle });
    }
  
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: userMessageContent,
      status: 'complete',
      timestamp: Date.now(),
    };
    addMessageToChat(currentChatId, userMessage);
    setMessage('');
    setIsLoading(true);
  
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      status: 'loading',
      timestamp: Date.now() + 1,
    };
    addMessageToChat(currentChatId, assistantMessage);
  
    try {
      const result = await generateOutlineAction({ topic, numberOfSlides, textAmount });
      if (result.outline) {
        updateMessageInChat(currentChatId, assistantMessage.id, {
          content: result.outline,
          status: 'complete',
          type: 'outline',
        });
      } else {
        throw new Error('Failed to generate outline.');
      }
    } catch (error) {
      console.error('Error generating outline:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      updateMessageInChat(currentChatId, assistantMessage.id, {
        content: `Error: ${errorMessage}`,
        status: 'failed',
        retryData: {
          action: 'resend',
          request: { topic, numberOfSlides, textAmount },
        },
      });
      toast.error('Failed to generate outline.');
    } finally {
      setIsLoading(false);
    }
  };

  const retryMessage = (failedMessageId: string) => {
    if (!activeChatId) return;
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;

    const messageToRetry = chat.messages.find(m => m.id === failedMessageId);
    if (!messageToRetry || !messageToRetry.retryData) {
      toast.error('Could not retry message. No retry data found.');
      return;
    }
    
    const { action, request, originalMessageId } = messageToRetry.retryData;

    // Immediately remove the failed message from the UI
    deleteMessage(failedMessageId);

    // Use a short timeout to ensure the state update for deletion has processed
    // before initiating the new request.
    setTimeout(() => {
        if (action === 'resend') {
            const { topic } = request as { topic: string };
            const userMessage = chat.messages
                .filter(m => m.role === 'user')
                .find(m => m.timestamp < messageToRetry.timestamp);
            
            handleSendMessage({ text: userMessage?.content || topic, file: undefined });
        } else if (action === 'improve' && originalMessageId) {
            const { outline } = request as { outline: string };
            improveOutline(originalMessageId, outline);
        }
    }, 50);
  };
  
  const deleteMessage = (messageId: string) => {
    if (!activeChatId) return;
    setChats(prev => prev.map(chat => chat.id === activeChatId ? {
        ...chat,
        messages: chat.messages.filter(m => m.id !== messageId)
    } : chat));
  };
  
  const updateMessageContent = (messageId: string, newContent: string) => {
    if (!activeChatId) return;
    updateMessageInChat(activeChatId, messageId, { content: newContent });
  };
  
  const improveOutline = async (messageId: string, outline: string) => {
    if (!activeChat) return;

    setImprovingMessageId(messageId);
    setIsImproving(true);
    
    const assistantMessage: Message = { id: uuidv4(), role: 'assistant', content: '', status: 'loading', timestamp: Date.now() + 1 };
    addMessageToChat(activeChat.id, assistantMessage);

    try {
        const result = await improveOutlineAction({ outline, numberOfSlides, textAmount });
        if (result.improvedOutline) {
            updateMessageInChat(activeChat.id, assistantMessage.id, { content: result.improvedOutline, status: 'complete', type: 'outline' });
        } else {
            throw new Error("The AI failed to generate an improved outline. Please try again.");
        }
    } catch(e) {
        const error = e as Error;
        const errorMessage = error.message || 'An unknown error occurred.';
        toast.error(errorMessage);
        updateMessageInChat(activeChat.id, assistantMessage.id, { 
            content: `Error: ${errorMessage}`, 
            status: 'failed',
            retryData: {
                action: 'improve',
                request: { outline, numberOfSlides, textAmount },
                originalMessageId: messageId
            }
        });
    } finally {
        setIsImproving(false);
        setImprovingMessageId(null);
    }
  };

  const selectHistory = (item: HistoryItem) => {
    const chatExists = chats.some(c => c.id === item.id);
    if (!chatExists) {
      return;
    }
    setActiveChatId(item.id);
    setSelectedHistoryId(item.id);
  };

  const removeHistory = (id: string) => {
    setChats(prev => prev.filter(chat => chat.id !== id));
    if (activeChatId === id) {
      const remainingChats = chats.filter(c => c.id !== id);
      if (remainingChats.length > 0) {
        setActiveChatId(remainingChats[0].id);
        setSelectedHistoryId(remainingChats[0].id)
      } else {
        createNewChat();
      }
    }
  };

  const removeHistoryItems = (ids: string[]) => {
    const remainingChats = chats.filter(chat => !ids.includes(chat.id));
    setChats(remainingChats);
    if (activeChatId && ids.includes(activeChatId)) {
        if (remainingChats.length > 0) {
            setActiveChatId(remainingChats[0].id);
            setSelectedHistoryId(remainingChats[0].id);
        } else {
            createNewChat();
        }
    }
  };

  const clearHistory = () => {
    setChats([]);
    createNewChat();
  };

  const value: ChatState = {
    chats,
    activeChatId,
    activeChat,
    isLoading,
    isImproving,
    improvingMessageId,
    message,
    setMessage,
    handleSendMessage,
    retryMessage,
    deleteMessage,
    updateMessageContent,
    improveOutline,
    history,
    isHistoryLoaded,
    selectHistory,
    removeHistory,
    removeHistoryItems,
    clearHistory,
    createNewChat,
    selectedHistoryId,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};

export const useChat = (): ChatState => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
