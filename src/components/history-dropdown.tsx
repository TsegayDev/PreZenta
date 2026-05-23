"use client";
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { History, LayoutGrid, FileText, Trash2, TriangleAlert, X } from "lucide-react";
import { useSlideEditor } from '@/hooks/use-slide-editor';
import { ScrollArea } from './ui/scroll-area';
import { useTemplate } from '@/hooks/use-template';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { templates } from '@/lib/templates';
import { usePresentationHistory } from '@/hooks/use-presentation-history';
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
} from "@/components/ui/alert-dialog";
import toast from 'react-hot-toast';

export function HistoryDropdown() {
  const { openEditor } = useSlideEditor();
  const { setSelectedTemplate } = useTemplate();
  const { history, isHistoryLoaded, removePresentationHistory, clearAllHistory } = usePresentationHistory();
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  const [showClearAllDialog, setShowClearAllDialog] = React.useState(false);
  
  const handleSelect = (historyItem: (typeof history)[0]) => {
    const template = templates.find(t => t.id === historyItem.templateId) || templates[0];
    setSelectedTemplate(template);
    openEditor(historyItem.detailedContent, historyItem.id);
  };
  
  const handleDelete = () => {
      if(itemToDelete) {
          removePresentationHistory(itemToDelete);
          toast.success("Presentation removed from history.");
          setItemToDelete(null);
      }
  }
  
  const handleClearAll = () => {
    clearAllHistory();
    toast.success("All presentations removed from history.");
    setShowClearAllDialog(false);
  }
  
  const reversedHistory = React.useMemo(() => [...history].reverse(), [history]);
  
  return (
    <>
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
              <History className="h-4 w-4" />
              <span className="sr-only">Open History</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 p-0 shadow-lg rounded-[10px] border">
            <div className="p-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-t-xl border-b">
              <div className="flex items-center justify-between">
                <DropdownMenuLabel className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 p-0 text-xs">
                  <LayoutGrid className="w-3 h-3" />
                  Recent Presentations
                </DropdownMenuLabel>
                {history.length > 0 && (
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2"
                      onClick={() => setShowClearAllDialog(true)}
                    >
                      Clear All
                    </Button>
                  </AlertDialogTrigger>
                )}
              </div>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-2 gap-2 p-2">
                {!isHistoryLoaded && Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 w-full rounded-lg bg-muted animate-pulse" />
                ))}
                {isHistoryLoaded && reversedHistory.length === 0 && (
                  <div className="col-span-2 text-center py-6 text-xs text-muted-foreground">
                    <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No presentations generated yet.</p>
                  </div>
                )}
                
                {isHistoryLoaded && reversedHistory.map(item => {
                  const template = templates.find(t => t.id === item.templateId) || templates[0];
                  return (
                    <div key={item.id} className="relative group">
                      <button
                        onClick={() => handleSelect(item)}
                        className={cn(
                          "p-2 rounded-[8px] cursor-pointer border-2 text-left w-full h-full transition-all duration-200",
                          'border-transparent hover:border-indigo-200 hover:shadow-sm hover:scale-[1.01] bg-card'
                        )}
                      >
                        <div 
                          className="aspect-video w-full rounded p-2 flex flex-col justify-center items-center text-center shadow-sm mb-1 overflow-hidden"
                          style={{
                            background: template.background,
                          }}
                        >
                          <h3 className="text-[7px] font-bold truncate w-full" style={{ color: template.colors.heading, fontFamily: template.font.headline }}>
                            {item.title.substring(0, 25) + (item.title.length > 25 ? '...' : '')}
                          </h3>
                        </div>
                        <p className="text-xs font-medium line-clamp-1 mb-0.5">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                        </p>
                      </button>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="text-gray-700 dark:text-white absolute top-1.5 right-1.5 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-background shadow-sm hover:bg-destructive hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete(item.id);
                          }}
                        >
                          <X className="h-2.5 w-2.5" />
                        </Button>
                      </AlertDialogTrigger>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Enhanced Delete Single Item Dialog - Compact */}
        <AlertDialogContent className="max-w-sm overflow-hidden p-0 border-0 shadow-2xl">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 transition-all duration-300 transform hover:scale-105">
                  <TriangleAlert className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3 mt-0.5">
                  <AlertDialogHeader className="text-left p-0">
                    <AlertDialogTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Delete Presentation?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                      This will permanently remove this presentation from your history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 flex justify-end gap-2 rounded-b-xl">
              <AlertDialogCancel 
                onClick={() => setItemToDelete(null)}
                className="rounded mt-0 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors h-8 text-sm"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="rounded mt-0 bg-red-600 hover:bg-red-700 focus:ring-red-600 transition-colors h-8 text-sm"
              >
                Delete
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Enhanced Clear All Dialog - Compact */}
      <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <AlertDialogContent className="max-w-sm overflow-hidden p-0 border-0 shadow-2xl">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 transition-all duration-300 transform hover:scale-105">
                  <TriangleAlert className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3 mt-0.5">
                  <AlertDialogHeader className="text-left p-0">
                    <AlertDialogTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Clear All History?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                      This will permanently remove all presentations from your history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 flex justify-end gap-2 rounded-b-xl">
              <AlertDialogCancel 
                onClick={() => setShowClearAllDialog(false)}
                className="rounded mt-0 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors h-8 text-sm"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleClearAll} 
                className="rounded mt-0 bg-red-600 hover:bg-red-700 focus:ring-red-600 transition-colors h-8 text-sm"
              >
                Clear All
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
