import React, { useState } from 'react';
import { ExternalLink, Pin, PinOff, Edit, Trash2, Copy, Share2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTools, Tool } from '@/hooks/useTools';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ToolEditModal from '@/components/ToolEditModal';
import SpotlightCard from '@/components/SpotlightCard';

interface ToolCardProps {
  tool: Tool;
  showEditButton?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, showEditButton = true }) => {
  const [loading, setLoading] = useState(false);
  const { togglePin, deleteTool, categories } = useTools();
  const { toast } = useToast();

  const handleTogglePin = async () => {
    setLoading(true);
    try {
      const result = await togglePin(tool.id);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to update pin status",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: tool.is_pinned ? "Tool unpinned" : "Tool pinned",
        });
      }
    } catch (error) {
      console.error('Pin toggle error:', error);
      toast({
        title: "Error",
        description: "Failed to update pin status",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${tool.name}"?`)) return;
    
    setLoading(true);
    const { error } = await deleteTool(tool.id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete tool",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Deleted",
        description: `${tool.name} has been removed from your toolkit`
      });
    }
    setLoading(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tool.link);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard"
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tool.name,
          text: tool.description || `Check out this tool: ${tool.name}`,
          url: tool.link
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      handleCopyLink();
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SpotlightCard 
      className={cn(
        "group transition-all duration-300 hover:-translate-y-1",
        tool.is_pinned && "ring-2 ring-primary/20"
      )}
    >
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg flex items-center gap-2 mb-1">
                {tool.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                <span className="truncate">{tool.name}</span>
              </CardTitle>
              {tool.description && (
                <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
              )}
            </div>
            {tool.category && (
              <div className="flex items-center gap-1 ml-2">
                <div 
                  className="w-3 h-3 rounded-full bg-foreground/20"
                />
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {tool.category.name}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tool.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {tool.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={() => window.open(tool.link, '_blank')}
                className="transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {showEditButton && (
                <ToolEditModal tool={tool} categories={categories} />
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleTogglePin}
                disabled={loading}
              >
                {tool.is_pinned ? (
                  <PinOff className="h-4 w-4" />
                ) : (
                  <Pin className="h-4 w-4" />
                )}
              </Button>
              {/* --- THIS IS THE CHANGE --- */}
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-3">
            Added {formatDate(tool.created_at)}
          </div>
        </CardContent>
      </Card>
    </SpotlightCard>
  );
};

export default ToolCard;