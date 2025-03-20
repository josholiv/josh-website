const TriathlonBar = ({ data }) => {
    if (!data) return <p>Loading...</p>;
  
    const { swim, bike, run } = data; // Ensure these values are provided
  
    // Find the longest distance to normalize bar lengths
    const maxDistance = Math.max(swim, bike, run);
  
    return (
      <div className="triathlon-bar">
        {[{ name: "Swim", value: swim, color: "#1E90FF" },
          { name: "Bike", value: bike, color: "#32CD32" },
          { name: "Run", value: run, color: "#FF4500" }]
          .map(({ name, value, color }) => (
            <div key={name} className="bar-container">
              <span className="bar-label">{name}: {value} km</span>
              <div
                className="bar"
                style={{
                  width: `${(value / maxDistance) * 100}%`,
                  backgroundColor: color,
                }}
              ></div>
            </div>
          ))}
      </div>
    );
  };
  
  export default TriathlonBar;
  