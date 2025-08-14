import React, { useState, useMemo } from 'react';
import { Search, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTools } from '@/hooks/useTools';
import ToolCard from '@/components/ToolCard';
import QuickAddTool from '@/components/QuickAddTool';
import ResponsiveCategoryDock from '@/components/ResponsiveCategoryDock';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, signOut } = useAuth();
  const { tools, categories, loading } = useTools();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = searchQuery === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === null || tool.category_id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);

  // Separate pinned and regular tools
  const pinnedTools = filteredTools.filter(tool => tool.is_pinned);
  const regularTools = filteredTools.filter(tool => !tool.is_pinned);
  const recentTools = tools.slice(0, 3); // Only show 3 most recent

  const getUserName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold gradient-text">ToolKit Pro</h1>
              <p className="text-sm md:text-base text-muted-foreground hidden sm:block">
                Welcome, {getUserName()}! Let's build your ultimate toolkit.
              </p>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              <QuickAddTool />
              <Button 
                variant="outline" 
                size="icon" 
                className="hidden md:flex"
                onClick={() => navigate('/settings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={signOut} className="text-xs md:text-sm">
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Navigation Bar - Mobile Only */}
      <div className="mobile-nav-fixed md:hidden">
        <div className="container mx-auto px-4 py-3">
          <ResponsiveCategoryDock
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Desktop Navigation Bar */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <ResponsiveCategoryDock
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      <main className="container mx-auto px-4 py-4 md:py-8 space-y-6 md:space-y-8 md:mt-0 mt-[100px]">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card border-border/50 text-sm md:text-base"
          />
        </div>

        {/* Pinned Tools */}
        {pinnedTools.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Pinned Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {pinnedTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} showEditButton />
              ))}
            </div>
          </section>
        )}

        {/* Recently Added Section */}
        {recentTools.length > 0 && searchQuery === '' && selectedCategory === null && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Recently Added
            </h2>
            <div className="relative">
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {recentTools.map((tool) => (
                  <div key={tool.id} className="flex-none w-72 md:w-80">
                    <ToolCard tool={tool} showEditButton={false} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Tools */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {searchQuery || selectedCategory ? 'Filtered Tools' : 'All Tools'}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
            </div>
          </div>

          {regularTools.length === 0 && pinnedTools.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-lg font-medium mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory 
                  ? "Try adjusting your search or filters"
                  : "Start building your toolkit by adding your first tool!"
                }
              </p>
              {!searchQuery && !selectedCategory && <QuickAddTool />}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {regularTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} showEditButton />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Mobile Settings Button */}
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed bottom-4 left-4 md:hidden z-50 h-12 w-12 rounded-full shadow-lg"
        onClick={() => navigate('/settings')}
      >
        <Settings className="h-5 w-5" />
      </Button>

      <ThemeToggle />
    </div>
  );
};

export default Index;
