import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { SocialMediaStats, SocialMediaPost, EmailCampaign, SocialMediaConnection } from '../types';

export function useMarketing() {
  const queryClient = useQueryClient();

  const { data: socialStats, isLoading: isLoadingSocialStats } = useQuery({
    queryKey: ['socialMediaStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media_stats')
        .select('*')
        .order('platform');
      
      if (error) throw error;
      return data as SocialMediaStats[];
    }
  });

  const { data: socialPosts, isLoading: isLoadingSocialPosts } = useQuery({
    queryKey: ['socialMediaPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media_posts')
        .select('*')
        .order('publish_date', { ascending: false });
      
      if (error) throw error;
      return data as SocialMediaPost[];
    }
  });

  const { data: socialConnections, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['socialMediaConnections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media_connections')
        .select('*')
        .order('platform');
      
      if (error) throw error;
      return data as SocialMediaConnection[];
    }
  });

  const { data: emailCampaigns, isLoading: isLoadingEmailCampaigns } = useQuery({
    queryKey: ['emailCampaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as EmailCampaign[];
    }
  });

  const createSocialPost = useMutation({
    mutationFn: async (post: Omit<SocialMediaPost, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('social_media_posts')
        .insert(post)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaPosts'] });
    }
  });

  const createEmailCampaign = useMutation({
    mutationFn: async (campaign: Omit<EmailCampaign, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('email_campaigns')
        .insert(campaign)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailCampaigns'] });
    }
  });

  const connectSocialMedia = useMutation({
    mutationFn: async (platform: string) => {
      // Cette fonction sera implémentée pour gérer l'OAuth avec chaque plateforme
      const { data, error } = await supabase.functions.invoke('connect-social-media', {
        body: { platform }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaConnections'] });
    }
  });

  const refreshToken = useMutation({
    mutationFn: async (connectionId: string) => {
      const { data, error } = await supabase.functions.invoke('refresh-social-token', {
        body: { connectionId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaConnections'] });
    }
  });

  return {
    socialStats,
    socialPosts,
    socialConnections,
    emailCampaigns,
    isLoading: isLoadingSocialStats || isLoadingSocialPosts || isLoadingConnections || isLoadingEmailCampaigns,
    createSocialPost,
    createEmailCampaign,
    connectSocialMedia,
    refreshToken
  };
}