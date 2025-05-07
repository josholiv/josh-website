import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const fetchChessStats = async (username: string) => {
  const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
  return await response.json();
};

const username = 'pichugang';
const magnusUsername = 'MagnusCarlsen';
const chessboard = '/chessboard.svg';

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

    const formatCard = (
      label: string,
      value: string | number | undefined,
      href?: string,
      color?: string,
      emoji?: string
    ) => (
      <div style={{ flex: '1 1 calc(50% - 0.5rem)', minWidth: '8rem', maxWidth: '9rem' }}>
        <div style={{
          backgroundColor: '#252525',
          border: 'solid',
          padding: '0.5rem 0.8rem',
          borderRadius: '1rem',
          color: color || '#ffffff',
          textAlign: 'center',
        }}>
          <strong style={{ fontSize: '1.5rem' }}>{value ?? '–'}</strong><br />
          <div style={{ marginBottom: '0.1rem' }}>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ color, textDecoration: 'underline' }}>
                {label}
              </a>
            ) : label}
          </div>
          <div style={{ fontSize: '1.2rem' }}>{emoji}</div>
        </div>
      </div>
    );

  return (
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
          padding: '2rem',
          borderRadius: '1rem',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          textAlign: 'center',
          backgroundImage: `url(${chessboard})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <p style={{
          textAlign: 'left', 
          alignSelf: 'flex-start', 
          backgroundColor: '#4E7837', 
          padding: '0.2rem 0.5rem', 
          borderRadius: '0.5rem', 
          color: '#ffffff', 
        }}>
          My <strong>current</strong> chess stats and ratings<sup>†</sup> are:
        </p>

        {/* Card rows */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '0rem',
          maxWidth: '500px',
          fontSize: '1.2rem',  
          fontWeight: 'bold',
        }}>
          {formatCard('Games', totalGames, undefined, '#c2185b', '♟️')}
          {formatCard('Bullet', stats.chess_bullet?.last?.rating, 'https://www.chess.com/terms/bullet-chess', '#f200ff', '♟️💨')}
          {formatCard('Blitz', stats.chess_blitz?.last?.rating, 'https://www.chess.com/terms/blitz-chess', '#9b4dca' , '⚡')}
          {formatCard('Rapid', stats.chess_rapid?.last?.rating, 'https://www.chess.com/terms/rapid-chess', '#5c6bc0', '⏱️')}
          {formatCard('Daily', stats.chess_daily?.last?.rating, '', '#00acc1', '☀️')}
          {formatCard('Puzzles', stats.tactics?.highest?.rating, '', '#ff9800', '🧩')}
        </div>

        <div className="btn" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
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
  );
};

export default ChessStats;
