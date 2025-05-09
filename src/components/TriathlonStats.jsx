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
      background: color,
      padding: '0.5rem 0.8rem',
      borderRadius: '1rem', 
      border: 'solid',
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ffffff',
      fontSize: '1.5rem',
      textAlign: 'center',
      minWidth: '8rem', 
      minHeight: '4rem', 
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        {value ?? '–'}
      </div>
      <div>{label}</div>
    </div>
  );
  

  // Helper to format the number + unit nicely
  const getFormattedValue = (distanceMi, distanceKm) => {
    if (unit === "miles") {
      return (<>{formatNumber(distanceMi)}<br />mi</>);
    } else if (unit === "km") {
      return (<>{formatNumber(distanceKm)}<br />km</>);
    } else if (unit === "fields") {
      return (<>{formatNumber(convertToFields(distanceKm * 1000))}<br />🏈</>);
    } else {
      return (<>{convertToMoonPercentage(distanceKm)}<br />🚀</>);
    }
  };

  return (
    <div style={{ padding: '0rem', borderRadius: '1rem', position: 'relative' }}>
      {/* Orange Background */}
      <div style={{
        backgroundColor: '#ff7032',
        padding: '2rem',
        borderRadius: '1rem',
        position: 'relative',
      }}>
      <div style={{ marginBottom: '2rem', textAlign: 'left', color: "#ffffff" }}>
  <p>
    In <strong>{new Date().getFullYear()}</strong>, I’ve covered the following distances*{" "}
    <span style={{
      backgroundColor: "#0099cc",
      padding: "0.2rem 0.4rem",
      borderRadius: "0.5rem"
    }}>swimming 🏊</span>,{" "}
    <span style={{
      backgroundColor: "#41ab5d",
      padding: "0.2rem 0.4rem",
      borderRadius: "0.5rem"
    }}>biking 🚴‍♂️</span>, and{" "}
    <span style={{
      backgroundColor: "#ffaa00",
      padding: "0.2rem 0.4rem",
      borderRadius: "0.5rem"
    }}>running 🏃‍♂️</span>:
  </p>
</div>

        {/* Stats Cards */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '-0.5rem',
          }}>
          {formatCard('🏊', getFormattedValue(swimDistanceMi, swimDistanceKm), '#0099cc')}
          {formatCard('🚴‍♂️', getFormattedValue(rideDistanceMi, rideDistanceKm), '#41ab5d')}
          {formatCard('🏃‍♂️', getFormattedValue(runDistanceMi, runDistanceKm), '#ffaa00')}
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}> 
          <span style={{
            fontFamily: "monospace",
            border: 'solid',
            backgroundColor: '#ffffff',
            borderColor: '#ffffff',
            color: "#ff7032",
            fontSize: '1.2rem',
            fontWeight: 'bold',
            padding: "0.2rem 0.4rem",
            borderRadius: "1rem",
            display: 'inline-block'
          }}>
            {unit === "miles" ? "miles" :
            unit === "km" ? "kilometers" :
            unit === "fields" ? "American football fields 🏈" :
            "% distance to the Moon 🚀"}
          </span>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button onClick={toggleUnit} className="btn">Change Unit of Measure</button>
        </div>

        {/* Relative Distance Bar */}
        <div style={{
          marginTop: '2rem',
          height: '2rem',
          width: '100%',
          border: 'solid',
          borderColor: '#ffffff',
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: 'transparent',
          borderRadius: '1rem',
        }}> 
           <div style={{
            width: `${runPercent}%`,
            backgroundColor: '#ffaa00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🏃‍♂️
          </div>
          <div style={{
            width: `${ridePercent}%`,
            backgroundColor: '#41ab5d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🚴‍♂️
          </div>
            <div style={{
            width: `${swimPercent}%`,
            backgroundColor: '#0099cc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🏊
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriathlonStats;
