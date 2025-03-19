import { useState } from 'preact/hooks';

const TriathlonStats = ({ data, error }) => {
  const [unit, setUnit] = useState("miles"); // Default to miles

  const toggleUnit = () => {
    setUnit(prevUnit => (prevUnit === "miles" ? "km" : "miles"));
  };

  return (
    <div>
      <p>During my triathlon training* in <strong>{new Date().getFullYear()}</strong>, I've gone a total of:</p>
      
      {!error && (
        <p style={{ paddingLeft: '3rem' }}>
          <strong style={{ fontSize: '1.5rem', color: '#00dbff' }}>🏊 {unit === "miles" ? data.swimDistance : `${data.swimDistanceKm} km`}</strong> swimming <br />

          <strong style={{ fontSize: '1.5rem', color: '#41ab5d' }}>🚴 {unit === "miles" ? data.rideDistance : `${data.rideDistanceKm} km`}</strong> biking<br />

          <strong style={{ fontSize: '1.5rem', color: '#ffaa00' }}>🏃‍♂️ {unit === "miles" ? data.runDistance : `${data.runDistanceKm} km`}</strong> running
        </p>
      )}

      <button 
        onClick={toggleUnit} 
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "1rem", cursor: "pointer" }}
      >
        Switch to {unit === "miles" ? "Kilometers" : "Miles"}
      </button>
    </div>
  );
};

export default TriathlonStats;