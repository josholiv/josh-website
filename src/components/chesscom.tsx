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
      <p>
        My bullet chess rating<sup>†</sup> is{" "}  
          <strong style={{ fontSize: "1.5rem", color: "#f200ff" }}>
            {stats.chess_bullet?.last?.rating}
          </strong>
        —only <strong>{getEloDifference("chess_bullet")}</strong> behind{" "}
        <a href="https://www.chess.com/member/magnuscarlsen" target="_blank" rel="noopener noreferrer">
          GM Magnus Carlsen
        </a>!
      </p>
    </div>
  );
};

export default ChessStats;