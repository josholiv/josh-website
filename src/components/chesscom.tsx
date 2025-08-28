import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const fetchChessStats = async (username: string) => {
  const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
  return await response.json();
};

const username = 'pichugang';
const chessboard = '/chessboard.svg';

const ChessStats: FunctionalComponent = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const getStats = async () => {
      const userStats = await fetchChessStats(username);
      setStats(userStats);
    };

    getStats();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  const totalGames = Object.values(stats)
    .filter((mode: any) => mode && mode.record)
    .reduce((acc: number, mode: any) => {
      return acc + (mode.record.win || 0) + (mode.record.loss || 0) + (mode.record.draw || 0);
    }, 0);

  const formatCard = (
    label: string,
    value: string | number | undefined,
    color?: string,
    isLast: boolean
  ) => (
    <div style={{
      color: color,
      padding: '0rem 1rem 0rem 0rem',
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      textAlign: 'left',
      borderRight: isLast ? 'none' : '1px solid var(--neutral-200)',
    }}>
        <div style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
          {label}
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {value ?? '–'}
        </div>
      </div>
  );

  return (
         <div style={{position: 'relative' }}>
      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--neutral-050)',
        borderRadius: '5px',
        position: 'relative',
      }}>
      <div style={{textAlign: 'left', color: "var(--neutral-999)" }}>
 
</div>
      
      {/* Card rows */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'left',
          gap: '1rem',
          }}>
          {formatCard('Bullet', stats.chess_bullet?.last?.rating, 'var(--red-600)', false)}
          {formatCard('Blitz', stats.chess_blitz?.last?.rating, 'var(--pink-600)', false)}
          {formatCard('Rapid', stats.chess_rapid?.last?.rating, 'var(--purple-600)', true)}
        </div>
      </div>
      </div>
  );
};

export default ChessStats;
