
'use client';
import React, { useState, useEffect } from 'react';
import { Palette, SlidersHorizontal, Sparkles, Menu, Settings, Download, LogOut } from 'lucide-react';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { UserNav } from '@/components/user-nav';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet';
import { HistorySidebar } from '@/components/history-sidebar';
import type { AppUser } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { InputBox } from '@/components/input-box';
import { ChatProvider } from '@/hooks/use-chat';
import { AppLoader } from '@/components/app-loader';
import ChatArea from '@/components/chat/chat-area';
import { useChat } from '@/hooks/use-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HistoryDropdown } from '@/components/history-dropdown';
import { TextAmountSelector } from '@/components/text-amount-selector';
import { ImageSourceSelector } from '@/components/image-source-selector';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';

function RightPanelContent() {
  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Content Settings
            </h4>
            <div className="space-y-3">
              <TextAmountSelector />
              <ImageSourceSelector />
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Advanced Options
            </h4>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto-format slides</span>
                  <Badge variant="outline" className="text-xs h-5 px-1.5">Beta</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Automatically format your slides for consistency</p>
              </div>
              
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Smart suggestions</span>
                  <Badge variant="outline" className="text-xs h-5 px-1.5">New</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Get AI-powered content suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

function PreZentaChat() {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const {
    history,
    isHistoryLoaded,
    selectHistory,
    removeHistory,
    removeHistoryItems,
    clearHistory,
    createNewChat,
    activeChatId,
    selectedHistoryId,
  } = useChat();
  
  const handleDownload = () => {
    toast({
      title: 'Feature Coming Soon!',
      description: 'PPTX file generation is not yet implemented.',
    });
  };
  
  const handleSignOut = () => {
    signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been successfully signed out.',
    });
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-background/90 font-body text-foreground">
      <SidebarProvider>
        <HistorySidebar
          history={history}
          isLoaded={isHistoryLoaded}
          onSelectHistory={selectHistory}
          onRemove={removeHistory}
          onRemoveItems={removeHistoryItems}
          onClear={clearHistory}
          user={user}
          onSignOut={handleSignOut}
          onCreateNewChat={createNewChat}
          activeChatId={activeChatId || null}
          selectedHistoryId={selectedHistoryId}
        />
        
        <div className="flex flex-1 h-screen">
          <SidebarInset className="flex flex-col h-full flex-1">
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-gradient-to-b from-background/95 to-background/80 px-3 backdrop-blur-md sm:px-4 shadow-sm">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="rounded-full hover:bg-muted transition-colors" />
                <div className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                    <Logo className="h-7 w-7 text-primary" />
                  </motion.div>
                  <h1 className="text-lg font-headline font-semibold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent hidden md:block">
                    PreZenta
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <HistoryDropdown />
                
                {/* Mobile Right Sidebar Toggle */}
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[280px] p-0 flex flex-col bg-gradient-to-b from-card to-card/90">
                      <SheetHeader className="p-3 border-b bg-gradient-to-b from-card to-card/80">
                        <SheetTitle className="flex items-center gap-2 text-base">
                          <Palette className="h-4 w-4 text-primary" />
                          Presentation Settings
                        </SheetTitle>
                        <SheetDescription className="text-xs">
                          Customize your presentation's appearance and format.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="flex-1 overflow-auto">
                        <RightPanelContent />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                
                {/* Desktop Right Sidebar Toggle */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hidden md:flex hover:bg-muted transition-colors" 
                  onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                
                {user && <UserNav user={user} onSignOut={handleSignOut} />}
              </div>
            </header>
            
            <main className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 flex flex-col h-full overflow-y-auto">
                <ChatArea />
              </div>
              <InputBox />
            </main>
          </SidebarInset>
          
          {/* Right Panel for Desktop */}
          <AnimatePresence>
            {isRightPanelOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: 'clamp(16rem, 18vw, 20rem)',
                  opacity: 1,
                }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="hidden md:flex flex-col border-l border-border/50 bg-gradient-to-b from-card to-card/90 h-full shadow-lg"
              >
                <div className="p-3 border-b border-border/50 bg-gradient-to-b from-card/80 to-card/50">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    Presentation Settings
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Customize your presentation's appearance and format.
                  </p>
                </div>
                <RightPanelContent />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default function PreZentaPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-background/90">
        <AppLoader />
      </div>
    );
  }
  
  return (
    <ChatProvider>
      <PreZentaChat />
    </ChatProvider>
  );
}
