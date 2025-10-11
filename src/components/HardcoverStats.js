import { useState, useEffect } from 'preact/hooks';
import HardcoverAPI from './Hardcover.js';

const HardcoverStats = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        let data;
        try {
          const hc = new HardcoverAPI();
          data = await hc.fetch();
        } catch (e) {
          // Dummy data if API key is missing
          data = [{ goal: 999, progress: 999 }];
        }
        setGoals(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  if (loading) return <p>Loading reading stats…</p>;
  if (error) return <p>Error loading Hardcover stats: {error}</p>;

  const formatCard = (progress, goal, color, isLast) => {
    const percent = goal ? Math.min((parseFloat(progress) / parseFloat(goal)) * 100, 100) : 0;

    return (
      <div
        style={{
          color: color,
          padding: '0.5rem 1rem',
          display: 'inline-flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          textAlign: 'left',
          borderRight: isLast ? 'none' : '1px solid var(--neutral-200)',
          minWidth: '120px',
        }}
      >
        <div style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>Books Read</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
          {progress} / {goal}
        </div>
        <div
          style={{
            marginTop: '0.3rem',
            width: '100%',
            height: '6px',
            backgroundColor: 'var(--neutral-700)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: '100%',
              backgroundColor: color,
            }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          padding: '1rem',
          backgroundColor: 'var(--neutral-800)',
          color: 'var(--neutral-400)',
          borderRadius: '5px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {goals.length === 0 ? (
          <p>No reading goals set for this year.</p>
        ) : (
          goals.map((g, i) =>
            formatCard(g.progress, g.goal, 'var(--blue-400)', i === goals.length - 1)
          )
        )}
      </div>
    </div>
  );
};

export default HardcoverStats;
