import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const platformConfig = {
  facebook: {
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v12.0/oauth/access_token',
    scope: 'pages_show_list,pages_read_engagement,pages_manage_posts'
  },
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    scope: 'basic'
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scope: 'r_liteprofile w_member_social'
  },
  twitter: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scope: 'tweet.read tweet.write users.read'
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { platform, code, state } = await req.json();

    if (!platform || !code || !state) {
      throw new Error('Missing required parameters');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Vérifier l'état OAuth
    const { data: stateData, error: stateError } = await supabase
      .from('oauth_states')
      .select()
      .eq('state', state)
      .single();

    if (stateError || !stateData) {
      throw new Error('Invalid state parameter');
    }

    const config = platformConfig[platform as keyof typeof platformConfig];
    if (!config) {
      throw new Error('Invalid platform');
    }

    // Échanger le code contre un token
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: Deno.env.get(`${platform.toUpperCase()}_CLIENT_ID`) ?? '',
        client_secret: Deno.env.get(`${platform.toUpperCase()}_CLIENT_SECRET`) ?? '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: Deno.env.get(`${platform.toUpperCase()}_REDIRECT_URI`) ?? ''
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Sauvegarder la connexion
    const { error: connectionError } = await supabase
      .from('social_media_connections')
      .insert({
        platform,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: tokenData.expires_in 
          ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
          : null,
        account_id: tokenData.account_id || '',
        account_name: tokenData.account_name || '',
        account_type: tokenData.account_type || 'business',
        user_id: stateData.user_id
      });

    if (connectionError) {
      throw connectionError;
    }

    // Supprimer l'état OAuth utilisé
    await supabase
      .from('oauth_states')
      .delete()
      .eq('id', stateData.id);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
}); 