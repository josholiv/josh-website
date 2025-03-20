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

  // Calculate the maximum distance across all sports for relative scaling of the bars
  const maxDistance = Math.max(
    data.swimDistance,
    data.rideDistance,
    data.runDistance
  );

  const getDistance = (unit, distanceKm, distanceMeters) => {
    switch (unit) {
      case "km":
        return distanceKm;
      case "miles":
        return distanceMeters / 1609.34;
      case "yards":
        return convertToYards(distanceKm * 1000);
      case "fields":
        return convertToFields(distanceKm * 1000);
      case "moon%":
        return convertToMoonPercentage(distanceKm);
      default:
        return distanceKm;
    }
  };

  return (
    <div>
      <p>During my triathlon training* in <strong>{new Date().getFullYear()}</strong>, I've gone a total of:</p>
      {!error && (
        <div>
          {/* Swimming */}
          <div>
            <strong style={{ fontSize: '1.5rem', color: '#00dbff' }}>
              🏊 {unit === "miles" ? formatNumber(data.swimDistance) + " " : 
                  unit === "km" ? `${formatNumber(data.swimDistanceKm)} kilometers ` : 
                  unit === "yards" ? `${formatNumber(convertToYards(data.swimDistanceKm * 1000))} yards ` : 
                  unit === "fields" ? `${formatNumber(convertToFields(data.swimDistanceKm * 1000))} football fields🏈 ` :
                  `${convertToMoonPercentage(data.swimDistanceKm)}% of the way to the Moon 🌕`}
            </strong>
            <div style={{
              backgroundColor: '#00dbff', 
              height: '10px', 
              width: `${(getDistance(unit, data.swimDistanceKm, data.swimDistance) / maxDistance)}%`,
              marginTop: '5px'
            }}></div>
          </div>

          {/* Biking */}
          <div>
            <strong style={{ fontSize: '1.5rem', color: '#41ab5d' }}>
              🚴 {unit === "miles" ? formatNumber(data.rideDistance) + " " : 
                  unit === "km" ? `${formatNumber(data.rideDistanceKm)} kilometers ` : 
                  unit === "yards" ? `${formatNumber(convertToYards(data.rideDistanceKm * 1000))} yards ` : 
                  unit === "fields" ? `${formatNumber(convertToFields(data.rideDistanceKm * 1000))} football fields🏈 ` :
                  `${convertToMoonPercentage(data.rideDistanceKm)}% of the way to the Moon 🌕`}
            </strong>
            <div style={{
              backgroundColor: '#41ab5d', 
              height: '10px', 
              width: `${(getDistance(unit, data.rideDistanceKm, data.rideDistance) / maxDistance) * 100}%`,
              marginTop: '5px'
            }}></div>
          </div>

          {/* Running */}
          <div>
            <strong style={{ fontSize: '1.5rem', color: '#ffaa00' }}>
              🏃‍♂️ {unit === "miles" ? formatNumber(data.runDistance) + " " : 
                  unit === "km" ? `${formatNumber(data.runDistanceKm)} kilometers ` : 
                  unit === "yards" ? `${formatNumber(convertToYards(data.runDistanceKm * 1000))} yards ` : 
                  unit === "fields" ? `${formatNumber(convertToFields(data.runDistanceKm * 1000))} football fields🏈 ` :
                  `${convertToMoonPercentage(data.runDistanceKm)}% of the way to the Moon 🌕`}
            </strong>
            <div style={{
              backgroundColor: '#ffaa00', 
              height: '10px', 
              width: `${(getDistance(unit, data.runDistanceKm, data.runDistance) / maxDistance) * 100}%`,
              marginTop: '5px'
            }}></div>
          </div>
        </div>
      )}
      <button onClick={toggleUnit} className="btn">Change Distance Unit</button>
    </div>
  );
};

export default TriathlonStats;
