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
  const convertToMoonPercentage = (distanceKm) => ((distanceKm / 384400) * 100).toFixed(6);

  // Prevent error by checking if `data` exists before performing calculations
  const swimDistanceKm = data?.swimDistanceKm || 0;
  const rideDistanceKm = data?.rideDistanceKm || 0;
  const runDistanceKm = data?.runDistanceKm || 0;

  const totalDistance = swimDistanceKm + rideDistanceKm + runDistanceKm;
  const swimPercent = totalDistance ? (swimDistanceKm / totalDistance) * 100 : 0;
  const ridePercent = totalDistance ? (rideDistanceKm / totalDistance) * 100 : 0;
  const runPercent = totalDistance ? (runDistanceKm / totalDistance) * 100 : 0;

  return (
    <div>
      <p>During my triathlon training* in <strong>{new Date().getFullYear()}</strong>, I've gone a total of</p>
      {!error && (
        <p style={{ paddingLeft: '0rem' }}>
          <strong style={{ fontSize: '1.5rem', color: '#00dbff' }}>
            🏊 {unit === "miles" ? formatNumber(data.swimDistance) + " " : 
                unit === "km" ? `${formatNumber(swimDistanceKm)} kilometers ` : 
                unit === "yards" ? `${formatNumber(convertToYards(swimDistanceKm * 1000))} yards ` : 
                unit === "fields" ? `${formatNumber(convertToFields(swimDistanceKm * 1000))} football fields🏈 ` :
                `${convertToMoonPercentage(swimDistanceKm)}% of the distance from Earth🌎 to the Moon🌕`} 
          </strong> swimming<br />

          <strong style={{ fontSize: '1.5rem', color: '#41ab5d' }}>
            🚴 {unit === "miles" ? formatNumber(data.rideDistance) + " " : 
                unit === "km" ? `${formatNumber(rideDistanceKm)} kilometers ` : 
                unit === "yards" ? `${formatNumber(convertToYards(rideDistanceKm * 1000))} yards ` : 
                unit === "fields" ? `${formatNumber(convertToFields(rideDistanceKm * 1000))} football fields🏈 ` :
                `${convertToMoonPercentage(rideDistanceKm)}% of the distance from Earth🌎 to the Moon🌕`} 
          </strong> biking<br />

          <strong style={{ fontSize: '1.5rem', color: '#ffaa00' }}>
            🏃‍♂️ {unit === "miles" ? formatNumber(data.runDistance) + " " : 
                unit === "km" ? `${formatNumber(runDistanceKm)} kilometers ` : 
                unit === "yards" ? `${formatNumber(convertToYards(runDistanceKm * 1000))} yards ` : 
                unit === "fields" ? `${formatNumber(convertToFields(runDistanceKm * 1000))} football fields🏈 ` :
                `${convertToMoonPercentage(runDistanceKm)}% of the distance from Earth🌎 to the Moon🌕`} 
          </strong> running
        </p>
      )}
      
      {/* Relative Distance Bar */}
      <div style={{
        marginTop: '1rem',
        height: '3rem',  // Adjusted height to make the bar a bit taller
        width: '100%',
        display: 'flex',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #f0f0f0',
        backgroundColor: '#f0f0f0' // Light background for visibility
      }}>
        <div style={{ width: `${swimPercent}%`, backgroundColor: '#00dbff', position: 'relative' }}>
          <span style={{
            position: 'absolute',
            top: '-2rem', // Moves emoji above the bar
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '3rem',  // Increased font size for the emojis
            zIndex: 1          // Ensures the emoji is on top
          }}>🏊</span>
        </div>
        <div style={{ width: `${ridePercent}%`, backgroundColor: '#41ab5d', position: 'relative' }}>
          <span style={{
            position: 'absolute',
            top: '-2rem', // Moves emoji above the bar
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '3rem',  // Increased font size for the emojis
            zIndex: 1          // Ensures the emoji is on top
          }}>🚴</span>
        </div>
        <div style={{ width: `${runPercent}%`, backgroundColor: '#ffaa00', position: 'relative' }}>
          <span style={{
            position: 'absolute',
            top: '-2rem', // Moves emoji above the bar
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '3rem',  // Increased font size for the emojis
            zIndex: 1          // Ensures the emoji is on top
          }}>🏃‍♂️</span>
        </div>
      </div>
      
      {/* Change Unit Button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: '1rem' }}>
        <button onClick={toggleUnit} className="btn">Change Distance Unit</button>
      </div>
    </div>
  );
};

export default TriathlonStats;
