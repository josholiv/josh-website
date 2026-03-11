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

  const swimDistanceKm = data?.swimDistanceKm || 9999;
  const rideDistanceKm = data?.rideDistanceKm || 9999;
  const runDistanceKm  = data?.runDistanceKm  || 9999;
  const swimDistanceMi = data?.swimDistance   || 9999;
  const rideDistanceMi = data?.rideDistance   || 9999;
  const runDistanceMi  = data?.runDistance    || 9999;

  const getDistance = (distanceMi, distanceKm) => {
    if (unit === "miles")  return distanceMi;
    if (unit === "km")     return distanceKm;
    if (unit === "fields") return convertToFields(distanceKm * 1000);
    return convertToMoonPercentage(distanceKm);
  };

  const unitLabel = unit === "miles"  ? "miles"
                  : unit === "km"     ? "km"
                  : unit === "fields" ? "fields"
                  : "% Earth → Moon";

  const sports = [
    { label: "Swimming", mi: swimDistanceMi, km: swimDistanceKm },
    { label: "Biking", mi: rideDistanceMi, km: rideDistanceKm },
    { label: "Running", mi: runDistanceMi,  km: runDistanceKm  },
  ];

 return (
  <div>
    <table style={{ borderCollapse: 'collapse', marginBottom: '1rem', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', paddingRight: '2rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Sport</th>
          <th style={{ textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'normal' }}>Distance ({unitLabel})</th>
        </tr>
      </thead>
      <tbody>
        {sports.map(({ label, mi, km }) => (
          <tr key={label}>
            <td style={{ paddingRight: '2rem', paddingBottom: '0.3rem', fontWeight: 'bold' }}>{label}</td>
            <td style={{ paddingBottom: '0.3rem', color: 'var(--text-normal)' }}>{getDistance(mi, km)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={toggleUnit} className="btn">Change Unit</button>
  </div>
);
};

export default TriathlonStats;