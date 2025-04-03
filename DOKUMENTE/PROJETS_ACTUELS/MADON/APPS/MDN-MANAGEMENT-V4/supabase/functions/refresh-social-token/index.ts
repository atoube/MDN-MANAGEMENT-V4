import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const platformConfig = {
  facebook: {
    tokenUrl: 'https://graph.facebook.com/v12.0/oauth/access_token'
  },
  instagram: {
    tokenUrl: 'https://graph.instagram.com/refresh_access_token'
  },
  linkedin: {
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken'
  },
  twitter: {
    tokenUrl: 'https://api.twitter.com/2/oauth2/token'
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { connectionId } = await req.json();

    if (!connectionId) {
      throw new Error('Missing connection ID');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer la connexion
    const { data: connection, error: connectionError } = await supabase
      .from('social_media_connections')
      .select()
      .eq('id', connectionId)
      .single();

    if (connectionError || !connection) {
      throw new Error('Connection not found');
    }

    const config = platformConfig[connection.platform as keyof typeof platformConfig];
    if (!config) {
      throw new Error('Invalid platform');
    }

    // Rafraîchir le token
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: Deno.env.get(`${connection.platform.toUpperCase()}_CLIENT_ID`) ?? '',
        client_secret: Deno.env.get(`${connection.platform.toUpperCase()}_CLIENT_SECRET`) ?? '',
        grant_type: 'refresh_token',
        refresh_token: connection.refresh_token
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to refresh token');
    }

    // Mettre à jour la connexion
    const { error: updateError } = await supabase
      .from('social_media_connections')
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || connection.refresh_token,
        token_expires_at: tokenData.expires_in 
          ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
          : null,
        status: 'active'
      })
      .eq('id', connectionId);

    if (updateError) {
      throw updateError;
    }

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