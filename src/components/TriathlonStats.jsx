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

  const formatNumber = (num) => num.toLocaleString(); // Add commas for readability

  const convertToFields = (distanceMeters) => Math.round(distanceMeters / 91.44); // Convert meters to football fields
  const convertToYards = (distanceMeters) => Math.round(distanceMeters * 1.09361); // Convert meters to yards

  return (
    <div>
      <p>During my triathlon training* in <strong>{new Date().getFullYear()}</strong>, I've gone a total of:</p>
      
      {!error && (
        <p style={{ paddingLeft: '3rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#00dbff' }}>
              <strong>🏊</strong> {unit === "miles" ? <strong>{formatNumber(data.swimDistance)}</strong> + " " : 
                unit === "km" ? <strong>{formatNumber(data.swimDistanceKm)}</strong> + " kilometers " : 
                unit === "yards" ? <strong>{formatNumber(convertToYards(data.swimDistanceKm * 1000))}</strong> + " yards " : 
                <strong>{formatNumber(convertToFields(data.swimDistanceKm * 1000))}</strong> + " football fields🏈 "} 
              swimming
            </span><br />

            <span style={{ fontSize: '1.5rem', color: '#41ab5d' }}>
              <strong>🚴</strong> {unit === "miles" ? <strong>{formatNumber(data.rideDistance)}</strong> + " " : 
                unit === "km" ? <strong>{formatNumber(data.rideDistanceKm)}</strong> + " kilometers " : 
                unit === "yards" ? <strong>{formatNumber(convertToYards(data.rideDistanceKm * 1000))}</strong> + " yards " : 
                <strong>{formatNumber(convertToFields(data.rideDistanceKm * 1000))}</strong> + " football fields🏈 "} 
              biking
            </span><br />

            <span style={{ fontSize: '1.5rem', color: '#ffaa00' }}>
              <strong>🏃‍♂️</strong> {unit === "miles" ? <strong>{formatNumber(data.runDistance)}</strong> + " " : 
                unit === "km" ? <strong>{formatNumber(data.runDistanceKm)}</strong> + " kilometers " : 
                unit === "yards" ? <strong>{formatNumber(convertToYards(data.runDistanceKm * 1000))}</strong> + " yards " : 
                <strong>{formatNumber(convertToFields(data.runDistanceKm * 1000))}</strong> + " football fields🏈 "} 
              running
            </span>
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