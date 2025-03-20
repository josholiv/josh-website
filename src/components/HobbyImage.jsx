import { useState } from "preact/hooks";

const HobbyImage = ({ hobbies }) => {
  const [selectedHobby, setSelectedHobby] = useState("Yerba mate 🧉");

  const hobbyImages = {
    "Yerba mate 🧉": "/images/hobbies/yerba-mate.jpg",
    "3D printing ⚙️": "/images/hobbies/3d-printing.jpg",
    "Neuroscience 🧠": "/images/hobbies/neuroscience.jpg",
    "Yoyo tricks 🪀": "/images/hobbies/yoyo-tricks.jpg",
    "Triathlons 🏊🚴🏃‍♂️": "/images/hobbies/triathlon.jpg",
  };

  const handleHobbyChange = (hobby) => {
    setSelectedHobby(hobby);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2rem", width: "100%" }}>
      <ul style={{ fontSize: "1.5rem", listStyle: "none", margin: 0, padding: 0, flexShrink: 0 }}>
        {hobbies.map((hobby) => (
          <li
            key={hobby}
            style={{
              cursor: "pointer",
              fontWeight: selectedHobby === hobby ? "bold" : "normal",
              color: selectedHobby === hobby ? "#41ab5d" : "inherit",
            }}
            onClick={() => handleHobbyChange(hobby)}
          >
            <strong>{hobby}</strong>
          </li>
        ))}
      </ul>

      {selectedHobby && hobbyImages[selectedHobby] && (
        <img
          src={hobbyImages[selectedHobby]}
          alt={selectedHobby}
          style={{
            flex: "1 1 50%", // Grow, shrink, and start at 50% width
            maxWidth: "50vw", // Prevents the image from being too wide
            minWidth: "10rem", // Prevents it from shrinking too much
            height: "auto", // Maintains aspect ratio
            borderRadius: "1rem",
            objectFit: "contain", // Ensures the image fits well
          }}
        />
      )}
    </div>
  );
};

export default HobbyImage;
