export default function InputBar({ url, setUrl, onExtract, loading }) {
  return (
    <div style={{ padding: '0 32px 32px', animation: 'fadeUp 0.5s ease 0.1s both' }}>
      <div style={{
        display: 'flex', gap: 12,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16, padding: 8,
      }}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && onExtract()}
          placeholder="Paste YouTube URL here..."
          disabled={loading}
          style={{
            flex: 1, background: 'transparent',
            border: 'none', padding: '12px 16px',
            color: 'var(--text)', fontSize: 15,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
        <button
          onClick={onExtract}
          disabled={loading || !url}
          style={{
            background: loading ? 'var(--surface2)' : 'var(--accent)',
            color: loading ? 'var(--muted)' : '#080b0f',
            border: 'none', borderRadius: 10,
            padding: '12px 28px', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 14, fontFamily: "'Syne', sans-serif",
            fontWeight: 700, letterSpacing: 0.5,
            transition: 'all 0.2s',
            opacity: !url ? 0.4 : 1,
          }}
        >
          {loading ? '...' : 'EXTRACT →'}
        </button>
      </div>
    </div>
  );
}