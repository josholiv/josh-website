import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Zap, Flame, Clock } from 'lucide-preact';

const USERNAME = 'pichugang';

const ChessStats: FunctionalComponent = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch(`https://api.chess.com/pub/player/${USERNAME}/stats`)
      .then(r => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <div>Loading...</div>;

  const modes = [
    { label: 'bullet', rating: stats.chess_bullet?.last?.rating, Icon: Zap },
    { label: 'blitz',  rating: stats.chess_blitz?.last?.rating,  Icon: Flame },
    { label: 'rapid',  rating: stats.chess_rapid?.last?.rating,  Icon: Clock },
  ];

  return (
    <div class="stat-grid">
      {modes.map(({ label, rating, Icon }) => (
        <div class="stat-card" key={label}>
          <span class="stat-card-icon"><Icon size="1.5rem" /></span>
          <span class="stat-card-number">{rating ?? '–'}</span>
          <span class="stat-card-label">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default ChessStats;
