import { useState } from 'preact/hooks';

const TriathlonStats = ({ data, error }) => {
  const units = ["miles", "km", "yards", "fields"]; // Added yards and football fields
  const [unit, setUnit] = useState("miles");

  const toggleUnit = () => {
    setUnit(prevUnit => {
      const currentIndex = units.indexOf(prevUnit);
      return units[(currentIndex + 1) % units.length]; // Cycle through units
    });
  };

  const convertToFields = (distanceMeters) => Math.round(distanceMeters / 91.44); // Convert meters to football fields
  const convertToYards = (distanceMeters) => Math.round(distanceMeters * 1.09361); // Convert meters to yards

  return (
    <div>
      <p>During my triathlon training* in <strong>{new Date().getFullYear()}</strong>, I've gone a total of:</p>
      
      {!error && (
        <p style={{ paddingLeft: '3rem' }}>
          <strong style={{ fontSize: '1.5rem', color: '#00dbff' }}>
            🏊 {unit === "miles" ? data.swimDistance : 
                unit === "km" ? `${data.swimDistanceKm} km` : 
                unit === "yards" ? `${convertToYards(data.swimDistanceKm * 1000)} yards` : 
                `${convertToFields(data.swimDistanceKm * 1000)} fields`}
          </strong> swimming <br />

          <strong style={{ fontSize: '1.5rem', color: '#41ab5d' }}>
            🚴 {unit === "miles" ? data.rideDistance : 
                unit === "km" ? `${data.rideDistanceKm} km` : 
                unit === "yards" ? `${convertToYards(data.rideDistanceKm * 1000)} yards` : 
                `${convertToFields(data.rideDistanceKm * 1000)} fields`}
          </strong> biking<br />

          <strong style={{ fontSize: '1.5rem', color: '#ffaa00' }}>
            🏃‍♂️ {unit === "miles" ? data.runDistance : 
                unit === "km" ? `${data.runDistanceKm} km` : 
                unit === "yards" ? `${convertToYards(data.runDistanceKm * 1000)} yards` : 
                `${convertToFields(data.runDistanceKm * 1000)} fields`}
          </strong> running
        </p>
      )}

      <button 
        onClick={toggleUnit} 
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "1rem", cursor: "pointer" }}
      >
        Change Distance Unit
      </button>
    </div>
  );
};

export default TriathlonStats;
