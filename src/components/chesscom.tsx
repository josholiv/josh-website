import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const fetchChessStats = async (username: string) => {
  const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
  return await response.json();
};

const username = 'pichugang';

const ChessStats: FunctionalComponent = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      const data = await fetchChessStats(username);
      setStats(data);
    };

    getStats();
  }, []);

  // Check if stats have been loaded before rendering
  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Josh's Chess.com Stats</h1>

      <h2>Rapid</h2>
      <p>Last Rating: {stats.chess_rapid?.last?.rating}</p>
      <p>Best Rating: {stats.chess_rapid?.best?.rating}</p>
      <p>Record: {stats.chess_rapid?.record?.win} wins, {stats.chess_rapid?.record?.loss} losses</p>

      <h2>Bullet</h2>
      <p>Last Rating: {stats.chess_bullet?.last?.rating}</p>
      <p>Best Rating: {stats.chess_bullet?.best?.rating}</p>
      <p>Record: {stats.chess_bullet?.record?.win} wins, {stats.chess_bullet?.record?.loss} losses</p>

      <h2>Blitz</h2>
      <p>Last Rating: {stats.chess_blitz?.last?.rating}</p>
      <p>Best Rating: {stats.chess_blitz?.best?.rating}</p>
      <p>Record: {stats.chess_blitz?.record?.win} wins, {stats.chess_blitz?.record?.loss} losses</p>

      <h2>Puzzle Rush</h2>
      <p>Best Score: {stats.puzzle_rush?.best?.score}</p>
      <p>Total Attempts: {stats.puzzle_rush?.best?.total_attempts}</p>
    </div>
  );
};

export default ChessStats;
