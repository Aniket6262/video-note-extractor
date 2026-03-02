import { formatTime } from '../utils/formatTime';

export default function StatsBar({ segments }) {
  if (!segments || segments.length === 0) return null;

  const duration = formatTime(segments[segments.length - 1]?.start || 0);
  const wordCount = segments.map(s => s.text).join(' ').split(' ').length;

  return (
    <div style={{
      display: 'flex', gap: 32, padding: '12px 24px',
      background: '#f0f7ff', borderRadius: 8, margin: '0 24px 16px',
      border: '1px solid #d0e8ff'
    }}>
      {[
        { label: 'Segments', value: segments.length },
        { label: 'Duration', value: duration },
        { label: 'Words ~', value: wordCount },
      ].map(stat => (
        <div key={stat.label}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0070f3' }}>{stat.value}</div>
          <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}