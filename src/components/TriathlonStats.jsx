import { useState, useEffect } from 'preact/hooks';
import { Waves, Bike, SportShoe } from 'lucide-preact';

const UNITS = ['miles', 'km', 'fields', 'moon%'];

const TriathlonStats = () => {
  const [unit, setUnit] = useState(() => UNITS[Math.floor(Math.random() * UNITS.length)]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/strava')
      .then(async r => {
        const payload = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(payload?.error || `Strava API request failed (${r.status})`);
        return payload;
      })
      .then(result => { setData(result); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;

  const toggleUnit = () =>
    setUnit(u => UNITS[(UNITS.indexOf(u) + 1) % UNITS.length]);

  const fmt = (km) => {
    if (unit === 'miles')  return Math.round(km / 1.60934);
    if (unit === 'km')     return km;
    if (unit === 'fields') return Math.round(km * 1000 / 91.44);
    return ((km / 384400) * 100).toFixed(2) + '%';
  };

  const unitLabel = unit === 'miles'  ? 'miles'
                  : unit === 'km'     ? 'kilometers'
                  : unit === 'fields' ? 'football fields'
                  : 'to the moon';

  const sports = [
    { label: 'swimming', km: data?.swimDistanceKm || 0, Icon: Waves },
    { label: 'cycling',  km: data?.rideDistanceKm || 0, Icon: Bike },
    { label: 'running',  km: data?.runDistanceKm  || 0, Icon: SportShoe },
  ];

  return (
    <div>
      <div class="stat-grid">
        {sports.map(({ label, km, Icon }) => (
          <div class="stat-card" key={label}>
            <span class="stat-card-icon"><Icon size="1.5rem" /></span>
            <span class="stat-card-number">{fmt(km)}</span>
            <span class="stat-card-label">{unitLabel}</span>
            <span class="stat-card-label">{label}</span>
          </div>
        ))}
        <button onClick={toggleUnit} class="btn" style="align-self: end; justify-self: start;">Change unit</button>
      </div>
    </div>
  );
};

export default TriathlonStats;
