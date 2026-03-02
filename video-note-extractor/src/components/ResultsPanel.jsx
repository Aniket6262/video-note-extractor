export default function ResultsPanel({ content }) {
  if (!content) return <p style={{ padding: 24, color: '#999' }}>Processing...</p>;
  return (
    <div style={{ padding: 24, whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: 14 }}>
      {content}
    </div>
  );
}