import { useState } from 'preact/hooks';

const TriathlonStats = ({ data, error }) => {
  const units = ["miles", "km", "yards", "fields"];
  const [unit, setUnit] = useState("miles");

  const toggleUnit = () => {
    setUnit(prevUnit => {
      const currentIndex = units.indexOf(prevUnit);
      return units[(currentIndex + 1) % units.length]; // Cycle through units
    });
  };

  const formatNumber = (num) => num.toLocaleString();

  const convertToFields = (distanceMeters) => Math.round(distanceMeters / 91.44); // Convert meters to football fields
  const convertToYards = (distanceMeters) => Math.round(distanceMeters * 1.09361); // Convert meters to yards

  return (
    <div>
      <p style={{ textAlign: 'center' }}>
        During my triathlon training* in <strong>{new Date().getFullYear()}</strong>, I've gone a total of:
      </p>

      {!error && (
        <p style={{ textAlign: 'center', paddingLeft: '3rem' }}>
          <strong style={{ fontSize: '1.5rem', color: '#00dbff' }}>
            🏊 {unit === "miles" ? formatNumber(data.swimDistance) : 
                unit === "km" ? `${formatNumber(data.swimDistanceKm)} kilometers` : 
                unit === "yards" ? `${formatNumber(convertToYards(data.swimDistanceKm * 1000))} yards` : 
                `${formatNumber(convertToFields(data.swimDistanceKm * 1000))} football fields`} 
            swimming
          </strong><br />

          <strong style={{ fontSize: '1.5rem', color: '#41ab5d' }}>
            🚴 {unit === "miles" ? formatNumber(data.rideDistance) : 
                unit === "km" ? `${formatNumber(data.rideDistanceKm)} kilometers` : 
                unit === "yards" ? `${formatNumber(convertToYards(data.rideDistanceKm * 1000))} yards` : 
                `${formatNumber(convertToFields(data.rideDistanceKm * 1000))} football fields`} 
            biking
          </strong><br />

          <strong style={{ fontSize: '1.5rem', color: '#ffaa00' }}>
            🏃‍♂️ {unit === "miles" ? formatNumber(data.runDistance) : 
                unit === "km" ? `${formatNumber(data.runDistanceKm)} kilometers` : 
                unit === "yards" ? `${formatNumber(convertToYards(data.runDistanceKm * 1000))} yards` : 
                `${formatNumber(convertToFields(data.runDistanceKm * 1000))} football fields`} 
            running
          </strong>
        </p>
      )}

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={toggleUnit} 
          style={{ 
            marginTop: "1rem", 
            padding: "0.5rem 1rem", 
            fontSize: "1rem", 
            cursor: "pointer" 
          }}
        >
          Change Distance Unit
        </button>
      </div>
    </div>
  );
};

export default TriathlonStats;
