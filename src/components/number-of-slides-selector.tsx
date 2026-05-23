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
import { ChevronDown, Check, Star, BookOpen, Crown } from "lucide-react";
import { useSlides } from '@/hooks/use-slides';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export const slideOptions = [5, 10, 15, 20];
export const premiumSlideOption = 30;

export function NumberOfSlidesSelector() {
  const { numberOfSlides, setNumberOfSlides } = useSlides();
  const { user } = useAuth();
  const isPremium = user?.plan === 'Pro' || user?.plan === 'Unlimited';

  const handleSelect = (slides: number) => {
    if (slides > 20 && !isPremium) {
      toast.error('Upgrade to Pro to generate more than 20 slides.');
      return;
    }
    setNumberOfSlides(slides);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="group w-full sm:w-auto justify-between bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 h-auto py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-750"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{numberOfSlides} Slides</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Select count</span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2 transition-transform duration-200 group-hover:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-[240px] p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg backdrop-blur-sm"
        align="start"
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Number of Slides
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />
        
        <div className="grid grid-cols-2 gap-1 p-1">
          {slideOptions.map(option => (
            <DropdownMenuItem 
              key={option} 
              onSelect={() => handleSelect(option)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded cursor-pointer transition-all duration-200",
                "hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20",
                numberOfSlides === option 
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium" 
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              <div className="flex items-center justify-center mb-1">
                <BookOpen className={cn(
                  "w-5 h-5 mr-1",
                  numberOfSlides === option 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-500 dark:text-gray-400"
                )} />
                <span className="text-lg font-bold">{option}</span>
              </div>
              <span className="text-xs">Slides</span>
              {numberOfSlides === option && (
                <div className="absolute top-1 right-1">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />
        
        <DropdownMenuItem 
          onSelect={() => handleSelect(premiumSlideOption)} 
          className={cn(
            "p-3 rounded cursor-pointer transition-all duration-200",
            !isPremium 
              ? "opacity-70 cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-750" 
              : "hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20",
            numberOfSlides === premiumSlideOption 
              ? "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 font-medium border border-amber-200 dark:border-amber-800/50" 
              : "text-gray-700 dark:text-gray-300"
          )}
          disabled={!isPremium}
        >
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded",
                numberOfSlides === premiumSlideOption
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  : isPremium
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              )}>
                {isPremium ? <Crown className="w-5 h-5" /> : <Star className="w-5 h-5" />}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold">30+ Slides</span>
                  {!isPremium && (
                    <span className="text-xs px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                      PRO
                    </span>
                  )}
                </div>
                {!isPremium && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">Upgrade to unlock</span>
                )}
              </div>
            </div>
            {numberOfSlides === premiumSlideOption && (
              <Check className="w-4 h-4 ml-auto text-amber-600 dark:text-amber-400" />
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}