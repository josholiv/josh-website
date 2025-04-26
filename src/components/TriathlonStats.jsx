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
  const convertToMoonPercentage = (distanceKm) => ((distanceKm / 384400) * 100).toFixed(2);

  // Prevent error by checking if `data` exists before performing calculations
  const swimDistanceKm = data?.swimDistanceKm || 10;
  const rideDistanceKm = data?.rideDistanceKm || 10;
  const runDistanceKm = data?.runDistanceKm || 10;

  const totalDistance = swimDistanceKm + rideDistanceKm + runDistanceKm;
  const swimPercent = totalDistance ? (swimDistanceKm / totalDistance) * 100 : 0;
  const ridePercent = totalDistance ? (rideDistanceKm / totalDistance) * 100 : 0;
  const runPercent = totalDistance ? (runDistanceKm / totalDistance) * 100 : 0;

  const formatCard = (label, value, color) => (
    <p>
      <span style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '0.5rem 1rem',
        borderRadius: '1rem',
        display: 'inline-block',
        color: color || '#fff',
      }}>
        <strong style={{ fontSize: '2rem' }}>{value ?? '–'}</strong><br />
        {label}
      </span>
    </p>
  );

  return (
    <div>
      <p>
        During my triathlon training in {new Date().getFullYear()}, I’ve gone the following number of{" "}
        <span style={{
          fontFamily: "monospace",
          backgroundColor: "#d9d9d9",
          color: "black",
          padding: "0.2rem 0.4rem",
          borderRadius: "0.3rem"
        }}>
          {unit === "miles" ? "miles" :
           unit === "km" ? "kilometers" :
           unit === "yards" ? "yards" :
           unit === "fields" ? "American football fields" :
           "% of the distance from Earth to the Moon"}
        </span>{" "}
        swimming, biking, and running:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {formatCard('Swimming 🏊', unit === "miles" ? formatNumber(data.swimDistance) : 
            unit === "km" ? `${formatNumber(swimDistanceKm)}` :
            unit === "yards" ? `${formatNumber(convertToYards(swimDistanceKm * 1000))}` :
            unit === "fields" ? `${formatNumber(convertToFields(swimDistanceKm * 1000))}` :
            `${convertToMoonPercentage(swimDistanceKm)}%`, '#0099cc')}
          
          {formatCard('Biking 🚴', unit === "miles" ? formatNumber(data.rideDistance) : 
            unit === "km" ? `${formatNumber(rideDistanceKm)}` :
            unit === "yards" ? `${formatNumber(convertToYards(rideDistanceKm * 1000))}` :
            unit === "fields" ? `${formatNumber(convertToFields(rideDistanceKm * 1000))}` :
            `${convertToMoonPercentage(rideDistanceKm)}%`, '#41ab5d')}
          
          {formatCard('Running 🏃‍♂️', unit === "miles" ? formatNumber(data.runDistance) : 
            unit === "km" ? `${formatNumber(runDistanceKm)}` :
            unit === "yards" ? `${formatNumber(convertToYards(runDistanceKm * 1000))}` :
            unit === "fields" ? `${formatNumber(convertToFields(runDistanceKm * 1000))}` :
            `${convertToMoonPercentage(runDistanceKm)}%`, '#ffaa00')}
        </div>

        {/* Change Unit Button */}
        <div style={{ display: "flex", justifyContent: "left", marginTop: '1rem' }}>
          <button onClick={toggleUnit} className="btn">Change Distance Unit</button>
        </div>

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
            width: `${runPercent}%`,
            backgroundColor: '#ffaa00',
            position: 'relative',
            borderTopLeftRadius: '0.5rem', 
            borderBottomLeftRadius: '0.5rem'
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

          <div style={{
            width: `${ridePercent}%`,
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
            width: `${swimPercent}%`,
            backgroundColor: '#0099cc',
            position: 'relative',
            borderTopRightRadius: '0.5rem',  
            borderBottomRightRadius: '.5rem'
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
        </div>
      </div>
    </div>
  );
};

export default TriathlonStats;
