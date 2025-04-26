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

  const swimDistanceKm = data?.swimDistanceKm || 10;
  const rideDistanceKm = data?.rideDistanceKm || 10;
  const runDistanceKm = data?.runDistanceKm || 10;

  const swimDistanceMi = data?.swimDistance || 10;
  const rideDistanceMi = data?.rideDistance || 10;
  const runDistanceMi = data?.runDistance || 10;

  const totalDistance = swimDistanceKm + rideDistanceKm + runDistanceKm;
  const swimPercent = totalDistance ? (swimDistanceKm / totalDistance) * 100 : 0;
  const ridePercent = totalDistance ? (rideDistanceKm / totalDistance) * 100 : 0;
  const runPercent = totalDistance ? (runDistanceKm / totalDistance) * 100 : 0;

  const formatCard = (label, value, color) => (
    <div style={{
      background: color,
      padding: '1rem',
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '2rem' }}>
        {value ?? '–'}
      </div>
      <div>{label}</div>
    </div>
  );

  return (
    <div style={{ padding: '0rem', borderRadius: '1rem', position: 'relative' }}>
      {/* Normal Text Area */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p>
          As of {new Date().getFullYear()}, I’ve covered the following distances swimming, biking, and running in<br />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{
              fontFamily: "monospace",
              backgroundColor: "rgba(255, 112, 50, 1)",
              color: "black",
              fontSize: '1.2rem',
              fontWeight: 'bold',
              padding: "0.2rem 0.4rem",
              borderRadius: "0.3rem",
              display: 'inline-block'
            }}>
              {unit === "miles" ? "miles" :
               unit === "km" ? "kilometers" :
               unit === "fields" ? "American football fields 🏈" :
               "% of the distance to the Moon 🚀"}
            </span>
          </div>
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          <button onClick={toggleUnit} className="btn">Change Unit</button>
        </div>
      </div>

{/* Orange Background */}
<div style={{
  backgroundColor: '#ff7032', 
  padding: '2rem',
  borderRadius: '1rem',
  position: 'relative',
}}>


        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          {formatCard(
            'swimming 🏊',
            unit === "miles" ? formatNumber(swimDistanceMi) :
            unit === "km" ? formatNumber(swimDistanceKm) + " km" :
            unit === "fields" ? formatNumber(convertToFields(swimDistanceKm * 1000)) + " 🏈" :
            convertToMoonPercentage(swimDistanceKm) + " 🚀",
            '#0099cc'
          )}

          {formatCard(
            'biking 🚴',
            unit === "miles" ? formatNumber(rideDistanceMi) :
            unit === "km" ? formatNumber(rideDistanceKm) + " km" :
            unit === "fields" ? formatNumber(convertToFields(rideDistanceKm * 1000)) + " 🏈" :
            convertToMoonPercentage(rideDistanceKm) + " 🚀",
            '#41ab5d'
          )}

          {formatCard(
            'running 🏃‍♂️',
            unit === "miles" ? formatNumber(runDistanceMi) :
            unit === "km" ? formatNumber(runDistanceKm) + " km" :
            unit === "fields" ? formatNumber(convertToFields(runDistanceKm * 1000)) + " 🏈" :
            convertToMoonPercentage(runDistanceKm) + " 🚀",
            '#ffaa00'
          )}
        </div>

        {/* Relative Bar */}
        <div style={{
          marginTop: '2rem',
          height: '2rem',
          width: '100%',
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: 'transparent',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            width: `${runPercent}%`,
            backgroundColor: '#ffaa00',
            position: 'relative',
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
            🚴
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
