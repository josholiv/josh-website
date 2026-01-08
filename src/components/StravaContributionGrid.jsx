import { useMemo, useState, useEffect } from "preact/hooks";
import Strava from "../components/strava.js";

const COLORS = [
  "var(--orange-950)",
  "var(--orange-800)",
  "var(--orange-600)",
  "var(--orange-400)",
  "var(--orange-300)",
];

const getColor = (count) => {
  if (count === 0) return "var(--neutral-800)";
  if (count >= 4) return COLORS[4];
  return COLORS[count];
};

const StravaContributionGrid = ({ dailyCounts: initialDailyCounts = {} }) => {
  const [dailyCounts, setDailyCounts] = useState(initialDailyCounts);

  // In dev, generate dummy data client-side
 useEffect(() => {
  if (Object.keys(initialDailyCounts).length === 0) {
    const counts = {};
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      counts[key] = Math.floor(Math.random() * 4) + 1;
    }
    setDailyCounts(counts);
  }
}, []);


  console.log("Non-zero activity days:", Object.values(dailyCounts).filter(v => v > 0).length);

  const days = useMemo(() => {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 364);

    const allDays = [];
    for (let i = 0; i < 365; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);

      allDays.push({
        date: key,
        count: dailyCounts[key] || 0,
        weekday: d.getDay(),
        week: Math.floor(i / 7),
      });
    }

    return allDays;
  }, [dailyCounts]);

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "repeat(7, 12px)",
          gridAutoColumns: "12px",
          gap: "4px",
        }}
      >
        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.count} activities`}
            style={{
              gridRow: day.weekday + 1,
              gridColumn: day.week + 1,
              width: "12px",
              height: "12px",
              backgroundColor: getColor(day.count),
              borderRadius: "2px",
            }}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <span style={{ fontSize: "0.8rem" }}>Less</span>
        {COLORS.map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, backgroundColor: c }} />
        ))}
        <span style={{ fontSize: "0.8rem" }}>More</span>
      </div>
    </div>
  );
};

export default StravaContributionGrid;
