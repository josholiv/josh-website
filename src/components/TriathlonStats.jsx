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

  const formatCard = (label, value, color) => (
    <div style={{
      color: color,
      padding: '0.2rem 0.5rem',
      borderRadius: '5px', 
      border: '2px solid',
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      fontSize: '1.5rem',
      textAlign: 'left',
      minWidth: '8rem', 
      minHeight: '4rem', 
    }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>
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
    <div style={{ padding: '0rem', borderRadius: '1rem', position: 'relative' }}>
      <div style={{
        padding: '0rem',
        position: 'relative',
      }}>
      <div style={{ marginBottom: '2rem', textAlign: 'left', color: "#000000" }}>
  <p>
    In <strong>{new Date().getFullYear()}</strong>, I’ve covered the following distances*{" "}
    <span style={{
      backgroundColor: "#3399ff",
      padding: "0.2rem 0.4rem",
      borderRadius: "5px"
    }}>swimming</span>,{" "}
    <span style={{
      backgroundColor: "#33cc33",
      padding: "0.2rem 0.4rem",
      borderRadius: "5px"
    }}>biking</span>, and{" "}
    <span style={{
      backgroundColor: "#ff9900",
      padding: "0.2rem 0.4rem",
      borderRadius: "5px"
    }}>running</span>:
  </p>
</div>

        {/* Stats Cards */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'left',
          gap: '1rem',
          marginTop: '-0.5rem',
          }}>
          {formatCard('Swimming', getFormattedValue(swimDistanceMi, swimDistanceKm), '#3399ff')}
          {formatCard('Biking', getFormattedValue(rideDistanceMi, rideDistanceKm), '#33cc33')}
          {formatCard('Running', getFormattedValue(runDistanceMi, runDistanceKm), '#ff9900')}
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'left' }}> 
          <span style={{
            fontFamily: "monospace",
            fontSize: '1rem',
            fontWeight: 'bold',
            padding: "0.2rem 0.4rem",
            display: 'inline-block'
          }}>
            {unit === "miles" ? "miles" :
            unit === "km" ? "kilometers" :
            unit === "fields" ? "American football fields" :
            "% distance to the Moon"}
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
