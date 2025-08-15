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

  const formatNumber = (num) => String(num);

  const convertToFields = (distanceMeters) => Math.round(distanceMeters / 91.44);

  const convertToMoonPercentage = (distanceKm) => {
    return `${((distanceKm / 384400) * 100).toFixed(2)}%`;
  };

  const swimDistanceKm = data?.swimDistanceKm || 9999;
  const rideDistanceKm = data?.rideDistanceKm || 9999;
  const runDistanceKm = data?.runDistanceKm || 9999;

  const swimDistanceMi = data?.swimDistance || 9999;
  const rideDistanceMi = data?.rideDistance || 9999;
  const runDistanceMi = data?.runDistance || 9999;

  const totalDistance = swimDistanceKm + rideDistanceKm + runDistanceKm;
  const swimPercent = totalDistance ? (swimDistanceKm / totalDistance) * 100 : 0;
  const ridePercent = totalDistance ? (rideDistanceKm / totalDistance) * 100 : 0;
  const runPercent = totalDistance ? (runDistanceKm / totalDistance) * 100 : 0;

  const formatCard = (label, value, color, isLast) => (
    <div style={{
      color: color,
      padding: '0rem 1rem 0rem 0rem',
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      textAlign: 'left',
      borderRight: isLast ? 'none' : '1px solid #d9d9d9',
    }}>
      <div style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        {value ?? '–'}
      </div>
    </div>
  );
  
  // Helper to format the number + unit nicely
  const getFormattedValue = (distanceMi, distanceKm) => {
    if (unit === "miles") {
      return (<>{formatNumber(distanceMi)}<br /></>);
    } else if (unit === "km") {
      return (<>{formatNumber(distanceKm)}<br /></>);
    } else if (unit === "fields") {
      return (<>{formatNumber(convertToFields(distanceKm * 1000))}<br /></>);
    } else {
      return (<>{convertToMoonPercentage(distanceKm)}<br /></>);
    }
  };

  return (
    <div style={{position: 'relative' }}>
      <div style={{
        padding: '1rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
        position: 'relative',
      }}>
      <div style={{textAlign: 'left', color: "#000000" }}>
 
    </div>

        {/* Stats Cards */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'left',
          gap: '1rem',
          }}>
          {formatCard('Swimming', getFormattedValue(swimDistanceMi, swimDistanceKm), '#3399ff', false)}
          {formatCard('Biking', getFormattedValue(rideDistanceMi, rideDistanceKm), '#33cc33', false)}
          {formatCard('Running', getFormattedValue(runDistanceMi, runDistanceKm), '#ff9900', true)}
        </div>

        <div style={{ marginTop: '0.5rem', textAlign: 'left' }}> 
          <span style={{
            padding: "0.2rem 0rem",
            display: 'inline-block'
          }}>
            {unit === "miles" ? "miles" :
            unit === "km" ? "kilometers" :
            unit === "fields" ? "American football fields" :
            "of the distance from Earth to the Moon"}
          </span>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'left' }}>
          <button onClick={toggleUnit} className="btn">Change Unit of Measure</button>
        </div>

      </div>
    </div>
  );
};

export default TriathlonStats;
