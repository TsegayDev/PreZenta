"use client";
import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePresentationSettings } from '@/hooks/use-presentation-settings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ImageIcon, Wand2, Search, UploadCloud, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ImageSource } from '@/lib/types';

const sourceOptions: { value: ImageSource; label: string; description: string; icon: React.ElementType; color: string }[] = [
    { value: 'automatic', label: 'Automatic', description: 'Automatically select best image type', icon: Wand2, color: 'text-purple-500' },
    { value: 'stock', label: 'Stock photos', description: 'Search high-resolution photos', icon: UploadCloud, color: 'text-blue-500' },
    { value: 'web', label: 'Web images', description: 'Search the internet for images', icon: Search, color: 'text-green-500' },
    { value: 'ai', label: 'AI images', description: 'Generate original images with AI', icon: Sparkles, color: 'text-amber-500' },
];

export function ImageSourceSelector() {
  const { imageSource, setImageSource } = usePresentationSettings();
  
  const selectedOption = sourceOptions.find(option => option.value === imageSource);
  
  return (
    <Card className="bg-gradient-to-br from-card/50 to-card/30 border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="font-headline text-lg flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ImageIcon className="w-5 h-5 text-primary" />
                </motion.div>
                Image Source
            </CardTitle>
            <p className="text-sm text-muted-foreground pt-1">Choose how to source images</p>
        </CardHeader>
        <CardContent className="p-4 pt-2">
            <Select onValueChange={(value: ImageSource) => setImageSource(value)} value={imageSource}>
                <SelectTrigger className={cn(
                  "w-full h-auto py-3 px-4 rounded-xl border-border/50 bg-gradient-to-r from-background to-background/80 transition-all duration-300",
                  "hover:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                )}>
                   <div className="flex items-center gap-3">
                     
                     <SelectValue placeholder="Select an image source" />
                   </div>
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-b from-card to-card/90 border-border/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                    <SelectGroup>
                        <SelectLabel className="text-xs font-semibold text-muted-foreground px-4 py-2 bg-gradient-to-r from-card/50 to-card/30">Image Source</SelectLabel>
                        {sourceOptions.map((option, index) => {
                             const ItemIcon = option.icon;
                             const isSelected = option.value === imageSource;
                             
                             return (
                                <motion.div
                                  key={option.value}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <SelectItem 
                                    value={option.value} 
                                    className={cn(
                                      "rounded-lg m-1 cursor-pointer transition-all duration-200",
                                      isSelected 
                                        ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20" 
                                        : "hover:bg-muted/50"
                                    )}
                                  >
                                    <div className="flex items-center gap-3 py-1">
                                      <div className={cn(
                                        "p-1.5 rounded-[5px]",
                                        isSelected 
                                          ? "bg-gradient-to-br from-primary/20 to-primary/10" 
                                          : "bg-background/50"
                                      )}>
                                        <ItemIcon className={cn("h-5 w-5", option.color)} />
                                      </div>
                                      <div>
                                        <p className={cn(
                                          "font-medium",
                                          isSelected ? "text-primary" : ""
                                        )}>{option.label}</p>
                                        <p className="text-xs text-muted-foreground">{option.description}</p>
                                      </div>
                                    </div>
                                  </SelectItem>
                                </motion.div>
                             )
                        })}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </CardContent>
    </Card>
  );
}