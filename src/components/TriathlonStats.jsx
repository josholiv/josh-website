import { useState } from 'preact/hooks';

// Dummy data for local preview
// const dummyData = {
//   swimDistance: 45, // miles
//   swimDistanceKm: 72.4,
//   rideDistance: 620, // miles
//   rideDistanceKm: 997.8,
//   runDistance: 140, // miles
//   runDistanceKm: 225.3,
// };

// Uncomment this section to fetch live Strava data
const { data, error } = useStravaData();

const TriathlonStats = () => {
  // Use Strava data when available
  const data = data || {
    swimDistance: 45, // miles
    swimDistanceKm: 72.4,
    rideDistance: 620, // miles
    rideDistanceKm: 997.8,
    runDistance: 140, // miles
    runDistanceKm: 225.3,
  };
  const error = error;

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

  const swimDistanceKm = data?.swimDistanceKm || 0;
  const rideDistanceKm = data?.rideDistanceKm || 0;
  const runDistanceKm = data?.runDistanceKm || 0;

  const totalDistance = swimDistanceKm + rideDistanceKm + runDistanceKm;
  const swimPercent = totalDistance ? (swimDistanceKm / totalDistance) * 100 : 0;
  const ridePercent = totalDistance ? (rideDistanceKm / totalDistance) * 100 : 0;
  const runPercent = totalDistance ? (runDistanceKm / totalDistance) * 100 : 0;

  const formatCard = (label, value, emoji, color, unit) => (
    <p>
      <span style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '0.5rem 1rem',
        borderRadius: '1rem',
        display: 'inline-block',
        color: color || '#fff',
      }}>
        <strong style={{ fontSize: '2rem' }}>{value}</strong><br />
        <span style={{ fontSize: '1rem' }}>
          {label} {emoji}
        </span>
      </span>
    </p>
  );

  const swimDisplay =
    unit === "miles" ? formatNumber(data.swimDistance) :
    unit === "km" ? `${formatNumber(swimDistanceKm)}` :
    unit === "yards" ? `${formatNumber(convertToYards(swimDistanceKm * 1000))}` :
    unit === "fields" ? `${formatNumber(convertToFields(swimDistanceKm * 1000))}` :
    `${convertToMoonPercentage(swimDistanceKm)}%`;

  const rideDisplay =
    unit === "miles" ? formatNumber(data.rideDistance) :
    unit === "km" ? `${formatNumber(rideDistanceKm)}` :
    unit === "yards" ? `${formatNumber(convertToYards(rideDistanceKm * 1000))}` :
    unit === "fields" ? `${formatNumber(convertToFields(rideDistanceKm * 1000))}` :
    `${convertToMoonPercentage(rideDistanceKm)}%`;

  const runDisplay =
    unit === "miles" ? formatNumber(data.runDistance) :
    unit === "km" ? `${formatNumber(runDistanceKm)}` :
    unit === "yards" ? `${formatNumber(convertToYards(runDistanceKm * 1000))}` :
    unit === "fields" ? `${formatNumber(convertToFields(runDistanceKm * 1000))}` :
    `${convertToMoonPercentage(runDistanceKm)}%`;

  const unitDescriptions = {
    miles: "miles",
    km: "kilometers",
    yards: "yards",
    fields: "American football fields",
    "moon%": "of the distance to the Moon"
  };

  return (
    <>
      <p>During my triathlon training* in {new Date().getFullYear()}, I've gone:</p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '0rem',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}>
          {!error && formatCard("Swimming", swimDisplay, "🏊", "#0099cc", unit)}
          {!error && formatCard("Biking", rideDisplay, "🚴", "#41ab5d", unit)}
          {!error && formatCard("Running", runDisplay, "🏃‍♂️", "#ffaa00", unit)}
        </div>

        {/* Show Description for Active Unit */}
        <div style={{
          marginTop: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',  // Transparent black background
          padding: '0.5rem 1rem',                 // Padding to match other elements
          borderRadius: '1rem',                   // Rounded corners
        }}>
          <p style={{ color: '#fff' }}>{unitDescriptions[unit]}</p>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button onClick={toggleUnit} className="btn" style={{
            backgroundColor: '#d9d9d9',
            borderRadius: '2rem',
            fontFamily: 'monospace',
            color: '#000000',
            fontSize: '1rem',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            padding: '1rem 1rem',
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            Change Distance Unit
          </button>
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
    </>
  );
};

export default TriathlonStats;
