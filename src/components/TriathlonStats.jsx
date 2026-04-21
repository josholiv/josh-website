import { useState } from 'preact/hooks';

const TriathlonStats = ({ data, error }) => {
  const units = ["miles", "km", "fields", "moon%"];
  const [unit, setUnit] = useState("miles");

  const toggleUnit = () => {
    setUnit(prevUnit => {
      const currentIndex = units.indexOf(prevUnit);
      return units[(currentIndex + 1) % units.length];
    });
  };

  const convertToFields = (distanceMeters) => Math.round(distanceMeters / 91.44);
  const convertToMoonPercentage = (distanceKm) => `${((distanceKm / 384400) * 100).toFixed(2)}%`;

  const swimDistanceKm = data?.swimDistanceKm || 0;
  const rideDistanceKm = data?.rideDistanceKm || 0;
  const runDistanceKm  = data?.runDistanceKm  || 0;

  const getDistance = (distanceKm) => {
    if (unit === "miles")  return Math.round(distanceKm / 1.60934);
    if (unit === "km")     return distanceKm;
    if (unit === "fields") return convertToFields(distanceKm * 1000);
    return convertToMoonPercentage(distanceKm);
  };

  const unitLabel = unit === "miles"  ? "miles"
                  : unit === "km"     ? "kilometers"
                  : unit === "fields" ? "American football fields"
                  : "% Earth → Moon";

  const sports = [
    { label: "Swimming", km: swimDistanceKm },
    { label: "Cycling",   km: rideDistanceKm },
    { label: "Running",  km: runDistanceKm  },
  ];

  return (
    <div>
      <table style={{ borderCollapse: 'collapse', marginBottom: '1rem', width: 'auto' }}>
  <thead>
    <tr>
      <th style={{ textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'normal' }}>Sport</th>
      <th style={{ textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'normal' }}>Distance ({unitLabel})</th>
    </tr>
  </thead>
  <tbody>
    {sports.map(({ label, km }) => (
      <tr key={label}>
        <td style={{ fontWeight: 'bold', paddingRight: '2rem' }}>{label}</td>
        <td style={{ fontFamily: "Ubuntu Mono", color: 'var(--text-normal)' }}>{getDistance(km)}</td>
      </tr>
    ))}
  </tbody>
</table>
      <button onClick={toggleUnit} className="btn">Change unit</button>
    </div>
  );
};

export default TriathlonStats;