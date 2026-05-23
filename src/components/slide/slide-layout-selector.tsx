"use client";
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import type { Slide, SlideLayout } from '@/lib/types';
import { 
    LayoutTemplate, 
    View, 
    Columns, 
    Image, 
    MessageSquare, 
    Code, 
    Check,
    RectangleHorizontal,
    PanelLeft,
    PanelRight,
    List,
    GalleryHorizontal,
    Table,
    PanelTop,
    SquareStack,
    ChevronDown,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '../ui/dropdown-menu';
import { useTemplate } from '@/hooks/use-template';
import { templates } from '@/lib/templates.tsx';

// Define layout categories with only the most basic layouts that are likely to exist
const layoutCategories = [
    {
        id: 'basic',
        label: 'Basic Layouts',
        icon: LayoutTemplate,
        layouts: [
            { value: 'blank', label: 'Blank Card', icon: RectangleHorizontal, requiredElements: [] },
            { value: 'title', label: 'Title Slide', icon: View, requiredElements: ['heading'] },
            { value: 'content', label: 'Title & Content', icon: LayoutTemplate, requiredElements: ['heading', 'paragraph'] },
        ]
    },
    {
        id: 'columns',
        label: 'Column Layouts',
        icon: Columns,
        layouts: [
            { value: 'two-column', label: 'Two Columns', icon: Columns, requiredElements: ['list'] },
            { value: 'three-column', label: 'Three Columns', icon: Table, requiredElements: ['list'] },
            { value: 'four-column', label: 'Four Columns', icon: Table, requiredElements: ['list'] },
        ]
    },
    {
        id: 'text-image',
        label: 'Text & Image',
        icon: Image,
        layouts: [
            { value: 'image-right', label: 'Text with Image Right', icon: PanelLeft, requiredElements: ['heading', 'paragraph', 'image'] },
            { value: 'image-left', label: 'Text with Image Left', icon: PanelRight, requiredElements: ['heading', 'paragraph', 'image'] },
            { value: 'title-bullets-image', label: 'Bullets and Image', icon: GalleryHorizontal, requiredElements: ['heading', 'list', 'image'] },
            { value: 'title-bullets', label: 'Title with Bullets', icon: List, requiredElements: ['heading', 'list'] },
        ]
    },
    {
        id: 'accent',
        label: 'Accent Layouts',
        icon: PanelTop,
        layouts: [
            { value: 'accent-left', label: 'Accent Left', icon: PanelLeft, requiredElements: ['heading'] },
            { value: 'accent-right', label: 'Accent Right', icon: PanelRight, requiredElements: ['heading'] },
            { value: 'accent-top', label: 'Accent Top', icon: PanelTop, requiredElements: ['heading'] },
            { value: 'accent-background', label: 'Accent Background', icon: SquareStack, requiredElements: ['heading'] },
        ]
    },
    {
        id: 'special',
        label: 'Special Elements',
        icon: MessageSquare,
        layouts: [
            { value: 'quote', label: 'Quote or Big Text', icon: MessageSquare, requiredElements: ['quote'] },
            { value: 'code', label: 'Code Snippet', icon: Code, requiredElements: ['code'] },
        ]
    }
];

export function SlideLayoutSelector({ selectedSlide, onSlideChange }: { 
    selectedSlide: Slide, 
    onSlideChange: (slide: Slide) => void 
}) {
    const { selectedTemplate } = useTemplate();
    
    // Get available layouts for the current slide content
    const getAvailableLayouts = () => {
        if (!selectedTemplate || !selectedSlide) return [];

        const template = templates.find(t => t.id === selectedTemplate.id);
        if (!template || !template.designs) return [];

        const slideElementTypes = new Set(selectedSlide.elements.map(e => e.type));

        const availableLayouts = layoutCategories.map(category => ({
            ...category,
            layouts: category.layouts.filter(layout => {
                const hasLayoutInTemplate = Object.keys(template.designs).includes(layout.value);
                if (!hasLayoutInTemplate) return false;

                // For basic layouts, always show them if available in template
                if (category.id === 'basic') return true;

                // For other layouts, check if required elements are present
                return layout.requiredElements.every(reqEl => slideElementTypes.has(reqEl as any));
            })
        })).filter(category => category.layouts.length > 0);
        
        return availableLayouts;
    };
    
    const layoutCategoriesAvailable = getAvailableLayouts();
    
    const handleLayoutChange = (layout: SlideLayout) => {
        const updatedSlide = {
            ...selectedSlide,
            layout: layout,
        };
        onSlideChange(updatedSlide);
    };

    const getCurrentLayoutInfo = () => {
        for (const category of layoutCategories) {
            const layout = category.layouts.find(l => l.value === selectedSlide.layout);
            if (layout) return { category, layout };
        }
        return { category: layoutCategories[0], layout: layoutCategories[0].layouts[0] };
    };

    const { layout } = getCurrentLayoutInfo();
    const LayoutIcon = layout.icon;

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardHeader className="px-1 pt-0">
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5" />
                    Slide Layout
                </CardTitle>
                <p className="text-sm text-muted-foreground pt-1">Change the slide structure</p>
            </CardHeader>
            <CardContent className="p-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="rounded w-full justify-between bg-muted/50 hover:bg-accent"
                        >
                            <div className="flex items-center gap-2">
                                <LayoutIcon className="w-4 h-4" />
                                <span>{layout.label}</span>
                            </div>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        {layoutCategoriesAvailable.map((category) => {
                            const CategoryIcon = category.icon;
                            return (
                                <DropdownMenuSub key={category.id}>
                                    <DropdownMenuSubTrigger className="gap-2">
                                        <CategoryIcon className="w-4 h-4" />
                                        <span>{category.label}</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-48">
                                        {category.layouts.map((layoutOption) => {
                                            const Icon = layoutOption.icon;
                                            const isSelected = selectedSlide.layout === layoutOption.value;
                                            return (
                                                <DropdownMenuItem
                                                    key={layoutOption.value}
                                                    onClick={() => handleLayoutChange(layoutOption.value as SlideLayout)}
                                                    className={cn(
                                                        "gap-2",
                                                        isSelected && "bg-accent text-accent-foreground"
                                                    )}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span>{layoutOption.label}</span>
                                                    {isSelected && <Check className="w-4 h-4 ml-auto" />}
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardContent>
        </Card>
    );
}