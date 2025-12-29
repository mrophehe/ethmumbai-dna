import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { LandingScreen } from '@/components/LandingScreen';
import { MaxiCard } from '@/components/MaxiCard';
import { ShareActions } from '@/components/ShareActions';
import { TwitterFeed } from '@/components/TwitterFeed';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
}

const Index = () => {
  const { isConnecting, walletData, persona, error, connectWallet, reset } = useWallet();
  const [xHandle, setXHandle] = useState<string>('');
  const [xBio, setXBio] = useState<string>('');
  const [xTweets, setXTweets] = useState<Tweet[]>([]);
  const [isLoadingBio, setIsLoadingBio] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch X bio and tweets when we have both wallet and X handle
  useEffect(() => {
    const fetchXData = async () => {
      if (!xHandle || !walletData) return;

      setIsLoadingBio(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-twitter-bio', {
          body: { username: xHandle },
        });

        if (error) throw error;
        if (data?.bio) {
          setXBio(data.bio);
        }
        if (data?.tweets) {
          setXTweets(data.tweets);
        }
      } catch (err) {
        console.error('Failed to fetch X data:', err);
      } finally {
        setIsLoadingBio(false);
      }
    };

    fetchXData();
  }, [xHandle, walletData]);

  const handleReset = () => {
    reset();
    setXHandle('');
    setXBio('');
    setXTweets([]);
  };

  // Show landing screen if no wallet connected
  if (!walletData || !persona) {
    return (
      <LandingScreen
        onConnect={connectWallet}
        onXHandle={setXHandle}
        isConnecting={isConnecting}
        error={error}
      />
    );
  }

  // Show result card
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">⟠</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🧬</div>

      <div className="text-center mb-8 animate-slide-up">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Your ETHMumbai DNA
        </h1>
        <p className="text-lg text-foreground/70">
          You're a <span className="font-bold text-foreground">{persona.archetype}</span>! 🎉
        </p>
      </div>

      <div className="animate-scale-in relative">
        {isLoadingBio && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-2xl z-10">
            <Loader2 className="w-8 h-8 animate-spin text-foreground" />
          </div>
        )}
        <MaxiCard
          ref={cardRef}
          walletData={walletData}
          persona={persona}
          xHandle={xHandle}
          xBio={xBio}
        />
      </div>

      <ShareActions
        cardRef={cardRef}
        persona={persona}
        xHandle={xHandle}
        onReset={handleReset}
      />

      {/* Twitter Feed - Rendered below Share Actions */}
      {xHandle && xTweets.length > 0 && (
        <TwitterFeed tweets={xTweets} username={xHandle} />
      )}
    </div>
  );
};

export default Index;
