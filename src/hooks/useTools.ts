import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string | null;
  link: string;
  category_id: string | null;
  tags: string[];
  notes: string | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export const useTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    }
  };

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTools(data || []);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError('Failed to fetch tools');
    } finally {
      setLoading(false);
    }
  };

  const addTool = async (toolData: {
    name: string;
    description?: string;
    link: string;
    category_id?: string;
    tags?: string[];
    notes?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .insert([{
          ...toolData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select(`
          *,
          category:categories(*)
        `)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setTools(prev => [data, ...prev]);
        // Refresh the tools list to ensure consistency
        await fetchTools();
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error adding tool:', err);
      return { data: null, error: err };
    }
  };

  const updateTool = async (id: string, updates: Partial<Tool>) => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          category:categories(*)
        `)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setTools(prev => prev.map(tool => tool.id === id ? data : tool));
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating tool:', err);
      return { data: null, error: err };
    }
  };

  const deleteTool = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTools(prev => prev.filter(tool => tool.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting tool:', err);
      return { error: err };
    }
  };

  const togglePin = async (id: string) => {
    const tool = tools.find(t => t.id === id);
    if (!tool) return;

    return updateTool(id, { is_pinned: !tool.is_pinned });
  };

  useEffect(() => {
    fetchCategories();
    fetchTools();
  }, []);

  return {
    tools,
    categories,
    loading,
    error,
    addTool,
    updateTool,
    deleteTool,
    togglePin,
    refetch: fetchTools,
  };
};