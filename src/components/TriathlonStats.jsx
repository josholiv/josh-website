import { useState } from 'preact/hooks';

const TriathlonStats = ({ data, error }) => {
  const units = ["miles", "km", "yards", "fields", "moon%"];
  const [unit, setUnit] = useState("miles");

  const toggleUnit = () => {
    setUnit(prevUnit => {
      const currentIndex = units.indexOf(prevUnit);
      return units[(currentIndex + 1) % units.length];
    });
  };

  const formatNumber = (num) => num.toLocaleString();
  const convertToFields = (distanceMeters) => Math.round(distanceMeters / 91.44);
  const convertToYards = (distanceMeters) => Math.round(distanceMeters * 1.09361);
  const convertToMoonPercentage = (distanceKm) => ((distanceKm / 384400) * 100).toFixed(6); // Percentage of the distance to the Moon

  return (
    <div>
      <p>During my triathlon training* in <strong>{new Date().getFullYear()}</strong>, I've gone a total of</p>
      {!error && (
        <p style={{ paddingLeft: '0rem' }}>
          <strong style={{ fontSize: '1.5rem', color: '#00dbff' }}>
            🏊 {unit === "miles" ? formatNumber(data.swimDistance) + " " : 
                unit === "km" ? `${formatNumber(data.swimDistanceKm)} kilometers ` : 
                unit === "yards" ? `${formatNumber(convertToYards(data.swimDistanceKm * 1000))} yards ` : 
                unit === "fields" ? `${formatNumber(convertToFields(data.swimDistanceKm * 1000))} football fields🏈 ` :
                `${convertToMoonPercentage(data.swimDistanceKm)}% of the distance from Earth🌎 to the Moon🌕`} 
          </strong> swimming<br />

          <strong style={{ fontSize: '1.5rem', color: '#41ab5d' }}>
            🚴 {unit === "miles" ? formatNumber(data.rideDistance) + " " : 
                unit === "km" ? `${formatNumber(data.rideDistanceKm)} kilometers ` : 
                unit === "yards" ? `${formatNumber(convertToYards(data.rideDistanceKm * 1000))} yards ` : 
                unit === "fields" ? `${formatNumber(convertToFields(data.rideDistanceKm * 1000))} football fields🏈 ` :
                `${convertToMoonPercentage(data.rideDistanceKm)}% of the distance from Earth🌎 to the Moon🌕`} 
          </strong> biking<br />

          <strong style={{ fontSize: '1.5rem', color: '#ffaa00' }}>
            🏃‍♂️ {unit === "miles" ? formatNumber(data.runDistance) + " " : 
                unit === "km" ? `${formatNumber(data.runDistanceKm)} kilometers ` : 
                unit === "yards" ? `${formatNumber(convertToYards(data.runDistanceKm * 1000))} yards ` : 
                unit === "fields" ? `${formatNumber(convertToFields(data.runDistanceKm * 1000))} football fields🏈 ` :
                `${convertToMoonPercentage(data.runDistanceKm)}% of the distance from Earth🌎 to the Moon🌕`} 
          </strong> running
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={toggleUnit} className="btn">Change Distance Unit</button>
      </div>
    </div>
    
  );
};

export default TriathlonStats;
