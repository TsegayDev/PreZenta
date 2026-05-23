
"use client";
import { useRouter } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, Zap, ChevronUp, Crown, Star, User } from "lucide-react";
import type { AppUser } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CircularProgress } from './ui/circular-progress';
import { PLAN_TOKENS } from '@/hooks/use-auth';
import { usePageProgress } from '@/hooks/use-page-progress';

interface UserNavProps {
  user: AppUser;
  onSignOut: () => void;
  side?: "bottom" | "top" | "left" | "right";
  align?: "start" | "center" | "end";
  triggerVariant?: 'avatar' | 'detailed';
}

const defaultAvatar = 'data:image/png;base64,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';

export function UserNav({ user, onSignOut, side = 'bottom', align = "end", triggerVariant = 'avatar' }: UserNavProps) {
    const router = useRouter();
    const { start: startProgress } = usePageProgress();
    
    const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
      if (name) {
          const names = name.split(' ');
          if (names.length > 1) {
              return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
          }
          return name.charAt(0).toUpperCase();
      }
      if (email) return email.charAt(0).toUpperCase();
      return 'U';
    };
    
    const handleNavigate = (path: string) => {
        startProgress();
        router.push(path);
    }
    
    const triggerContent = triggerVariant === 'avatar' ? (
        <div className="p-0.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800">
                <AvatarImage src={user?.photoURL || defaultAvatar} data-ai-hint="user avatar" alt={user?.displayName || 'User'} />
                <AvatarFallback className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold">
                    {getInitials(user?.displayName, user?.email)}
                </AvatarFallback>
            </Avatar>
        </div>
    ) : (
        <div className="flex items-center gap-3 w-full text-left p-1 rounded-xl hover:bg-accent/50 transition-all duration-200">
            <div className="p-0.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
                    <AvatarImage src={user?.photoURL || defaultAvatar} alt={user?.displayName || 'User'} />
                    <AvatarFallback className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold">
                        {getInitials(user?.displayName, user?.email)}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground/90 truncate">
                    {user.displayName || 'User'}
                </p>
                <div className="flex items-center gap-1">
                    {user.plan === 'Pro' || user.plan === 'Unlimited' ? (
                        <div className="flex items-center gap-0.5">
                            <Crown className="w-3 h-3 text-amber-500" />
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                {user.plan} Plan
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground">
                            {user.plan} Plan
                        </span>
                    )}
                </div>
            </div>
            <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </div>
    );
    
    const totalTokens = PLAN_TOKENS[user.plan] || 0;
    const progress = totalTokens > 0 ? (user.tokens / totalTokens) * 100 : (user.plan === 'Unlimited' ? 100 : 0);
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className={cn(
                        "transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0",
                        triggerVariant === 'detailed' 
                            ? 'w-full h-auto px-2 py-1.5 justify-start hover:bg-accent/50 rounded-xl' 
                            : 'relative h-10 w-10 rounded-full p-0 hover:bg-transparent'
                    )}
                >
                    {triggerContent}
                </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
                className="w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-xl overflow-hidden" 
                side={side} 
                align={align}
                sideOffset={8}
            >
                {/* User Profile Section */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                    <div className="flex items-center gap-4">
                        <div className="p-0.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                            <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800">
                                <AvatarImage src={user?.photoURL || defaultAvatar} alt={user?.displayName || 'User'} />
                                <AvatarFallback className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold text-lg">
                                    {getInitials(user?.displayName, user?.email)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-foreground/90 truncate">
                                {user.displayName || 'User'}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                                {user.email || 'No email provided'}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                {user.plan === 'Pro' || user.plan === 'Unlimited' ? (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-full">
                                        <Crown className="w-3 h-3" />
                                        <span>{user.plan} Plan</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                                        <User className="w-3 h-3" />
                                        <span>{user.plan} Plan</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Token Usage Section */}
                <div className="px-4 py-3 bg-white dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground/80">
                            Token Usage
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                            {user.plan === 'Unlimited' ? 'Unlimited' : `${user.tokens} / ${totalTokens}`}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    user.plan === 'Unlimited' 
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 w-full" 
                                        : progress > 80 
                                            ? "bg-gradient-to-r from-red-500 to-orange-500" 
                                            : progress > 50 
                                                ? "bg-gradient-to-r from-amber-500 to-yellow-500" 
                                                : "bg-gradient-to-r from-green-500 to-emerald-500"
                                )}
                                style={{ width: `${user.plan === 'Unlimited' ? 100 : progress}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-center">
                            <CircularProgress 
                                value={progress} 
                                size={36} 
                                strokeWidth={3}
                                className={cn(
                                    user.plan === 'Unlimited' 
                                        ? "text-amber-500" 
                                        : progress > 80 
                                            ? "text-red-500" 
                                            : progress > 50 
                                                ? "text-amber-500" 
                                                : "text-green-500"
                                )}
                            >
                                {user.plan === 'Unlimited' ? (
                                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">∞</span>
                                ) : (
                                    <span className="text-xs font-bold text-foreground">
                                        {Math.round(progress)}%
                                    </span>
                                )}
                            </CircularProgress>
                        </div>
                    </div>
                </div>
                
                <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />
                
                {/* Menu Items */}
                <div className="p-1">
                    <DropdownMenuItem 
                        onSelect={() => handleNavigate('/settings')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20"
                    >
                        <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <Settings className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Account Settings</span>
                    </DropdownMenuItem>
                    
                    {user.plan !== 'Unlimited' && (
                        <DropdownMenuItem 
                            onSelect={() => handleNavigate('/plans')}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 focus:bg-gradient-to-r focus:from-amber-50 focus:to-orange-50 dark:focus:from-amber-900/20 dark:focus:to-orange-900/20"
                        >
                            <div className="p-1.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                <Zap className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium">Upgrade Plan</span>
                                <span className="text-xs text-muted-foreground">Unlock premium features</span>
                            </div>
                        </DropdownMenuItem>
                    )}
                </div>
                
                <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />
                
                {/* Logout */}
                <DropdownMenuItem 
                    onSelect={onSignOut} 
                    className="flex items-center gap-3 px-3 py-2.5 mx-1 mb-1 rounded-xl cursor-pointer transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
                >
                    <div className="p-1.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                        <LogOut className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
