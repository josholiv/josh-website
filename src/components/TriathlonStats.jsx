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

  const swimDistanceKm = data?.swimDistanceKm || 9999;
  const rideDistanceKm = data?.rideDistanceKm || 9999;
  const runDistanceKm = data?.runDistanceKm || 9999;

  const swimDistanceMi = data?.swimDistance || 9999;
  const rideDistanceMi = data?.rideDistance || 9999;
  const runDistanceMi = data?.runDistance || 9999;

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
      fontSize: '1rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        {value ?? '–'}
      </div>
      <div>{label}</div>
    </div>
  );

  return (
    <div style={{ padding: '0rem', borderRadius: '1rem', position: 'relative' }}>
      {/* Orange Background */}
      <div style={{
        backgroundColor: '#ff7032', 
        padding: '2rem',
        borderRadius: '1rem',
        position: 'relative',
      }}>

        <div style={{ marginBottom: '2rem', textAlign: 'left', color: "#ffffff" }}>
          
          <p>
            In <strong>{new Date().getFullYear()}</strong>, I’ve covered the following distances* swimming, biking, and running:
          </p>

          
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
        }}>
          {formatCard(
            'swimming 🏊',
            unit === "miles" ? formatNumber(swimDistanceMi) : // "mi" won't appear when testing in dev server but will when fetching live data
            unit === "km" ? formatNumber(swimDistanceKm) + " km" :
            unit === "fields" ? formatNumber(convertToFields(swimDistanceKm * 1000)) + " 🏈" :
            convertToMoonPercentage(swimDistanceKm) + " 🚀",
            '#0099cc'
          )}

          {formatCard(
            'biking 🚴',
            unit === "miles" ? formatNumber(rideDistanceMi) : // "mi" won't appear when testing in dev server but will when fetching live data
            unit === "km" ? formatNumber(rideDistanceKm) + " km" :
            unit === "fields" ? formatNumber(convertToFields(rideDistanceKm * 1000)) + " 🏈" :
            convertToMoonPercentage(rideDistanceKm) + " 🚀",
            '#41ab5d'
          )}

          {formatCard(
            'running 🏃‍♂️',
            unit === "miles" ? formatNumber(runDistanceMi) : // "mi" won't appear when testing in dev server but will when fetching live data
            unit === "km" ? formatNumber(runDistanceKm) + " km" :
            unit === "fields" ? formatNumber(convertToFields(runDistanceKm * 1000)) + " 🏈" :
            convertToMoonPercentage(runDistanceKm) + " 🚀",
            '#ffaa00'
          )}
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <span style={{
              fontFamily: "monospace",
              border: 'dotted',
              borderColor: '#ffffff',
              color: "#ffffff",
              fontSize: '1.2rem',
              fontWeight: 'bold',
              padding: "0.2rem 0.4rem",
              borderRadius: "1rem",
              display: 'inline-block'
            }}>
              {unit === "miles" ? "miles" :
              unit === "km" ? "kilometers" :
              unit === "fields" ? "American football fields 🏈" :
              "% distance to the Moon 🚀"}
            </span>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button onClick={toggleUnit} className="btn">Change Unit of Measure</button>
          </div>

        {/* Relative Distance Bar */}
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
            width: `${swimPercent}%`,
            backgroundColor: '#0099cc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🏊
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
            width: `${runPercent}%`,
            backgroundColor: '#ffaa00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🏃‍♂️
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriathlonStats;
