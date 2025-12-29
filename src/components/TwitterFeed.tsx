import { Twitter, ExternalLink } from 'lucide-react';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
}

interface TwitterFeedProps {
  tweets: Tweet[];
  username: string;
}

export function TwitterFeed({ tweets, username }: TwitterFeedProps) {
  if (!tweets || tweets.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 animate-slide-up">
      <div className="bg-foreground/10 rounded-2xl p-4 border border-foreground/20">
        <div className="flex items-center gap-2 mb-4">
          <Twitter className="w-5 h-5 text-foreground" />
          <h3 className="font-bold text-foreground">Recent Posts from @{username}</h3>
        </div>
        
        <div className="space-y-3">
          {tweets.map((tweet) => (
            <a
              key={tweet.id}
              href={`https://twitter.com/${username}/status/${tweet.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors group"
            >
              <p className="text-sm text-foreground/90 leading-relaxed">
                {tweet.text}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-foreground/50">
                  {formatDate(tweet.created_at)}
                </span>
                <ExternalLink className="w-3 h-3 text-foreground/30 group-hover:text-foreground/60 transition-colors" />
              </div>
            </a>
          ))}
        </div>
        
        <a
          href={`https://twitter.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-center text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          View full profile →
        </a>
      </div>
    </div>
  );
}
