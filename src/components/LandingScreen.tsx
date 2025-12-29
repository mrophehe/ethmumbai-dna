import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2, Zap } from 'lucide-react';

interface LandingScreenProps {
  onConnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

export function LandingScreen({ onConnect, isConnecting, error }: LandingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 animate-slide-up">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">⟠</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🧬</div>
      
      <div className="text-center max-w-2xl">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-foreground/10 flex items-center justify-center animate-pulse-glow">
              <Zap className="w-12 h-12 text-foreground" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
          ETHMumbai
          <br />
          <span className="text-foreground/90">Maxi Checker</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-foreground/80 mb-12 font-medium">
          Check your ETHMumbai DNA 🧬
        </p>

        {/* Connect Button */}
        <div className="flex flex-col gap-4 items-center">
          <Button
            onClick={onConnect}
            disabled={isConnecting}
            size="lg"
            className="w-full max-w-xs text-lg h-14 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </>
            )}
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 bg-foreground/10 rounded-lg border border-foreground/20">
            <p className="text-foreground/90 font-medium">{error}</p>
          </div>
        )}

        {/* Footer hint */}
        <p className="mt-12 text-foreground/60 text-sm">
          No signup. No forms. Just vibes. ⚡
        </p>
      </div>
    </div>
  );
}
