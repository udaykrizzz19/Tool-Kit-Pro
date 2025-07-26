import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/hooks/useTools';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Menu, Bot, Palette, Code, Wrench, Globe, Zap, BarChart, Shield, Users, Settings, BookOpen, Shirt, Cpu, Package } from 'lucide-react';

interface ResponsiveCategoryDockProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

// Icon mapping for categories
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('ai') || name.includes('artificial intelligence')) return Bot;
  if (name.includes('design') || name.includes('ui') || name.includes('ux')) return Palette;
  if (name.includes('dev') || name.includes('code') || name.includes('programming')) return Code;
  if (name.includes('tool') || name.includes('utility')) return Wrench;
  if (name.includes('web') || name.includes('website')) return Globe;
  if (name.includes('productivity') || name.includes('efficiency')) return Zap;
  if (name.includes('analytics') || name.includes('data')) return BarChart;
  if (name.includes('security') || name.includes('privacy')) return Shield;
  if (name.includes('social') || name.includes('team')) return Users;
  if (name.includes('education') || name.includes('learning') || name.includes('study')) return BookOpen;
  if (name.includes('fashion') || name.includes('style') || name.includes('clothing')) return Shirt;
  if (name.includes('technical') || name.includes('tech') || name.includes('engineering')) return Cpu;
  if (name.includes('others') || name.includes('misc') || name.includes('general')) return Package;
  return Settings; // Default icon
};

const ResponsiveCategoryDock: React.FC<ResponsiveCategoryDockProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [hiddenCategories, setHiddenCategories] = useState<Category[]>([]);

  useEffect(() => {
    const updateVisibleCategories = () => {
      const screenWidth = window.innerWidth;
      let maxVisible = 4; // Default for mobile
      
      if (screenWidth >= 1024) maxVisible = 6; // lg screens
      else if (screenWidth >= 768) maxVisible = 5; // md screens
      else if (screenWidth >= 640) maxVisible = 4; // sm screens
      else maxVisible = 2; // xs screens

      setVisibleCategories(categories.slice(0, maxVisible));
      setHiddenCategories(categories.slice(maxVisible));
    };

    updateVisibleCategories();
    window.addEventListener('resize', updateVisibleCategories);
    return () => window.removeEventListener('resize', updateVisibleCategories);
  }, [categories]);

  const CategoryButton = ({ category, showIcon = true }: { category: Category; showIcon?: boolean }) => {
    const Icon = getCategoryIcon(category.name);
    
    return (
      <button
        onClick={() => {
          onCategoryChange(category.id);
          setIsOpen(false);
        }}
        className={cn(
          "px-3 py-2 rounded-full text-sm font-medium transition-all duration-300",
          "hover:scale-105 hover:shadow-soft flex items-center gap-2",
          selectedCategory === category.id
            ? "bg-primary text-primary-foreground shadow-glow"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="w-4 h-4" />
        <span className="truncate max-w-24">{category.name}</span>
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center">
      <div className="glass-card rounded-full p-2 shadow-medium">
        <div className="flex items-center gap-2">
          {/* All button */}
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              "hover:scale-105 hover:shadow-soft",
              selectedCategory === null
                ? "bg-primary text-primary-foreground shadow-glow"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            All
          </button>
          
          {/* Visible categories */}
          {visibleCategories.map((category) => (
            <CategoryButton key={category.id} category={category} />
          ))}
          
          {/* Hamburger menu for hidden categories */}
          {hiddenCategories.length > 0 && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 rounded-full hover:bg-accent"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="absolute top-full mt-2 right-0 z-[9999]">
                <div className="glass-card rounded-lg p-2 shadow-xl min-w-48 space-y-1 bg-background/95 backdrop-blur-sm border border-border">
                  {hiddenCategories.map((category) => (
                    <CategoryButton key={category.id} category={category} showIcon />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveCategoryDock;