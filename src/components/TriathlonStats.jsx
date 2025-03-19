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

  const formatNumber = (num) => num.toLocaleString(); // Add commas for readability

  const convertToFields = (distanceMeters) => Math.round(distanceMeters / 91.44); // Convert meters to football fields
  const convertToYards = (distanceMeters) => Math.round(distanceMeters * 1.09361); // Convert meters to yards

  return (
    <div>
      <p>During my triathlon training* in <strong>{new Date().getFullYear()}</strong>, I've gone a total of:</p>
      
      {!error && (
        <p style={{ paddingLeft: '3rem' }}>
            <strong style={{ fontSize: '1.5rem', color: '#00dbff' }}>
              <span style={{ fontWeight: 'bold' }}>🏊 {unit === "miles" ? formatNumber(data.swimDistance) + " " : 
                unit === "km" ? `${formatNumber(data.swimDistanceKm)} kilometers ` : 
                unit === "yards" ? `${formatNumber(convertToYards(data.swimDistanceKm * 1000))} yards ` : 
                `${formatNumber(convertToFields(data.swimDistanceKm * 1000))} football fields🏈 `}
              </span>
            </strong>
            <span>{unit === "miles" ? "miles" : 
                unit === "km" ? "km" : 
                unit === "yards" ? "yards" : "football fields"}</span>
            swimming<br />

            <strong style={{ fontSize: '1.5rem', color: '#41ab5d' }}>
              <span style={{ fontWeight: 'bold' }}>🚴 {unit === "miles" ? formatNumber(data.rideDistance) + " " : 
                unit === "km" ? `${formatNumber(data.rideDistanceKm)} kilometers ` : 
                unit === "yards" ? `${formatNumber(convertToYards(data.rideDistanceKm * 1000))} yards ` : 
                `${formatNumber(convertToFields(data.rideDistanceKm * 1000))} football fields🏈 `}
              </span>
            </strong>
            <span>{unit === "miles" ? "miles" : 
                unit === "km" ? "km" : 
                unit === "yards" ? "yards" : "football fields"}</span>
            biking<br />

            <strong style={{ fontSize: '1.5rem', color: '#ffaa00' }}>
              <span style={{ fontWeight: 'bold' }}>🏃‍♂️ {unit === "miles" ? formatNumber(data.runDistance) + " " : 
                unit === "km" ? `${formatNumber(data.runDistanceKm)} kilometers ` : 
                unit === "yards" ? `${formatNumber(convertToYards(data.runDistanceKm * 1000))} yards ` : 
                `${formatNumber(convertToFields(data.runDistanceKm * 1000))} football fields🏈 `}
              </span>
            </strong>
            <span>{unit === "miles" ? "miles" : 
                unit === "km" ? "km" : 
                unit === "yards" ? "yards" : "football fields"}</span>
            running
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