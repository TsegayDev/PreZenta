'use client';
import * as React from 'react';
import { Paperclip, Send, BrainCircuit, Search, ArrowUp, File as FileIcon, X, FileImage, FileText, FileSpreadsheet, FileJson, FileType, Square, ClipboardPaste, Sparkles, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '@/hooks/use-chat';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';
import { NumberOfSlidesSelector } from './number-of-slides-selector';

const MESSAGES = {
  PLACEHOLDER: 'Write your message here (Ctrl + Enter to send)...',
  FOOTER: 'PreZenta may make mistakes. Consider checking important information.',
  FILE_TOO_LARGE: 'File size exceeds 10MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Supported: PDF, TXT, DOC, PPT, XLS, CSV, JSON, MD, and code files',
  DRAG_DROP: 'Drop file to attach',
  MAX_FILES: 'Only one file can be uploaded at a time.',
};

const LIMITS = {
  MAX_INPUT_LENGTH: 20000,
  TEXTAREA_MAX_ROWS: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/json',
  'text/markdown'
];

const ACCEPTED_FILE_EXTENSIONS = [
  '.txt', '.md', '.json', '.csv', '.xml', '.html', '.css',
  '.js', '.ts', '.jsx', '.tsx',
  '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.php', '.swift', '.kt', '.sql', '.yaml', '.yml'
];

type UploadStatus = 'uploading' | 'parsing' | 'complete' | 'error';

interface UploadedFile {
  file: File;
  progress: number;
  status: UploadStatus;
}

const getFileIcon = (fileType: string, fileName: string) => {
  if (fileType.startsWith('image/')) return <FileImage className="h-5 w-5 text-blue-500"/>;
  if (fileType === 'application/pdf') return <FileText className="h-5 w-5 text-red-500"/>;
  if (fileType.includes('spreadsheetml') || fileType.includes('ms-excel') || fileType === 'text/csv' || fileName.endsWith('.csv')) 
    return <FileSpreadsheet className="h-5 w-5 text-green-500"/>;
  if (fileType.includes('wordprocessingml') || fileType.includes('msword')) 
    return <FileText className="h-5 w-5 text-blue-600"/>;
  if (fileType.includes('presentationml') || fileType.includes('ms-powerpoint')) 
    return <FileType className="h-5 w-5 text-orange-500"/>;
  if (fileType === 'application/json' || fileName.endsWith('.json')) 
    return <FileJson className="h-5 w-5 text-yellow-500"/>;
  return <FileIcon className="h-5 w-5 text-purple-500"/>;
};

const isValidFile = (file: File): boolean => {
  if (file.size > LIMITS.MAX_FILE_SIZE) {
    toast.error(MESSAGES.FILE_TOO_LARGE);
    return false;
  }
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType = ACCEPTED_FILE_TYPES.includes(file.type) || ACCEPTED_FILE_EXTENSIONS.includes(fileExtension || '');
  if (!isValidType) {
    toast.error(MESSAGES.INVALID_FILE_TYPE);
    return false;
  }
  return true;
};

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

export function InputBox() {
  const { message, setMessage, handleSendMessage, isLoading, cancelResponse } = useChat();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile | null>(null);
  const dragCounter = React.useRef(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      cancelResponse?.();
      return;
    }
    
    let content = message.trim();
    if (!content && !uploadedFile) return;
    handleSendMessage({
        text: content,
        file: uploadedFile?.file,
    });
    
    setMessage('');
    setUploadedFile(null);
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    
    const computedStyle = getComputedStyle(textarea);
    const lineHeight = parseInt(computedStyle.lineHeight, 10);
    const paddingTop = parseInt(computedStyle.paddingTop, 10);
    const paddingBottom = parseInt(computedStyle.paddingBottom, 10);
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = lineHeight * LIMITS.TEXTAREA_MAX_ROWS + paddingTop + paddingBottom;
    if (scrollHeight <= maxHeight) {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = 'hidden';
    } else {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = 'auto';
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (files.length > 1) {
      toast.error(MESSAGES.MAX_FILES);
      return;
    }
    const file = files[0];
    if (!isValidFile(file)) return;
    setUploadedFile({ file, progress: 0, status: 'uploading' });
    const uploadInterval = setInterval(() => {
      setUploadedFile(prev => {
        if (!prev) {
          clearInterval(uploadInterval);
          return null;
        }
        if (prev.progress < 100) {
          return { ...prev, progress: prev.progress + 10 };
        }
        clearInterval(uploadInterval);
        setTimeout(() => {
          setUploadedFile(p => p ? { ...p, status: 'parsing' } : null);
        }, 300);
        setTimeout(() => {
          setUploadedFile(p => p ? { ...p, status: 'complete' } : null);
        }, 1000);
        return prev;
      });
    }, 100);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      e.dataTransfer.dropEffect = 'copy';
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const cancelUpload = () => {
    setUploadedFile(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setMessage(prev => prev + text);
    } catch (error) {
      toast.error('Failed to read from clipboard.');
      console.error('Clipboard paste error:', error);
    }
  };

  const isSubmitDisabled = !isLoading && !message.trim() && !uploadedFile;
  const isInputEmpty = message.trim().length === 0;

  const getUploadStatusText = (status: UploadStatus, progress: number) => {
    switch (status) {
      case 'uploading':
        return `Uploading... ${progress}%`;
      case 'parsing':
        return 'Parsing...';
      case 'complete':
        return 'Ready to send';
      case 'error':
        return 'Upload failed';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'uploading':
        return <Upload className="w-4 h-4 text-blue-500" />;
      case 'parsing':
        return <BrainCircuit className="w-4 h-4 text-purple-500" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-background to-background/80 p-4 backdrop-blur-lg border-t border-border/50 mt-auto flex-shrink-0 w-full">
      <div className="relative mx-auto max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              "w-full max-w-4xl mx-auto p-4 bg-gradient-to-br from-card to-card/80 border border-border/70 rounded-2xl flex flex-col gap-3 shadow-lg relative transition-all duration-300",
              isDragging && "border-primary/50 shadow-primary/10"
            )}
          >
            <AnimatePresence>
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-medium backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <Upload className="w-10 h-10 mb-3" />
                  </motion.div>
                  <div className="text-lg font-semibold">{MESSAGES.DRAG_DROP}</div>
                  <div className="text-sm opacity-80 mt-1">or click the attach button</div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {uploadedFile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50"
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(uploadedFile.file.type, uploadedFile.file.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{truncateFileName(uploadedFile.file.name)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress 
                        value={uploadedFile.progress} 
                        className="h-1.5 w-24"
                      />
                      <div className="flex items-center gap-1">
                        {getStatusIcon(uploadedFile.status)}
                        <p className="text-xs text-muted-foreground">
                          {getUploadStatusText(uploadedFile.status, uploadedFile.progress)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    onClick={cancelUpload}
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4"/>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder={MESSAGES.PLACEHOLDER}
                className="flex-1 resize-none bg-transparent border-0 text-foreground placeholder:text-muted-foreground/60 outline-0 focus:outline-none shadow-none focus-visible:ring-0 p-0 overflow-y-hidden text-sm min-h-[40px] transition-all duration-200"
                rows={1}
                maxLength={LIMITS.MAX_INPUT_LENGTH}
                disabled={isLoading}
              />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <NumberOfSlidesSelector />
              </div>
              
              <div className="flex-grow" />
              
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-all duration-200",
                    isInputEmpty && "hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  )}
                  onClick={isInputEmpty ? handlePaste : () => setMessage('')}
                  disabled={isLoading}
                  title={isInputEmpty ? "Paste from clipboard" : "Clear input"}
                  aria-label={isInputEmpty ? "Paste from clipboard" : "Clear input"}
                >
                  {isInputEmpty ? (
                    <ClipboardPaste className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-all duration-200"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  aria-label="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                
                <motion.div
                  whileHover={!isSubmitDisabled ? { scale: 1.05 } : {}}
                  whileTap={!isSubmitDisabled ? { scale: 0.95 } : {}}
                >
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isSubmitDisabled}
                    className={cn(
                      "p-2.5 rounded-full transition-all duration-300 shadow-md",
                      isSubmitDisabled
                        ? "bg-muted cursor-not-allowed text-gray-400 dark:text-gray-100 hover:scale-100"
                        : isLoading
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/20"
                        : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-blue-500/20"
                    )}
                    aria-label={isLoading ? 'Stop generating' : 'Send message'}
                  >
                    {isLoading ? (
                      <Square className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </form>
        
        <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            accept={[...ACCEPTED_FILE_TYPES, ...ACCEPTED_FILE_EXTENSIONS].join(',')}
            aria-label="File upload"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-xs text-muted-foreground pt-3 px-4">
          {MESSAGES.FOOTER}
        </p>
      </motion.div>
    </div>
  );
}