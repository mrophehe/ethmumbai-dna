import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TWITTER_BEARER_TOKEN = Deno.env.get('TWITTER_BEARER_TOKEN');

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  description?: string;
  profile_image_url?: string;
}

interface Tweet {
  id: string;
  text: string;
  created_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();

    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!TWITTER_BEARER_TOKEN) {
      console.error('TWITTER_BEARER_TOKEN not configured');
      return new Response(
        JSON.stringify({ 
          bio: `@${username} is vibing in the ETH ecosystem 🌊`,
          tweets: [],
          fallback: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user info
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=description,profile_image_url`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Twitter user API error:', userResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          bio: `@${username} keeps it mysterious 🎭`,
          tweets: [],
          fallback: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userData = await userResponse.json();
    const user: TwitterUser = userData.data;

    if (!user) {
      return new Response(
        JSON.stringify({ 
          bio: `@${username} is too based to be found 🔮`,
          tweets: [],
          fallback: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch recent tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${user.id}/tweets?max_results=5&tweet.fields=created_at`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    let tweets: Tweet[] = [];
    if (tweetsResponse.ok) {
      const tweetsData = await tweetsResponse.json();
      tweets = tweetsData.data || [];
    } else {
      console.error('Twitter tweets API error:', tweetsResponse.status);
    }

    // Generate personalized flavor text based on bio and tweets
    let flavorText = user.description || `@${username} is making moves in web3`;
    
    // Shorten if too long
    if (flavorText.length > 150) {
      flavorText = flavorText.substring(0, 147) + '...';
    }

    return new Response(
      JSON.stringify({ 
        bio: flavorText,
        tweets: tweets.slice(0, 3).map(t => ({
          id: t.id,
          text: t.text.length > 200 ? t.text.substring(0, 197) + '...' : t.text,
          created_at: t.created_at,
        })),
        profileImage: user.profile_image_url?.replace('_normal', '_400x400'),
        name: user.name,
        username: user.username,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-twitter-bio function:', error);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        bio: 'Anon energy detected 👀',
        tweets: [],
        fallback: true 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
