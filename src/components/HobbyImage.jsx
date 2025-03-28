import { useState } from "preact/hooks";

const HobbyImage = ({ hobbies }) => {
  const [selectedHobby, setSelectedHobby] = useState("3D printing ⚙️");

  const hobbyImages = {
    "Tereré 🧉": "/images/hobbies/terere.jpg",
    "3D printing ⚙️": "/images/hobbies/3d-printing.jpg",
    "Yoyo tricks 🪀": "/images/hobbies/yoyo-tricks.jpg",
    "Triathlons 🏊🚴🏃‍♂️": "/images/hobbies/triathlon.jpg",
  };

  const handleHobbyChange = (hobby) => {
    setSelectedHobby(hobby);
  };

  return (
    <div>
   <div style={{ display: "flex", alignItems: "center", gap: "2rem", width: "100%" }}>
  <div style={{ width: "100%" }}>
    <p style={{ margin: 0 }}>Some of my favorite things are:</p>
    <ul
      style={{
        fontSize: "1.2rem",
        listStyle: "square",
        margin: 0,
        padding: "1rem",
        flexShrink: 0,
        paddingLeft: "2rem", // Indentation applied to the list only
      }}
    >
      {hobbies.map((hobby) => (
        <li
          key={hobby}
          style={{
            cursor: "pointer",
            color: selectedHobby === hobby ? "#41ab5d" : "inherit",
          }}
          onClick={() => handleHobbyChange(hobby)}
        >
          <strong>{hobby}</strong>
        </li>
      ))}
    </ul>
  </div>

      {selectedHobby && hobbyImages[selectedHobby] && (
        <img
          src={hobbyImages[selectedHobby]}
          alt={selectedHobby}
          style={{
            flex: "1 1 50%", // Grow, shrink, and start at 50% width
            maxWidth: "50rem", // Prevents the image from being too wide
            minWidth: "8rem", // Prevents it from shrinking too much
            height: "auto", // Maintains aspect ratio
            borderRadius: "50%",
            objectFit: "contain", // Ensures the image fits well
          }}
        />
      )}
    </div>
    </div>
  );
};

export default HobbyImage;
