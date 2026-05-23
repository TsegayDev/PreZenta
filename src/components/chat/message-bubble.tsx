'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import {
  Copy,
  RefreshCw,
  User,
  MoreVertical,
  Check,
  Bot,
  Trash2,
  Edit,
  Save,
  X,
  Sparkles,
  Loader,
  Presentation,
  Code,
  Square,
} from 'lucide-react';
import type { Message } from '@/lib/types';
import toast from 'react-hot-toast';
import { useChat } from '@/hooks/use-chat';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useSlideEditor } from '@/hooks/use-slide-editor';

interface MessageBubbleProps {
  message: Message;
  onStopThinking?: () => void;
}

// Shared components
const ShimmerText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent dark:via-purple-500/20 z-0"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 0.5
        }}
      />
    </span>
  );
};

const TypingCursor = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="inline-block w-1.5 h-5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-sm ml-1"
  />
);

const LoadingIndicator = () => (
  <div className="flex items-center justify-center py-3">
    <div className="flex space-x-1.5">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  </div>
);

// Thinking Bubble Component


export const ThinkingBubble = ({ onStop }: { onStop?: () => void }) => {
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isStopped, setIsStopped] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  const handleStop = () => {
    setIsStopped(true);
    if (onStop) onStop();
  };

  // Dynamic color classes based on theme
  const bgColor = theme === 'dark' 
    ? 'bg-gray-800' 
    : 'bg-gray-100';
    
  const borderColor = theme === 'dark' 
    ? 'border-gray-700' 
    : 'border-gray-200';
    
  const appNameColor = theme === 'dark' 
    ? 'text-white' 
    : 'text-gray-900';
    
  const timestampColor = theme === 'dark' 
    ? 'text-gray-400' 
    : 'text-gray-500';
    
  const thinkingColor = isStopped 
    ? 'text-red-500' 
    : (theme === 'dark' ? 'text-purple-400' : 'text-purple-600');
    
  const dotsColor = isStopped 
    ? 'bg-red-500' 
    : (theme === 'dark' ? 'bg-purple-400' : 'bg-purple-600');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center w-full rounded-xl shadow-lg border p-3",
        bgColor,
        borderColor
      )}
    >
      {/* Bot Icon - Using AI brand colors (purple to pink gradient) */}
      <div className="flex-shrink-0 mr-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
          <Bot className="h-5 w-5 text-white" />
        </div>
      </div>
      
      {/* App Name and Timestamp */}
      <div className="flex flex-col mr-4">
        <span className={cn("font-semibold", appNameColor)}>PreZenta AI</span>
        <span className={cn("text-xs mt-1", timestampColor)}>{formattedTime}</span>
      </div>
      
      {/* Thinking Text with Dots */}
      <div className="flex flex-col items-start mr-4">
        <motion.span 
          className={cn("font-medium", thinkingColor)}
          animate={!isStopped ? {
            opacity: [0.7, 1, 0.7],
            textShadow: theme === 'dark' 
              ? ["0 0 0px rgba(192, 132, 252, 0)", "0 0 10px rgba(192, 132, 252, 0.5)", "0 0 0px rgba(192, 132, 252, 0)"]
              : ["0 0 0px rgba(126, 34, 206, 0)", "0 0 10px rgba(126, 34, 206, 0.3)", "0 0 0px rgba(126, 34, 206, 0)"]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {isStopped ? "Stopped" : "Thinking"}
        </motion.span>
        {!isStopped && (
           <div className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        )}
      </div>
      
      {/* Stop Icon Button */}
      <div className="flex-shrink-0 ml-auto">
        <Button
          onClick={handleStop}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md",
            isStopped 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-red-500 hover:bg-red-600"
          )}
        >
          {isStopped ? (
            <Check className="h-4 w-4 text-white" />
          ) : (
            <Square className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>
    </motion.div>
  );
};

// User Message Bubble Component
const UserMessageBubble = ({ 
  message, 
  onCopy, 
  onDelete 
}: { 
  message: Message; 
  onCopy: (text: string) => void;
  onDelete: () => void;
}) => {
  const timestamp = new Date(message.timestamp);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end w-full mb-6"
    >
      <div className="w-full max-w-4xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/40 dark:border-blue-800/40 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col break-words transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200/40 dark:border-gray-700/40">
          <Avatar className="w-8 h-8 mr-3 ring-2 ring-blue-500/30 flex-shrink-0 shadow-sm">
            <div className="flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-inner">
              <User className="h-4 w-4 text-white" />
            </div>
          </Avatar>
          <div className="flex flex-col flex-grow min-w-0">
            <span className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">You</span>
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 rounded-full transition-all duration-200 text-blue-600 dark:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-blue-900/40"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm">
                <DropdownMenuItem 
                  onSelect={handleCopy}
                  className="rounded-lg"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy Raw Text</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={onDelete}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 rounded-lg"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-4 w-full prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p({ children }) {
                return <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed break-words">{children}</p>;
              },
              // ... other markdown components
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/60 to-gray-100/60 dark:from-gray-800/40 dark:to-gray-900/40">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 h-auto rounded-full transition-all duration-200 text-blue-600 dark:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 flex items-center gap-1"
            title="Copy"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// AI Message Bubble Component
