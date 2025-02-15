import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const fetchChessStats = async (username: string) => {
  try {
    const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chess stats:', error);
    return null;
  }
};

const username = 'pichugang'; 

const ChessStats: FunctionalComponent = () => {
  const [bulletRating, setBulletRating] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      const data = await fetchChessStats(username);
      if (data && data.chess_bullet && data.chess_bullet.last) {
        setBulletRating(data.chess_bullet.last);
      } else {
        console.error('Bullet rating not found');
      }
    };

    getStats();
  }, []);

  if (bulletRating === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{username}'s Bullet Chess Rating</h1>
      <p>{bulletRating}</p>
    </div>
  );
};

export default ChessStats;
