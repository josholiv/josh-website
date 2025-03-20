import { useState } from "preact/hooks";

const HobbyImage = ({ hobbies }) => {
  // Set initial selected hobby to "Yerba mate 🧉"
  const [selectedHobby, setSelectedHobby] = useState("Yerba mate 🧉");

  const hobbyImages = {
    "Yerba mate 🧉": "/images/hobbies/yerba-mate.jpg",
    "3D printing ⚙️": "/images/hobbies/3d-printing.jpg",
    "Neuroscience 🧠": "/images/hobbies/neuroscience.jpg",
    "Yoyo tricks 🪀": "/images/hobbies/yoyo-tricks.jpg",
    "Triathlons 🏊🚴🏃‍♂️": "/images/hobbies/triathlon.jpg",
  };

  const handleHobbyChange = (hobby) => {
    // Set the clicked hobby as the selected hobby
    setSelectedHobby(hobby);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3rem", width: "100%" }}>
      <ul style={{ fontSize: "1.5rem", listStyle: "none", margin: 0, padding: 0 }}>
        {hobbies.map((hobby) => (
          <li
            key={hobby}
            style={{
              cursor: "pointer",
              fontWeight: selectedHobby === hobby ? "bold" : "normal", // Bold selected hobby text
              color: selectedHobby === hobby ? "#41ab5d" : "inherit", // Green for selected hobby text
            }}
            onClick={() => handleHobbyChange(hobby)} // Update selected hobby on click
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
            width: "15rem",
            height: "15rem",
            borderRadius: "1rem",
            marginLeft: "auto", // This will push the image to the right
          }}
        />
      )}
    </div>
  );
};

export default HobbyImage;
