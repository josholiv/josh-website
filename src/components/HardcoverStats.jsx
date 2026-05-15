import { useState, useEffect } from 'preact/hooks';
import { BookOpen, Target } from 'lucide-preact';

const HardcoverStats = () => {
  const [goals, setGoals] = useState([{ goal: 0, progress: 0 }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/hardcover')
      .then(async r => {
        const payload = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(payload?.error || `Hardcover API request failed (${r.status})`);
        return payload;
      })
      .then(result => {
        if (result.goals) setGoals(result.goals);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <>
      {goals.map((g, i) => (
        <div class="stat-grid" key={i}>
          <div class="stat-card">
            <span class="stat-card-icon"><BookOpen size="1.5rem" /></span>
            <span class="stat-card-number">{g.progress}</span>
            <span class="stat-card-label">books read</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-icon"><Target size="1.5rem" /></span>
            <span class="stat-card-number">{g.goal}</span>
            <span class="stat-card-label">reading goal</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default HardcoverStats;
