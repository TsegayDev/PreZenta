'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/use-chat';
import MessageBubble from './message-bubble';
import ChatWelcome from './chat-welcome';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ChevronDown, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
export default function ChatArea() {
  const { activeChat, setMessage } = useChat();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [userHasScrolled, setUserHasScrolled] = React.useState(false);
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  // Check if there's a streaming message
  React.useEffect(() => {
    if (activeChat) {
      const streamingMessage = activeChat.messages.find(msg => msg.status === 'streaming');
      setIsStreaming(!!streamingMessage);
    } else {
      setIsStreaming(false);
    }
  }, [activeChat?.messages]);
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };
  React.useEffect(() => {
    if (!userHasScrolled) {
      scrollToBottom();
    }
  }, [activeChat?.messages, userHasScrolled]);
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    setUserHasScrolled(!isAtBottom);
    setShowScrollButton(!isAtBottom);
  };
  const handleScrollToBottom = () => {
    scrollToBottom();
    setUserHasScrolled(false);
    setShowScrollButton(false);
  };
  // Animation variants for messages
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  return (
    <ScrollArea 
      className="flex-1 relative overflow-x-hidden" 
      onScroll={handleScroll}
      ref={scrollAreaRef}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 z-0"></div>
      
      <div className="relative z-10 p-3 md:p-8 lg:p-10 w-full overflow-x-hidden">
        {activeChat && activeChat.messages.length > 0 ? (
          <div className="space-y-6 max-w-4xl w-full">
            <AnimatePresence>
              {activeChat.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full"
                >
                  <MessageBubble message={message} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Loading indicator at the bottom when streaming */}
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-4 w-full"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 max-w-md">
                  <Loader className="w-4 h-4 animate-spin text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 break-words">AI is thinking...</span>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} className="h-px" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <ChatWelcome onPromptClick={setMessage} />
          </motion.div>
        )}
      </div>
      
      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 right-6 z-20"
          >
            <Button
              onClick={handleScrollToBottom}
              size="icon"
              className="rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 h-12 w-12 flex-shrink-0"
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollArea>
  );
}
