const HardcoverStats = ({ data }) => {
  const goals =
    Array.isArray(data) && data.length > 0
      ? data
      : [{ goal: 0, progress: 0 }];

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', paddingRight: '2rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Read</th>
          <th style={{ textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'normal' }}>Goal</th>
        </tr>
      </thead>
      <tbody>
        {goals.map((g, i) => (
          <tr key={i}>
            <td style={{ paddingRight: '2rem', paddingBottom: '0.3rem', fontWeight: 'bold' }}>{g.progress}</td>
            <td style={{ paddingBottom: '0.3rem', color: 'var(--text-normal)' }}>{g.goal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HardcoverStats;