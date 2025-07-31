import React from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/hooks/useTools';

interface CategoryDockProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

const CategoryDock: React.FC<CategoryDockProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="glass-card rounded-full p-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              "hover:scale-105",
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                "hover:scale-105 flex items-center gap-2",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {/* Removed color dot to enforce B&W theme */}
              <div 
                className="w-3 h-3 rounded-full bg-foreground/20"
              />
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDock;