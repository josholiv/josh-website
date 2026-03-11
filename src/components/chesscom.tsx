import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const fetchChessStats = async (username: string) => {
  const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
  return await response.json();
};

const username = 'pichugang';

const ChessStats: FunctionalComponent = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const getStats = async () => {
      const userStats = await fetchChessStats(username);
      setStats(userStats);
    };
    getStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  const modes = [
    { label: 'Bullet', rating: stats.chess_bullet?.last?.rating },
    { label: 'Blitz',  rating: stats.chess_blitz?.last?.rating },
    { label: 'Rapid',  rating: stats.chess_rapid?.last?.rating },
  ];

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', paddingRight: '2rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Mode</th>
          <th style={{ textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'normal' }}>Rating</th>
        </tr>
      </thead>
      <tbody>
        {modes.map(({ label, rating }) => (
          <tr key={label}>
            <td style={{ paddingRight: '2rem', paddingBottom: '0.3rem', fontWeight: 'bold' }}>{label}</td>
            <td style={{ paddingBottom: '0.3rem', color: 'var(--text-normal)' }}>{rating ?? '–'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChessStats;