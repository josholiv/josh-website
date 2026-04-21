import { useState, useEffect } from 'preact/hooks';

const HardcoverStats = () => {
  const [goals, setGoals] = useState([{ goal: 0, progress: 0 }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/hardcover')
      .then(async r => {
        const payload = await r.json().catch(() => ({}));
        if (!r.ok) {
          throw new Error(payload?.error || `Hardcover API request failed (${r.status})`);
        }
        return payload;
      })
      .then(result => {
        if (result.goals) setGoals(result.goals);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <table style={{ borderCollapse: 'collapse', marginBottom: '1rem', width: 'auto' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'normal' }}>Goal</th>
          <th style={{ textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'normal' }}>Read</th>
        </tr>
      </thead>
      <tbody>
        {goals.map((g, i) => (
          <tr key={i}>
            <td style={{ fontWeight: 'bold', paddingRight: '2rem'  }}>{g.goal}</td>
            <td style={{ fontFamily: 'Ubuntu Mono' }}>{g.progress}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HardcoverStats;