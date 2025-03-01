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
      <h1>My Chess.com Stats♟️</h1>

      <h2>Rapid</h2>
      <p>Rating: <strong>{stats.chess_rapid?.last?.rating}</strong>. Only {getEloDifference('chess_rapid')} behind Magnus Carlsen!</p>
      <p>Best Rating: {stats.chess_rapid?.best?.rating}</p>
      <p>Record: {stats.chess_rapid?.record?.win} wins, {stats.chess_rapid?.record?.loss} losses</p>

      <h2>Bullet</h2>
      <p>Rating: <strong>{stats.chess_bullet?.last?.rating}</strong>. Only {getEloDifference('chess_bullet')} behind Magnus Carlsen!</p>
      <p>Best Rating: {stats.chess_bullet?.best?.rating}</p>
      <p>Record: {stats.chess_bullet?.record?.win} wins, {stats.chess_bullet?.record?.loss} losses</p>

      <h2>Blitz</h2>
      <p>Rating: <strong>{stats.chess_blitz?.last?.rating}</strong>. Only {getEloDifference('chess_blitz')} behind Magnus Carlsen!</p>
      <p>Best Rating: {stats.chess_blitz?.best?.rating}</p>
      <p>Record: {stats.chess_blitz?.record?.win} wins, {stats.chess_blitz?.record?.loss} losses</p>

      <h2>Puzzle Rush</h2>
      <p>Best Score: {stats.puzzle_rush?.best?.score}</p>
    </div>
  );
};

export default ChessStats;