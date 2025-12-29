import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Twitter, ArrowRight, SkipForward } from 'lucide-react';

interface XHandlePromptProps {
  onSubmit: (handle: string) => void;
  onSkip: () => void;
}

export function XHandlePrompt({ onSubmit, onSkip }: XHandlePromptProps) {
  const [xHandle, setXHandle] = useState('');

  const handleSubmit = () => {
    const cleanHandle = xHandle.replace('@', '').trim();
    onSubmit(cleanHandle);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 animate-slide-up">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">⟠</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🧬</div>

      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center">
            <Twitter className="w-10 h-10 text-foreground" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          One more thing...
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-foreground/70 mb-8">
          Add your X handle for personalized flavor text and recent posts on your card
        </p>

        {/* Input */}
        <div className="space-y-4">
          <Input
            value={xHandle}
            onChange={(e) => setXHandle(e.target.value)}
            placeholder="@username"
            className="h-14 text-lg text-center bg-foreground/10 border-foreground/30 text-foreground placeholder:text-foreground/50"
            onKeyDown={(e) => e.key === 'Enter' && xHandle.trim() && handleSubmit()}
          />

          <Button
            onClick={handleSubmit}
            disabled={!xHandle.trim()}
            size="lg"
            className="w-full h-14 text-lg font-bold"
          >
            Generate My Card
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            onClick={onSkip}
            variant="ghost"
            size="lg"
            className="w-full h-12 text-base font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip for now
          </Button>
        </div>

        <p className="mt-8 text-foreground/50 text-sm">
          This is optional but makes your card way cooler ✨
        </p>
      </div>
    </div>
  );
}
