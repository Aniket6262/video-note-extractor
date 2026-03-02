export default function VideoPlayer({ videoId }) {
  if (!videoId) return null;
  return (
    <div style={{
      margin: '0 32px 24px',
      borderRadius: 16, overflow: 'hidden',
      border: '1px solid var(--border)',
      animation: 'fadeUp 0.4s ease',
    }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        width="100%" height="380"
        frameBorder="0" allowFullScreen
        title="Video player"
      />
    </div>
  );
}