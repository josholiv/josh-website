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

  // Convert the distance from miles to number of dashes (assuming 10 dashes per mile as an example)
  const milesToDashes = (miles) => '-'.repeat(Math.round(miles * 10)); // Each mile is represented by 10 dashes

  return (
    <div>
      <p>During my triathlon training* in <strong>{new Date().getFullYear()}</strong>, I've gone a total of:</p>
      {!error && (
        <div>
          {/* Swimming */}
          <div>
            <strong style={{ fontSize: '1.5rem', color: '#00dbff' }}>
              🏊 {unit === "miles" ? formatNumber(data.swimDistance) + " miles" : 
                  unit === "km" ? `${formatNumber(data.swimDistanceKm)} kilometers` : 
                  unit === "yards" ? `${formatNumber(convertToYards(data.swimDistanceKm * 1000))} yards` : 
                  unit === "fields" ? `${formatNumber(convertToFields(data.swimDistanceKm * 1000))} football fields🏈` :
                  `${convertToMoonPercentage(data.swimDistanceKm)}% of the way to the Moon 🌕`}
            </strong>
            <div style={{ fontFamily: 'monospace', color: '#00dbff' }}>
              {milesToDashes(data.swimDistance)} {/* Line of dashes based on swim distance */}
            </div>
          </div>

          {/* Biking */}
          <div>
            <strong style={{ fontSize: '1.5rem', color: '#41ab5d' }}>
              🚴 {unit === "miles" ? formatNumber(data.rideDistance) + " miles" : 
                  unit === "km" ? `${formatNumber(data.rideDistanceKm)} kilometers` : 
                  unit === "yards" ? `${formatNumber(convertToYards(data.rideDistanceKm * 1000))} yards` : 
                  unit === "fields" ? `${formatNumber(convertToFields(data.rideDistanceKm * 1000))} football fields🏈` :
                  `${convertToMoonPercentage(data.rideDistanceKm)}% of the way to the Moon 🌕`}
            </strong>
            <div style={{ fontFamily: 'monospace', color: '#41ab5d' }}>
              {milesToDashes(data.rideDistance)} {/* Line of dashes based on ride distance */}
            </div>
          </div>

          {/* Running */}
          <div>
            <strong style={{ fontSize: '1.5rem', color: '#ffaa00' }}>
              🏃‍♂️ {unit === "miles" ? formatNumber(data.runDistance) + " miles" : 
                  unit === "km" ? `${formatNumber(data.runDistanceKm)} kilometers` : 
                  unit === "yards" ? `${formatNumber(convertToYards(data.runDistanceKm * 1000))} yards` : 
                  unit === "fields" ? `${formatNumber(convertToFields(data.runDistanceKm * 1000))} football fields🏈` :
                  `${convertToMoonPercentage(data.runDistanceKm)}% of the way to the Moon 🌕`}
            </strong>
            <div style={{ fontFamily: 'monospace', color: '#ffaa00' }}>
              {milesToDashes(data.runDistance)} {/* Line of dashes based on run distance */}
            </div>
          </div>
        </div>
      )}
      <button onClick={toggleUnit} className="btn">Change Distance Unit</button>
    </div>
  );
};

export default TriathlonStats;
