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
        backgroundColor: '#252525',
        border: 'solid',
        padding: '0.5rem 0.8rem',
        borderRadius: '1rem',
        display: 'inline-block',
        color: color || '#ffffff',
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
            height: '100%',
            maxWidth: '60ch',
            aspectRatio: '1 / 1',
            background: 'repeating-conic-gradient(#eeeed2 0% 25%, #769656 0% 50%) -.4% -.4% / 25.2% 25.2%', // slightly larger than 25% and slightly offset to fix "subpixel" rendering glitch on edges
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
              color: '#ffffff',
              padding: '0rem',
              textAlign: 'center',
              overflowY: 'auto',
            }}
          >

          <p>
            <span style={{
              backgroundColor: '#769656',
              padding: '0.5rem 1rem',
              border: 'solid',
              borderRadius: '1rem',
              display: 'inline-block',
              color: '#ffffff',
              fontSize: '1rem',
              marginTop: '-1rem',
            }}>
              My current Chess.com<sup>†</sup> ratings are:
            </span>
          </p>


            {/* First row */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '-0.5rem'}}>
              {formatCard('Games', totalGames, undefined, '#c2185b')}
              {formatCard('Bullet', stats.chess_bullet?.last?.rating, 'https://www.chess.com/terms/bullet-chess', '#f200ff')}
              {formatCard('Blitz', stats.chess_blitz?.last?.rating, 'https://www.chess.com/terms/blitz-chess', '#9b4dca')}
            </div>

            {/* Second row */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '-1rem' }}>
              {formatCard('Rapid', stats.chess_rapid?.last?.rating, 'https://www.chess.com/terms/rapid-chess', '#5c6bc0')}
              {formatCard('Daily', stats.chess_daily?.last?.rating, '', '#00acc1')}
              {formatCard('Puzzles', stats.tactics?.highest?.rating, '', '#ff9800')}
            </div>

            <div className = 'btn' style={{ marginTop: '0.5rem', textAlign: 'center' }}>
              <a
                href="https://link.chess.com/friend/Py1tup"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#000000',
                  textDecoration: 'none',
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
