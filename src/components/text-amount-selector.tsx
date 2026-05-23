"use client";
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { usePresentationSettings } from '@/hooks/use-presentation-settings';
import type { TextAmount } from '@/lib/types';
import { AlignLeft } from 'lucide-react';

const options: { value: TextAmount, label: string, description: string }[] = [
    { value: 'minimal', label: 'Minimal', description: 'Bare essentials, key points only' },
    { value: 'concise', label: 'Concise', description: 'Brief & informative' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive' },
    { value: 'extensive', label: 'Extensive', description: 'With examples' },
];

const LineIcon = ({ amount }: { amount: TextAmount }) => {
    const lineStyles = "bg-muted dark:bg-gray-500 rounded-full transition-all duration-300";
    const selectedLineStyles = "bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full";
    const getLineClasses = (isSelected: boolean) => isSelected ? selectedLineStyles : lineStyles;
    const selected = usePresentationSettings().textAmount === amount;
    
    if (amount === 'minimal') {
        return (
            <div className="space-y-1.5 w-1/2">
                <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                <div className={cn("h-1.5 w-3/4", getLineClasses(selected))}></div>
                <div className={cn("h-1.5 w-1/2", getLineClasses(selected))}></div>
            </div>
        )
    }
    if (amount === 'concise') {
        return (
            <div className="space-y-1.5 w-3/4">
                <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                <div className={cn("h-1.5 w-3/4", getLineClasses(selected))}></div>
            </div>
        )
    }
    if (amount === 'detailed') {
        return (
            <div className="flex w-full gap-2">
                <div className="space-y-1.5 w-1/2">
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                </div>
                <div className="space-y-1.5 w-1/2">
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-3/4", getLineClasses(selected))}></div>
                </div>
            </div>
        )
    }
    
    if (amount === 'extensive') {
        return (
            <div className="flex w-full gap-1.5">
                <div className="space-y-1.5 w-1/3">
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-3/4", getLineClasses(selected))}></div>
                </div>
                <div className="space-y-1.5 w-1/3">
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-3/4", getLineClasses(selected))}></div>
                </div>
                 <div className="space-y-1.5 w-1/3">
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-full", getLineClasses(selected))}></div>
                    <div className={cn("h-1.5 w-3/4", getLineClasses(selected))}></div>
                </div>
            </div>
        )
    }
    return null;
}

export function TextAmountSelector() {
    const { textAmount, setTextAmount } = usePresentationSettings();
    
    return (
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
            <CardHeader className="px-4 pt-4 pb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-[5px]">
                        <AlignLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <CardTitle className="font-bold text-base text-gray-900 dark:text-gray-100">
                            Text Content
                        </CardTitle>
                        <p className="text-xs text-gray-500 dark:text-gray-400 pt-0.5">
                            Amount of text per slide
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                    {options.map(option => (
                        <Button
                            key={option.value}
                            variant="outline"
                            onClick={() => setTextAmount(option.value)}
                            className={cn(
                                "h-auto p-3 flex flex-col gap-2 justify-center items-center transition-all duration-300 rounded-lg border",
                                textAmount === option.value 
                                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-sm" 
                                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600"
                            )}
                        >
                            <div className="w-full h-8 flex items-center justify-center">
                                <LineIcon amount={option.value} />
                            </div>
                            <div className="text-center">
                                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                    {option.label}
                                </span>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 max-w-[100px]">
                                    {option.description.split(',').map((part, index) => (
                                        <React.Fragment key={index}>
                                            {part}
                                            {index < option.description.split(',').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </p>
                            </div>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}