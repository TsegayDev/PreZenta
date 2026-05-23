"use client";
import * as React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/logo';
import { Trash2, History, X, Search, TriangleAlert, Copy, Edit, FileText } from 'lucide-react';
import type { HistoryItem, AppUser } from '@/lib/types';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { UserNav } from './user-nav';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface HistorySidebarProps {
  history: HistoryItem[];
  isLoaded: boolean;
  onSelectHistory: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
  onRemoveItems: (ids: string[]) => void;
  onClear: () => void;
  user: AppUser | null;
  onSignOut: () => void;
  onCreateNewChat: () => void;
  activeChatId: string | null;
  selectedHistoryId: string | null;
}

export function HistorySidebar({ 
  history, 
  isLoaded, 
  onSelectHistory, 
  onRemove, 
  onRemoveItems, 
  onClear, 
  user, 
  onSignOut, 
  onCreateNewChat, 
  activeChatId, 
  selectedHistoryId 
}: HistorySidebarProps) {
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  const [isClearAllOpen, setIsClearAllOpen] = React.useState(false);
  const { toggleSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const { toast } = useToast();
  
  const filteredHistory = React.useMemo(() => {
    if (!searchQuery) return history;
    return history.filter(item => 
      item.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.outline.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);
  
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  const handleToggleSearch = () => {
    setIsSearchVisible(prev => !prev);
    if (isSearchVisible) {
        setSearchQuery('');
    }
  }
  
  const handleDelete = () => {
    if (itemToDelete) {
      onRemove(itemToDelete);
      setItemToDelete(null);
      toast({ title: 'Item deleted', description: 'History item has been removed' });
    }
  }
  
  const handleClear = () => {
    if (searchQuery) {
      const idsToDelete = filteredHistory.map(item => item.id);
      onRemoveItems(idsToDelete);
      toast({ 
        title: 'Search results cleared', 
        description: `${idsToDelete.length} items matching your search have been removed` 
      });
    } else {
      onClear();
      toast({ 
        title: 'History cleared', 
        description: 'All history items have been removed' 
      });
    }
    setIsClearAllOpen(false);
  }
  
  const formatTimestamp = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }
  
  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  }
  
  const clearDialogDescription = searchQuery 
    ? `This will permanently delete the ${filteredHistory.length} items matching your search.`
    : "This action cannot be undone. This will permanently delete your entire expansion history.";
    
  const getHistoryItemPreview = (item: HistoryItem) => {
    return item.outline;
  }
  
  return (
    <Sidebar side="left" className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <SidebarHeader className="p-0">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Logo className="w-8 h-8 text-indigo-600 dark:text-indigo-400"/>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground/90">
                PreZenta
              </h1>
              <p className="text-xs text-muted-foreground">
                Design your slides
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30" 
            onClick={onCreateNewChat}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Create New Chat</span>
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-0 flex flex-col">
        <div className="p-3 border-b bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
          <div className="flex items-center justify-between px-2 h-9">
            <AnimatePresence mode="wait">
              {isSearchVisible ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 w-full"
                >
                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="title"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-sm font-semibold text-foreground/90">
                    History
                  </h2>
                  {history.length > 0 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                      {history.length}
                    </Badge>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30" 
                onClick={handleToggleSearch}
              >
                {isSearchVisible ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                <span className="sr-only">{isSearchVisible ? 'Close search' : 'Open search'}</span>
              </Button>
              
              {history.length > 0 && !isSearchVisible && (
                <AlertDialog open={isClearAllOpen} onOpenChange={setIsClearAllOpen}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-full text-xs h-7 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                        <TriangleAlert className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription className="mt-2">
                            {clearDialogDescription}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                      </div>
                    </div>
                    <AlertDialogFooter className="mt-4 gap-2 sm:flex-row sm:justify-end">
                      <AlertDialogCancel className='rounded'>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClear} className="rounded bg-destructive hover:bg-destructive/90">Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-3">
              {!isLoaded && (
                <div className="p-4 space-y-4">
                  <div className="h-24 w-full rounded-xl bg-muted animate-pulse" />
                  <div className="h-24 w-full rounded-xl bg-muted animate-pulse" />
                  <div className="h-24 w-full rounded-xl bg-muted animate-pulse" />
                </div>
              )}
              
              {isLoaded && history.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <p className="text-base font-medium text-muted-foreground mb-1">
                    No history yet
                  </p>
                  <p className="text-sm text-muted-foreground/80">
                    Your presentations will appear here
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={onCreateNewChat}
                  >
                    Create your first presentation
                  </Button>
                </div>
              ) : (
                <AlertDialog>
                  <AnimatePresence>
                    {filteredHistory.length === 0 && searchQuery ? (
                      <div className="text-center py-8 px-4">
                        <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">
                          No results found
                        </p>
                        <p className="text-xs text-muted-foreground/80 mt-1">
                          Try a different search term
                        </p>
                      </div>
                    ) : (
                      filteredHistory.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                          className="group relative"
                        >
                          <div 
                            className={cn(
                              "p-4 bg-card rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md",
                              item.id === selectedHistoryId 
                                ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/20" 
                                : "border-border/30 hover:border-accent hover:bg-accent/50"
                            )}
                            onClick={() => onSelectHistory(item)}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-xs text-muted-foreground">
                                {formatTimestamp(item.timestamp)}
                              </p>
                              {item.id === activeChatId && (
                                <Badge variant="outline" className="text-xs h-5 px-2 py-0">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium line-clamp-1 mb-2">
                              {item.original}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {getHistoryItemPreview(item)}
                            </p>
                          </div>
                          
                          <div className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 flex items-center gap-1 transition-opacity duration-200 bg-background/80 backdrop-blur-sm rounded p-1 shadow-sm">
                            <button
                              onClick={(e) => handleCopy(e, item.outline)}
                              className="p-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded transition-colors"
                              aria-label="Copy expanded text"
                            >
                              <Copy className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </button>
                            <AlertDialogTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setItemToDelete(item.id);
                                }}
                                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                aria-label="Delete item"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            </AlertDialogTrigger>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                  
                  <AlertDialogContent>
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                        <TriangleAlert className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="mt-2">
                            This will permanently delete this history item.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                      </div>
                    </div>
                    <AlertDialogFooter className="mt-4 gap-2 sm:flex-row sm:justify-end">
                      <AlertDialogCancel onClick={() => setItemToDelete(null)} className='rounded'>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="rounded bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </ScrollArea>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="flex flex-row items-center justify-between gap-2 p-3 border-t bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
        {user && <UserNav user={user} onSignOut={onSignOut} side="top" align="start" triggerVariant="detailed" />}
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}