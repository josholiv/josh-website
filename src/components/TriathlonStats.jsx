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
    <h3>During my triathlon training* in <strong>{new Date().getFullYear()}</strong>, I've gone:</h3>
    {!error && (
      <p style={{ paddingLeft: '2rem', paddingBottom: "2rem", lineHeight: "3rem" }}>
        <strong style={{ fontSize: '2rem', color: '#0099cc' }}>
          {unit === "miles" ? formatNumber(data.swimDistance) + " " : 
           unit === "km" ? `${formatNumber(swimDistanceKm)} kilometers `  : 
           unit === "yards" ? `${formatNumber(convertToYards(swimDistanceKm * 1000))} yards `  : 
           unit === "fields" ? `${formatNumber(convertToFields(swimDistanceKm * 1000))} American football fields` :
           `${convertToMoonPercentage(swimDistanceKm)}% of the distance from Earth 🌎 to the Moon 🌕`}
        </strong>
        swimming 🏊<br />
  
        <strong style={{ fontSize: '2rem', color: '#41ab5d' }}>
          {unit === "miles" ? formatNumber(data.rideDistance) + " " : 
           unit === "km" ? `${formatNumber(rideDistanceKm)} kilometers ` : 
           unit === "yards" ? `${formatNumber(convertToYards(rideDistanceKm * 1000))} yards ` : 
           unit === "fields" ? `${formatNumber(convertToFields(rideDistanceKm * 1000))} American football fields` :
           `${convertToMoonPercentage(rideDistanceKm)}% of the distance from Earth 🌎 to the Moon 🌕`}
        </strong>
        biking 🚴<br />
  
        <strong style={{ fontSize: '2rem', color: '#ffaa00' }}>
          {unit === "miles" ? formatNumber(data.runDistance) + " " : 
           unit === "km" ? `${formatNumber(runDistanceKm)} kilometers ` : 
           unit === "yards" ? `${formatNumber(convertToYards(runDistanceKm * 1000))} yards ` : 
           unit === "fields" ? `${formatNumber(convertToFields(runDistanceKm * 1000))} American football fields` :
           `${convertToMoonPercentage(runDistanceKm)}% of the distance from Earth 🌎 to the Moon 🌕`}
        </strong>
        running 🏃‍♂️
      </p>
      )}
      
     {/* Relative Distance Bar */}
        <div style={{
          marginTop: '1rem',
          height: '3rem',
          width: '100%',
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: 'transparent',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingTop: '1.5rem',  
          paddingBottom: '0rem' 
        }}>
          <div style={{
            width: `${swimPercent}%`,
            // width: '10%', // dummy data for testing
            backgroundColor: '#0099cc',
            position: 'relative',
            borderTopLeftRadius: '0.5rem',  // Rounded left edge
            borderBottomLeftRadius: '.5rem'
          }}>
            <span style={{
              position: 'absolute',
              top: '0%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '1.5rem',
              zIndex: 1  
            }}>🏊</span>
          </div>
          <div style={{
            width: `${ridePercent}%`,
            // width: '60%', // dummy data for testing
            backgroundColor: '#41ab5d',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              top: '0%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '1.5rem',
              zIndex: 1    
            }}>🚴</span>
          </div>
          <div style={{
            width: `${runPercent}%`,
            // width: '30%', // dummy data for testing
            backgroundColor: '#ffaa00',
            position: 'relative',
            borderTopRightRadius: '0.5rem',  // Rounded right edge
            borderBottomRightRadius: '0.5rem'
          }}>
            <span style={{
              position: 'absolute',
              top: '0%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '1.5rem',
              zIndex: 1   
            }}>🏃‍♂️</span>
          </div>
        </div>
        
      {/* Change Unit Button */}
      <div style={{ display: "flex", justifyContent: "left", marginTop: '1rem' }}>
        <button onClick={toggleUnit} className="btn">Change Distance Unit</button>
      </div>
    </div>
  );
};

export default TriathlonStats;
