import { formatTime } from '../utils/formatTime';

export default function StatsBar({ segments }) {
  if (!segments || segments.length === 0) return null;

  const duration = formatTime(segments[segments.length - 1]?.start || 0);
  const wordCount = segments.map(s => s.text).join(' ').split(' ').length;

  return (
    <div style={{
      display: 'flex', gap: 2, margin: '0 32px 24px',
      animation: 'fadeUp 0.4s ease',
    }}>
      {[
        { label: 'SEGMENTS', value: segments.length },
        { label: 'DURATION', value: duration },
        { label: 'WORDS', value: wordCount.toLocaleString() },
      ].map((stat, i) => (
        <div key={stat.label} style={{
          flex: 1, padding: '16px 20px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : 0,
        }}>
          <div style={{
            fontSize: 24, fontWeight: 800,
            fontFamily: "'Syne', sans-serif",
            color: 'var(--accent)',
          }}>{stat.value}</div>
          <div style={{
            fontSize: 10, color: 'var(--muted)',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 2, marginTop: 2,
          }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}