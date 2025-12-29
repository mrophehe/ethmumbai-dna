import { useRef, forwardRef } from 'react';
import type { WalletData, PersonaData } from '@/hooks/useWallet';

interface MaxiCardProps {
  walletData: WalletData;
  persona: PersonaData;
  xHandle?: string;
  xBio?: string;
}

export const MaxiCard = forwardRef<HTMLDivElement, MaxiCardProps>(
  ({ walletData, persona, xHandle, xBio }, ref) => {
    const shortenAddress = (address: string) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
      <div
        ref={ref}
        className="w-full max-w-md mx-auto glass-card rounded-2xl overflow-hidden"
        style={{ aspectRatio: '1/1.2' }}
      >
        {/* Card Header */}
        <div className="eth-gradient px-6 py-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-2 text-4xl">⟠</div>
            <div className="absolute bottom-2 right-2 text-4xl">🧬</div>
          </div>
          <h2 className="text-2xl font-bold text-eth-white relative z-10">
            ETHMumbai DNA 🧬
          </h2>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-5 bg-card">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            {xHandle ? (
              <img
                src={`https://unavatar.io/twitter/${xHandle}`}
                alt={xHandle}
                className="w-16 h-16 rounded-full border-4 border-eth-red object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${walletData.address}`;
                }}
              />
            ) : (
              <img
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${walletData.address}`}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-4 border-eth-red"
              />
            )}
            <div>
              <p className="font-mono text-sm text-muted-foreground">
                {walletData.ensName || shortenAddress(walletData.address)}
              </p>
              {xHandle && (
                <p className="text-sm text-eth-red font-medium">@{xHandle}</p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-eth-red/5 rounded-xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                ETH Archetype
              </p>
              <p className="text-2xl font-bold text-eth-red">{persona.archetype}</p>
            </div>
            <div className="bg-eth-red/5 rounded-xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Mumbai Mode
              </p>
              <p className="text-lg font-bold text-eth-red-dark">{persona.mumbaiMode}</p>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-eth-gold/10 rounded-xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Gas Style
              </p>
              <p className="text-xl font-bold text-accent-foreground">{persona.gasStyle}</p>
            </div>
            <div className="bg-eth-red/10 rounded-xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                OG Energy
              </p>
              <p className="text-2xl font-bold text-eth-red">{persona.ogEnergy}%</p>
            </div>
          </div>

          {/* X Bio if available */}
          {xBio && (
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Vibe Check ✨
              </p>
              <p className="text-sm text-card-foreground italic">"{xBio}"</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-2 border-t border-border">
            <p className="text-sm font-medium text-muted-foreground">
              Built on ETH. Survived Mumbai. 🚀
            </p>
          </div>
        </div>
      </div>
    );
  }
);

MaxiCard.displayName = 'MaxiCard';
