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
      <div className="glass-card rounded-full p-2 shadow-medium">
        <div className="flex items-center gap-2">
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
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                "hover:scale-105 hover:shadow-soft flex items-center gap-2",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: category.color }}
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