const AIMessageBubble = ({ 
  message, 
  theme,
  onCopy, 
  onDelete, 
  onRetry,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onImprove,
  onGenerateSlides,
  isEditing,
  editedContent,
  setEditedContent,
  isGenerating,
  isCurrentlyImproving,
  isOutline,
  copiedText,
  isFailed,
  isStreaming
}: { 
  message: Message;
  theme: string | undefined;
  onCopy: (text: string) => void;
  onDelete: () => void;
  onRetry: () => void;
  onEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onImprove: () => void;
  onGenerateSlides: () => void;
  isEditing: boolean;
  editedContent: string;
  setEditedContent: (content: string) => void;
  isGenerating: boolean;
  isCurrentlyImproving: boolean;
  isOutline: boolean;
  copiedText: string;
  isFailed: boolean;
  isStreaming: boolean;
}) => {
  const timestamp = new Date(message.timestamp);

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="flex flex-col gap-3 p-4">
          <Textarea
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
            className="w-full min-h-[200px] text-sm font-mono border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent break-words shadow-sm"
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCancelEdit}
              className="rounded-full px-4 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={onSaveEdit}
              className="rounded-full px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-md"
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p({ children }) {
              return (
                <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed break-words">
                  {isStreaming ? <ShimmerText>{children}</ShimmerText> : children}
                </p>
              );
            },
            pre({ children }) {
              return <div className="my-3 w-full overflow-x-auto">{children}</div>;
            },
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');
              const syntaxTheme = theme === 'dark' ? oneDark : oneLight;
              const isCopied = copiedText === codeString;
              const isFenced =
                className ||
                (node.children.length > 0 &&
                  'value' in node.children[0] &&
                  (node.children[0].value as string).includes('\n'));
              const isPlainTextBlock = isFenced && !match;
              
              if (isFenced) {
                return (
                  <div className="relative rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-md my-4 w-full max-w-full">
                    <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-sans text-gray-300">
                          {match ? match[1] : 'text'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg flex-shrink-0"
                        onClick={() =>
                          onCopy(
                            codeString, isPlainTextBlock ? 'Text' : 'Code'
                          )
                        }
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {match ? (
                      <SyntaxHighlighter
                        style={syntaxTheme}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          padding: '1.25rem',
                          backgroundColor: 'transparent',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          width: '100%',
                          maxWidth: '100%',
                        }}
                        codeTagProps={{
                          style: {
                            whiteSpace: 'pre-wrap',
                            backgroundColor: 'transparent',
                            wordBreak: 'break-word',
                            fontSize: '0.875rem',
                            fontFamily: 'var(--font-code)',
                          },
                        }}
                        wrapLongLines={true}
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    ) : (
                      <pre
                        style={{
                          margin: 0,
                          padding: '1.25rem',
                          backgroundColor: 'transparent',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          width: '100%',
                          maxWidth: '100%',
                        }}
                      >
                        <code
                          {...props}
                          style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            backgroundColor: 'transparent',
                            fontSize: '0.875rem',
                            fontFamily: 'var(--font-mono)',
                          }}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {children}
                        </code>
                      </pre>
                    )}
                  </div>
                );
              }
              // Inline code
              return (
                <code
                  className="font-code text-sm font-normal bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md px-2 py-1 break-all"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            // ... other markdown components
          }}
        >
          {message.content}
        </ReactMarkdown>
        {isStreaming && <TypingCursor />}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start w-full mb-6"
    >
      <div className="w-full max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-900/60 border border-gray-200/40 dark:border-gray-700/40 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col break-words transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200/40 dark:border-gray-700/40">
          <Avatar className="w-8 h-8 mr-3 ring-2 ring-purple-500/30 flex-shrink-0 shadow-sm">
            <div className="flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-inner">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </Avatar>
          <div className="flex flex-col flex-grow min-w-0">
            <span className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">PreZenta AI</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 rounded-full transition-all duration-200 text-gray-500 hover:bg-gray-200/60 dark:hover:bg-gray-700/40"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm">
                <DropdownMenuItem 
                  onSelect={() => onCopy(message.content)}
                  className="rounded-lg"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy Raw Text</span>
                </DropdownMenuItem>
                {isOutline && !isEditing && (
                  <DropdownMenuItem 
                    onSelect={onEdit}
                    className="rounded-lg"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Outline</span>
                  </DropdownMenuItem>
                )}
                {isFailed && (
                  <DropdownMenuItem 
                    onSelect={onRetry}
                    className="rounded-lg"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Retry</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onSelect={onDelete}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 rounded-lg"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-4 w-full prose prose-sm dark:prose-invert max-w-none">
          {renderContent()}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gray-50/60 to-gray-100/60 dark:from-gray-800/40 dark:to-gray-900/40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCopy(message.content)}
            className="text-xs px-3 py-1.5 h-auto rounded-full transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-700/40 flex items-center gap-1"
            title="Copy"
          >
            {copiedText === message.content ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </Button>
          
          <div className="flex items-center gap-2">
            {isOutline && !isEditing && (
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onImprove}
                        disabled={isCurrentlyImproving}
                        className="h-8 text-xs rounded-full px-3 flex items-center gap-1 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-100/60 dark:hover:bg-purple-900/40"
                      >
                        {isCurrentlyImproving ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        Improve
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Enhance with AI</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={onGenerateSlides}
                        disabled={isGenerating}
                        className="h-8 text-xs rounded-full px-3 flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-md"
                      >
                        {isGenerating ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Presentation className="h-4 w-4" />
                        )}
                        Generate
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Create presentation slides</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )}
            {isFailed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRetry}
                className="text-xs px-3 py-1.5 h-auto rounded-full transition-all duration-200 text-red-500 hover:bg-red-100/60 dark:hover:bg-red-900/40"
                title="Retry"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main MessageBubble Component
export default function MessageBubble({ message, onStopThinking }: MessageBubbleProps) {
  const { theme } = useTheme();
  const { retryMessage, deleteMessage, updateMessageContent, improveOutline, isImproving, improvingMessageId } = useChat();
  const [copiedText, setCopiedText] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(message.content);
  const { openEditor } = useSlideEditor();
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  const isUser = message.role === 'user';
  const isLoading = message.status === 'loading';
  const isStreaming = message.status === 'streaming';
  const isFailed = message.status === 'failed';
  const isOutline = message.type === 'outline';
  const isCurrentlyImproving = isImproving && improvingMessageId === message.id;

  const handleCopy = async (text: string, type: string = 'Text') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success(`${type} copied to clipboard`);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      toast.error(`Failed to copy ${type.toLowerCase()}`);
    }
  };

  const handleRetry = () => {
    retryMessage(message.id);
  };

  const handleDelete = () => {
    deleteMessage(message.id);
    toast.success('Message deleted.');
  };

  const handleEdit = () => {
    setEditedContent(message.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(message.content);
  };

  const handleSaveEdit = () => {
    updateMessageContent(message.id, editedContent);
    setIsEditing(false);
    toast.success('Outline updated.');
  };

  const handleImprove = () => {
    if (isOutline) {
      improveOutline(message.id, message.content);
    }
  };

  const handleGenerateSlides = async () => {
    if (!isOutline) {
      toast.error('This message does not contain a presentation outline.');
      return;
    }
    
    setIsGenerating(true);
    toast.success('Opening the slide editor...');
    
    try {
      openEditor(message.content);
    } catch (error) {
      console.error('Error opening slide editor:', error);
      toast.error('Could not open the slide editor. Please try again.');
    } finally {
      setTimeout(() => setIsGenerating(false), 500);
    }
  };

  // Render the appropriate bubble based on message type
  if (!isUser && isLoading) {
    return <ThinkingBubble onStop={onStopThinking} />;
  }

  if (isUser) {
    return (
      <UserMessageBubble
        message={message}
        onCopy={handleCopy}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <AIMessageBubble
      message={message}
      theme={theme}
      onCopy={handleCopy}
      onDelete={handleDelete}
      onRetry={handleRetry}
      onEdit={handleEdit}
      onSaveEdit={handleSaveEdit}
      onCancelEdit={handleCancelEdit}
      onImprove={handleImprove}
      onGenerateSlides={handleGenerateSlides}
      isEditing={isEditing}
      editedContent={editedContent}
      setEditedContent={setEditedContent}
      isGenerating={isGenerating}
      isCurrentlyImproving={isCurrentlyImproving}
      isOutline={isOutline}
      copiedText={copiedText}
      isFailed={isFailed}
      isStreaming={isStreaming}
    />
  );
}