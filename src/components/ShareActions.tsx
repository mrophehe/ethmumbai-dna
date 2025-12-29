import { Button } from '@/components/ui/button';
import { Twitter, Download, RotateCcw, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

interface ShareActionsProps {
  cardRef: React.RefObject<HTMLDivElement>;
  persona: { archetype: string; ogEnergy: number };
  xHandle?: string;
  onReset: () => void;
}

export function ShareActions({ cardRef, persona, xHandle, onReset }: ShareActionsProps) {
  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
      });
      
      const link = document.createElement('a');
      link.download = `ethmumbai-maxi-${persona.archetype.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success('Card downloaded! Time to flex 💪');
    } catch (err) {
      toast.error('Failed to download card');
    }
  };

  const shareToX = () => {
    const text = `I'm an ETHMumbai ${persona.archetype} with ${persona.ogEnergy}% OG Energy! 🧬

Check your ETHMumbai DNA 👇`;
    
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    
    window.open(twitterUrl, '_blank');
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto mt-6">
      <Button
        onClick={shareToX}
        size="lg"
        className="w-full h-14 text-lg font-bold"
      >
        <Twitter className="mr-2 h-5 w-5" />
        Share on X
      </Button>

      <Button
        onClick={downloadCard}
        size="lg"
        variant="ghost"
        className="w-full h-14 text-lg font-semibold text-foreground/80 hover:text-foreground hover:bg-foreground/10 border-2 border-foreground/20"
      >
        <Download className="mr-2 h-5 w-5" />
        Download Card
      </Button>

      <Button
        onClick={onReset}
        size="lg"
        variant="ghost"
        className="w-full h-12 text-base font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Check Another Wallet
      </Button>
    </div>
  );
}
