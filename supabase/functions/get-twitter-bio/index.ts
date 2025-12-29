import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fun bio generator based on persona
function generateFlavorBio(username: string): string {
  const bios = [
    `Vibes immaculate. ${username} is definitely one of us.`,
    `${username} has that main character energy in the ETH ecosystem.`,
    `Legend says ${username} never missed an airdrop.`,
    `${username} was bullish before it was cool.`,
    `True degen energy from ${username}. WAGMI.`,
    `${username} speaks fluent Solidity and chaos.`,
    `Built different. ${username} knows the way.`,
    `${username} touched grass once, came back for more ETH.`,
  ];
  
  return bios[Math.floor(Math.random() * bios.length)];
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

    // Generate a fun flavor bio
    // Note: To get real Twitter data, you'd need Twitter API credentials
    const bio = generateFlavorBio(username);

    return new Response(
      JSON.stringify({ bio, username }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-twitter-bio function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
