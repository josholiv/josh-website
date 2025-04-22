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
  <p>My current Chess.com<sup>†</sup> ratings are:</p>

  <p>
    <strong style={{ fontSize: "2rem", color: "#f200ff" }}>
      {stats.chess_bullet?.last?.rating}
    </strong>{" "}
    in <a href="https://www.chess.com/terms/bullet-chess" target="_blank" rel="noopener noreferrer">bullet chess</a>.{" "}
      Only {getEloDifference("chess_bullet")} behind{" "}
      <a href="https://www.chess.com/member/magnuscarlsen" target="_blank" rel="noopener noreferrer">
        GM Magnus Carlsen
      </a>!
  </p>

  <p>
    <strong style={{ fontSize: "2rem", color: "#9b4dca" }}>
      {stats.chess_blitz?.last?.rating}
    </strong>{" "}
    in <a href="https://www.chess.com/terms/blitz-chess" target="_blank" rel="noopener noreferrer">blitz chess</a>.{" "}
      Only {getEloDifference("chess_blitz")} behind{" "}
      <a href="https://www.chess.com/member/magnuscarlsen" target="_blank" rel="noopener noreferrer">
        GM Magnus Carlsen
      </a>!
  </p>

  <p>
    <strong style={{ fontSize: "2rem", color: "#5c6bc0" }}>
      {stats.chess_rapid?.last?.rating}
    </strong>{" "}
    in <a href="https://www.chess.com/terms/rapid-chess" target="_blank" rel="noopener noreferrer">rapid chess</a>.{" "}
      Only {getEloDifference("chess_rapid")} behind{" "}
      <a href="https://www.chess.com/member/magnuscarlsen" target="_blank" rel="noopener noreferrer">
        GM Magnus Carlsen
      </a>!
  </p>
</div>
  );
};

export default ChessStats;