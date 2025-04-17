import { useState } from "preact/hooks";

const HobbyImage = ({ hobbies }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hobbyImages = {
    "Drinking tereré 🧉": "/images/hobbies/terere.jpg",
    "3D printing ⚙️": "/images/hobbies/3d-printing.jpg",
    "Learning yoyo tricks 🪀": "/images/hobbies/yoyo-tricks.jpg",
    "Doing triathlons 🏊🚴🏃‍♂️": "/images/hobbies/triathlon.jpg",
  };

  const selectedHobby = hobbies[selectedIndex];

  const handleNextHobby = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % hobbies.length);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem", width: "100%" }}>
        <div style={{ width: "100%" }}>
          <h3 style={{ margin: 0 }}>Some of my favorite hobbies are:</h3>
          <h2 style={{ fontSize: "1.5rem", color: "#41ab5d" }}>{selectedHobby}</h2>
          <button
            onClick={handleNextHobby}
            class="btn"
          >
            Change Hobby
          </button>
        </div>

        {selectedHobby && hobbyImages[selectedHobby] && (
          <img
            src={hobbyImages[selectedHobby]}
            alt={selectedHobby}
            style={{
              flex: "1 1 50%",
              maxWidth: "50rem",
              minWidth: "8rem",
              height: "auto",
              borderRadius: "0",
              objectFit: "contain",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HobbyImage;
