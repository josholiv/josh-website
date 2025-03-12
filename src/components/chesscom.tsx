import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const fetchChessStats = async (username: string) => {
  const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
  return await response.json();
};

const username = 'pichugang';
const magnusUsername = 'MagnusCarlsen';

const ChessStats: FunctionalComponent = () => {
  const [stats, setStats] = useState(null);
  const [magnusStats, setMagnusStats] = useState(null);

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
    <div>
      <h3>Bullet chess♟️</h3>
      <h4>(data from chess.com)</h4>
          <p>Rating: <strong>{stats.chess_bullet?.last?.rating}</strong>. Only {getEloDifference('chess_bullet')} behind Magnus Carlsen!</p>
          <p>Best Rating: {stats.chess_bullet?.best?.rating}</p>
          <p>Record: {stats.chess_bullet?.record?.win} wins, {stats.chess_bullet?.record?.loss} losses</p>
    </div>
  );
};

export default ChessStats;