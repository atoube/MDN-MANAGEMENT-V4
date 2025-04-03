export interface MarketingConfig {
  facebook: SocialMediaConfig;
  instagram: SocialMediaConfig;
  linkedin: SocialMediaConfig;
  twitter: SocialMediaConfig;
  dikalo: SocialMediaConfig;
  tiktok: SocialMediaConfig;
}

export interface SocialMediaConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface SocialMediaStats {
  id: string;
  created_at: string;
  platform: string;
  followers: number;
  growth: number;
  likes: number;
  engagement: number;
  user_id: string;
}

export interface SocialMediaPost {
  id: string;
  created_at: string;
  platform: string;
  title: string;
  content: string;
  engagement: number;
  likes: number;
  shares: number;
  publish_date: string;
  status: 'draft' | 'published' | 'scheduled';
  user_id: string;
}

export interface EmailCampaign {
  id: string;
  created_at: string;
  name: string;
  subject: string;
  content: string;
  recipients: number;
  open_rate: number;
  click_rate: number;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  scheduled_date?: string;
  sent_date?: string;
  user_id: string;
}

export interface SocialMediaConnection {
  id: string;
  created_at: string;
  platform: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  account_id: string;
  account_name: string;
  account_type: string;
  status: 'active' | 'expired' | 'revoked';
  user_id: string;
} 