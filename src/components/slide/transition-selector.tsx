'use client';
import * as React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, Wand2, RectangleHorizontal, ZoomIn, Eye, Scale, Ban, LucideIcon } from 'lucide-react';
import type { Slide, TransitionType } from '@/lib/types';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface TransitionOption {
    label: string;
    value: TransitionType;
    icon: keyof typeof import('lucide-react');
    description: string;
}

export const transitionOptions: TransitionOption[] = [
    { 
        label: 'Slide', 
        value: 'slide', 
        icon: 'RectangleHorizontal',
        description: 'Slides in from the side'
    },
    { 
        label: 'Fade', 
        value: 'fade', 
        icon: 'Eye',
        description: 'Smoothly fades in and out'
    },
    { 
        label: 'Zoom', 
        value: 'zoom', 
        icon: 'ZoomIn',
        description: 'Zooms in from the center'
    },
    { 
        label: 'Scale', 
        value: 'scale', 
        icon: 'Scale',
        description: 'Scales up from small to large'
    },
    { 
        label: 'None', 
        value: 'none', 
        icon: 'Ban',
        description: 'No transition effect'
    },
];

interface TransitionSelectorProps {
    slides: Slide[];
    setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
}

const TransitionPreview = ({ 
    transition, 
    isSelected 
}: { 
    transition: TransitionOption; 
    isSelected: boolean;
}) => {
    const Icon = require('lucide-react')[transition.icon] as LucideIcon;
    
    return (
        <div className="relative">
            <div className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all duration-200 cursor-pointer aspect-square",
                "bg-gradient-to-br from-background to-muted/30",
                "hover:from-accent/20 hover:to-accent/10 hover:border-primary/50",
                isSelected 
                    ? "border-primary shadow-sm ring-1 ring-primary/20 bg-gradient-to-br from-primary/5 to-primary/10" 
                    : "border-border"
            )}>
                <Icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isSelected ? "text-primary scale-110" : "text-muted-foreground"
                )} />
                <span className={cn(
                    "text-xs font-medium transition-colors",
                    isSelected ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                    {transition.label}
                </span>
                
                {/* Selection indicator */}
                {isSelected && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                    </div>
                )}
            </div>
        </div>
    );
};

export function TransitionSelector({ slides, setSlides }: TransitionSelectorProps) {
    const [selectedTransition, setSelectedTransition] = React.useState<TransitionOption>(transitionOptions[0]);
    
    const handleApplyToAll = () => {
        setSlides(currentSlides => 
            currentSlides.map(slide => ({
                ...slide,
                transition: selectedTransition.value,
                icon: selectedTransition.icon,
            }))
        );
        toast.success(`'${selectedTransition.label}' transition applied to all slides.`);
    };
    
    const handleSelectTransition = (option: TransitionOption) => {
        setSelectedTransition(option);
    };
    
    const CurrentIcon = require('lucide-react')[selectedTransition.icon] as LucideIcon;
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full md:rounded h-9 bg-gradient-to-r from-background to-muted/50 hover:from-accent/20 hover:to-accent/10"
                >
                    <Wand2 className="mr-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-muted-foreground">Transition</span>
                        <span className="font-medium text-sm">{selectedTransition.label}</span>
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 p-3" align="start">
                <div className="flex items-center justify-between mb-2">
                    <DropdownMenuLabel className="text-sm font-semibold">
                        Select Transition
                    </DropdownMenuLabel>
                    <Badge variant="outline" className="text-xs">
                        {selectedTransition.label}
                    </Badge>
                </div>
                <DropdownMenuSeparator className="mb-2" />
                
                {/* Scrollable grid container */}
                <div className="max-h-48 overflow-y-auto pr-1">
                    <div className="grid grid-cols-3 gap-2">
                        {transitionOptions.map(option => (
                            <div 
                                key={option.value}
                                onClick={() => handleSelectTransition(option)}
                                className="cursor-pointer"
                            >
                                <TransitionPreview 
                                    transition={option} 
                                    isSelected={selectedTransition.value === option.value}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="p-2 rounded-md bg-muted/50 border border-border mb-3 mt-2">
                    <div className="flex items-center gap-2 mb-1">
                        <CurrentIcon className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">{selectedTransition.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {selectedTransition.description}
                    </p>
                </div>
                
                <DropdownMenuSeparator className="mb-2" />
                
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        onClick={handleApplyToAll} 
                        className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-xs"
                    >
                        Apply to All
                    </Button>
                    <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => {
                            const randomIndex = Math.floor(Math.random() * transitionOptions.length);
                            handleSelectTransition(transitionOptions[randomIndex]);
                            toast.success(`Random transition selected: ${transitionOptions[randomIndex].label}`);
                        }}
                    >
                        Random
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}