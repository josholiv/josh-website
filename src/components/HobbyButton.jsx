import { useState } from "preact/hooks";

const HobbyButton = ({ hobbies }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedHobby = hobbies[selectedIndex];

  const handleNextHobby = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % hobbies.length);
  };

  return (
    <div>
      <div>
        <p>
          One of my favorite hobbies is{" "}
          <span style={{ color: "#41ab5d", fontWeight: "bold" }}>
            {selectedHobby}
          </span>
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={handleNextHobby} className="btn">
            Change Hobby
          </button>
        </div>
      </div>
    </div>
  );
};

export default HobbyButton;
