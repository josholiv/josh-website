const HardcoverStats = ({ data }) => {
  const goals =
    Array.isArray(data) && data.length > 0
      ? data
      : [{ goal: 999, progress: 999 }]; // fallback dummy data

  const formatCard = (progress, goal, color, isLast) => (
    <div
      style={{
        color,
        padding: "0rem 1rem 0rem 0rem",
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        textAlign: 'left',
        borderRight: isLast ? "none" : "1px solid var(--text-normal)",
      }}
    >
      {/* Row for progress and goal */}
      <div style={{ display: "flex", height: "100%" }}>
        {/* Books Read section */}
        <div style={{ flex: 1, textAlign: "left", paddingRight: "1rem"}}>
          <div style={{ fontSize: "1rem", marginBottom: "0.3rem", color: "var(--text-heading)" }}>
            Read
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>{progress}</div>
        </div>

        {/* Solid vertical separator */}
        <div style={{ width: "1px", backgroundColor: "var(--text-normal)" }} />

        {/* Reading Goal section */}
        <div style={{ flex: 1, textAlign: "left", paddingLeft: "1rem"}}>
          <div style={{ fontSize: "1rem", marginBottom: "0.3rem", color: "var(--text-heading)" }}>
            Goal
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>{goal}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-normal)",
          borderRadius: "5px",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {goals.map((g, i) =>
          formatCard(g.progress, g.goal, "var(--text-heading)", i === goals.length - 1)
        )}
      </div>
    </div>
  );
};

export default HardcoverStats;
