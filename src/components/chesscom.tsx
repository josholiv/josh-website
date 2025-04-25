import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const fetchChessStats = async (username: string) => {
  const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
  return await response.json();
};

const username = 'pichugang';
const magnusUsername = 'MagnusCarlsen';

const ChessStats: FunctionalComponent = () => {
  const [stats, setStats] = useState<any>(null);
  const [magnusStats, setMagnusStats] = useState<any>(null);

  useEffect(() => {
    const getStats = async () => {
      const [userStats, magnusStats] = await Promise.all([
        fetchChessStats(username),
        fetchChessStats(magnusUsername),
      ]);
      setStats(userStats);
      setMagnusStats(magnusStats);
    };

    getStats();
  }, []);

  if (!stats || !magnusStats) {
    return <div>Loading...</div>;
  }

  const totalGames = Object.values(stats)
    .filter((mode: any) => mode && mode.record)
    .reduce((acc: number, mode: any) => {
      return acc + (mode.record.win || 0) + (mode.record.loss || 0) + (mode.record.draw || 0);
    }, 0);

  const formatCard = (label: string, value: string | number | undefined, href?: string, color?: string) => (
    <p>
      <span style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '0.5rem 1rem',
        borderRadius: '1rem',
        display: 'inline-block',
        color: color || '#fff',
      }}>
        <strong style={{ fontSize: '2rem' }}>{value ?? '–'}</strong><br />
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" style={{ color, textDecoration: 'underline' }}>
            {label}
          </a>
        ) : label}
      </span>
    </p>
  );

  return (
    <>
      <p>My current Chess.com<sup>†</sup> ratings are:</p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '0rem',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '60ch',
            aspectRatio: '1 / 1',
            background: 'repeating-conic-gradient(#eeeed2 0% 25%, #769656 0% 50%) 0 / 25% 25%',
            borderRadius: '1rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontFamily: 'sans-serif',
              padding: '1rem',
              textAlign: 'center',
              overflowY: 'auto',
            }}
          >
            {/* First row */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {formatCard('Games', totalGames, undefined, '#c2185b')}
              {formatCard('Bullet', stats.chess_bullet?.last?.rating, 'https://www.chess.com/terms/bullet-chess', '#f200ff')}
              {formatCard('Blitz', stats.chess_blitz?.last?.rating, 'https://www.chess.com/terms/blitz-chess', '#9b4dca')}
            </div>

            {/* Second row */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
              {formatCard('Rapid', stats.chess_rapid?.last?.rating, 'https://www.chess.com/terms/rapid-chess', '#5c6bc0')}
              {formatCard('Daily', stats.chess_daily?.last?.rating, '', '#00acc1')}
              {formatCard('Puzzles', stats.tactics?.highest?.rating, '', '#ff9800')}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <a
                href="https://link.chess.com/friend/Py1tup"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#d9d9d9',
                  borderRadius: '2rem',
                  fontFamily: 'monospace',
                  color: '#000000',
                  fontSize: '1rem',
                  fontWeight: 'normal',
                  textTransform: 'uppercase',
                  padding: '1rem 1rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                ♟️ Play me in chess!
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChessStats;
