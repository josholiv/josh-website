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
  <h3>I also love playing chess ♟️. My current chess ratings on Chess.com<sup>†</sup> are:</h3>

  <p style={{ textIndent: "2rem" }}>
    <strong style={{ fontSize: "2rem", color: "#f200ff" }}>
      {stats.chess_bullet?.last?.rating}
    </strong>{" "}
    in <a href="https://www.chess.com/terms/bullet-chess" target="_blank" rel="noopener noreferrer">bullet chess</a>.{" "}
    <i>
      Only <strong style={{ color: "#f200ff" }}>{getEloDifference("chess_bullet")}</strong> behind{" "}
      <a href="https://www.chess.com/member/magnuscarlsen" target="_blank" rel="noopener noreferrer">
        GM Magnus Carlsen
      </a>!
    </i>
  </p>

  <p style={{ textIndent: "2rem" }}>
    <strong style={{ fontSize: "2rem", color: "#9b4dca" }}>
      {stats.chess_blitz?.last?.rating}
    </strong>{" "}
    in <a href="https://www.chess.com/terms/blitz-chess" target="_blank" rel="noopener noreferrer">blitz chess</a>.{" "}
    <i>
      Only <strong style={{ color: "#9b4dca" }}>{getEloDifference("chess_blitz")}</strong> behind{" "}
      <a href="https://www.chess.com/member/magnuscarlsen" target="_blank" rel="noopener noreferrer">
        GM Magnus Carlsen
      </a>!
    </i>
  </p>

  <p style={{ textIndent: "2rem" }}>
    <strong style={{ fontSize: "2rem", color: "#5c6bc0" }}>
      {stats.chess_rapid?.last?.rating}
    </strong>{" "}
    in <a href="https://www.chess.com/terms/rapid-chess" target="_blank" rel="noopener noreferrer">rapid chess</a>.{" "}
    <i>
      Only <strong style={{ color: "#5c6bc0" }}>{getEloDifference("chess_rapid")}</strong> behind{" "}
      <a href="https://www.chess.com/member/magnuscarlsen" target="_blank" rel="noopener noreferrer">
        GM Magnus Carlsen
      </a>!
    </i>
  </p>
</div>
  );
};

export default ChessStats;