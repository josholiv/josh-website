const HardcoverStats = ({ data }) => {
  // Use dummy data if nothing is passed
  const goals =
    Array.isArray(data) && data.length > 0
      ? data
      : [{ goal: 999, progress: 999 }]; // dummy data for dev/testing

  const formatCard = (progress, goal, color, isLast) => {
    return (
      <div
        style={{
          color,
          padding: "0.5rem 1rem",
          display: "inline-flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          textAlign: "left",
          borderRight: isLast ? "none" : "1px solid var(--neutral-200)",
          minWidth: "120px",
        }}
      >
        <div style={{ fontSize: "1rem", marginBottom: "0.3rem" }}>Books Read</div>
        <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
          {progress} / {goal}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "var(--neutral-800)",
          color: "var(--neutral-400)",
          borderRadius: "5px",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {goals.map((g, i) =>
          formatCard(g.progress, g.goal, "var(--blue-400)", i === goals.length - 1)
        )}
      </div>
    </div>
  );
};

export default HardcoverStats;
