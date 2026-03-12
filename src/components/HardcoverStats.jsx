const HardcoverStats = ({ data }) => {
  const goals =
    Array.isArray(data) && data.length > 0
      ? data
      : [{ goal: 0, progress: 0 }];

  return (
    <table style={{ borderCollapse: 'collapse', marginBottom: '1rem', width: 'auto' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'normal' }}>Goal</th>
          <th style={{ textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'normal' }}>Read</th>
        </tr>
      </thead>
      <tbody>
        {goals.map((g, i) => (
          <tr key={i}>
            <td style={{ fontFamily: 'Atkinson Hyperlegible Mono', paddingRight: '2rem' }}>{g.goal}</td>
            <td style={{ fontFamily: 'Atkinson Hyperlegible Mono' }}>{g.progress}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HardcoverStats;