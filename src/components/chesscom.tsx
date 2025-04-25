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

  const getEloDifference = (category: string) => {
    const myElo = stats[category]?.last?.rating || 0;
    const magnusElo = magnusStats[category]?.last?.rating || 0;
    return magnusElo - myElo;
  };

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
            maxWidth: '480px',
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
            <p>
              <span style={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                display: 'inline-block',
              }}>
                <strong style={{ fontSize: '2rem', color: '#f200ff' }}>
                  {stats.chess_bullet?.last?.rating}
                </strong>{" "}
                in{" "}
                <a
                  href="https://www.chess.com/terms/bullet-chess"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#fff', textDecoration: 'underline' }}
                >
                  bullet chess
                </a>
              </span>
            </p>

            <p>
              <span style={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                display: 'inline-block',
              }}>
                <strong style={{ fontSize: '2rem', color: '#9b4dca' }}>
                  {stats.chess_blitz?.last?.rating}
                </strong>{" "}
                in{" "}
                <a
                  href="https://www.chess.com/terms/blitz-chess"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#fff', textDecoration: 'underline' }}
                >
                  blitz chess
                </a>
              </span>
            </p>

            <p>
              <span style={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                display: 'inline-block',
              }}>
                <strong style={{ fontSize: '2rem', color: '#5c6bc0' }}>
                  {stats.chess_rapid?.last?.rating}
                </strong>{" "}
                in{" "}
                <a
                  href="https://www.chess.com/terms/rapid-chess"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#fff', textDecoration: 'underline' }}
                >
                  rapid chess
                </a>
              </span>
            </p>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <a
                href="https://link.chess.com/friend/Py1tup"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'rgb(65,171,93, 0.85)',
                  borderRadius: '1rem',
                  fontFamily: 'monospace',
                  color: '#ffffe5',
                  fontSize: '1rem',
                  fontWeight: 'normal',
                  textTransform: 'uppercase',
                  padding: '0.5rem 1rem',
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
