export default function ResultsPanel({ content }) {
  if (!content) return (
    <div style={{
      margin: '0 32px', padding: 32,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      display: 'flex', alignItems: 'center', gap: 12,
      color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%',
        border: '2px solid var(--muted)',
        borderTopColor: 'var(--accent)',
        animation: 'spin 0.8s linear infinite',
        flexShrink: 0,
      }} />
      Generating...
    </div>
  );

  const lines = content.split('\n');

  return (
    <div style={{
      margin: '0 32px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 16, padding: '24px 28px',
      animation: 'fadeUp 0.3s ease',
      maxHeight: 500, overflowY: 'auto',
    }}>
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return (
          <h2 key={i} style={{
            color: 'var(--accent)', fontSize: 13,
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            letterSpacing: 2, textTransform: 'uppercase',
            margin: '24px 0 10px', borderBottom: '1px solid var(--border)',
            paddingBottom: 8,
          }}>{line.slice(3)}</h2>
        );
        if (line.startsWith('### ')) return (
          <h3 key={i} style={{
            color: 'var(--accent2)', fontSize: 14,
            fontFamily: "'Syne', sans-serif", fontWeight: 600,
            margin: '16px 0 8px',
          }}>{line.slice(4)}</h3>
        );
        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('☐')) return (
          <div key={i} style={{
            display: 'flex', gap: 10, marginBottom: 6,
            alignItems: 'flex-start',
          }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>▸</span>
            <span style={{ color: '#a0aec0', fontSize: 14, lineHeight: 1.7 }}>
              {line.startsWith('☐') ? line.slice(2) : line.slice(2)}
            </span>
          </div>
        );
        if (line.match(/^\[[\d.:]+s?\]/)) {
          const parts = line.match(/^(\[[\d.:]+s?\])\s*(.*)/);
          if (parts) return (
            <div key={i} style={{
              display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start',
            }}>
              <span style={{
                background: 'rgba(232,255,71,0.1)',
                color: 'var(--accent)',
                padding: '2px 8px', borderRadius: 6,
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                flexShrink: 0, marginTop: 2,
              }}>{parts[1]}</span>
              <span style={{ color: '#a0aec0', fontSize: 14, lineHeight: 1.7 }}>{parts[2]}</span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
        return (
          <p key={i} style={{
            color: '#a0aec0', fontSize: 14,
            lineHeight: 1.8, margin: '4px 0',
          }}>{line}</p>
        );
      })}

      <button
        onClick={() => navigator.clipboard.writeText(content)}
        style={{
          marginTop: 20, background: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--muted)', borderRadius: 8,
          padding: '6px 14px', cursor: 'pointer',
          fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: 1,
        }}
      >
        COPY ↗
      </button>
    </div>
  );
}