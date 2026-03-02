export default function InputBar({ url, setUrl, onExtract, loading }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 24 }}>
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !loading && onExtract()}
        placeholder="Paste YouTube URL here..."
        style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid #ccc', fontSize: 14 }}
      />
      <button
        onClick={onExtract}
        disabled={loading || !url}
        style={{ padding: '12px 24px', borderRadius: 8, background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        {loading ? 'Processing...' : 'Extract Notes →'}
      </button>
    </div>
  );
}