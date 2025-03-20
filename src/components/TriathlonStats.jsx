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

  // Get max distance for normalization
  const maxDistance = Math.max(data.swimDistance, data.rideDistance, data.runDistance);
  
  // Function to normalize bar width (percentage of max distance)
  const getBarWidth = (distance) => `${(distance / maxDistance) * 100}%`;

  return (
    <div>
      <p>During my triathlon training* in <strong>{new Date().getFullYear()}</strong>, I've gone a total of:</p>
      {!error && (
        <div style={{ paddingLeft: '0rem', maxWidth: "400px" }}> {/* Constrain total width */}
          {["swim", "ride", "run"].map((sport, index) => {
            const sportData = {
              swim: { label: "🏊", color: "#00dbff", distance: data.swimDistance, km: data.swimDistanceKm },
              ride: { label: "🚴", color: "#41ab5d", distance: data.rideDistance, km: data.rideDistanceKm },
              run: { label: "🏃‍♂️", color: "#ffaa00", distance: data.runDistance, km: data.runDistanceKm }
            }[sport];

            const displayDistance = unit === "miles" ? formatNumber(sportData.distance) + " " :
                                    unit === "km" ? `${formatNumber(sportData.km)} kilometers ` :
                                    unit === "yards" ? `${formatNumber(convertToYards(sportData.km * 1000))} yards ` :
                                    unit === "fields" ? `${formatNumber(convertToFields(sportData.km * 1000))} football fields🏈 ` :
                                    `${convertToMoonPercentage(sportData.km)}% of the distance from Earth🌎 to the Moon🌕`;

            return (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <strong style={{ fontSize: '1.5rem', color: sportData.color }}>
                  {sportData.label} {displayDistance}
                </strong>
                <div style={{
                  height: "10px",
                  width: getBarWidth(sportData.distance),
                  maxWidth: "100%",  // Prevent oversizing
                  backgroundColor: sportData.color,
                  borderRadius: "5px",
                  marginTop: "5px",
                  transition: "width 0.3s ease-in-out"
                }}></div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={toggleUnit} className="btn">Change Distance Unit</button>
    </div>
  );
};

export default TriathlonStats;
