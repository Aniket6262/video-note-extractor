export default function VideoPlayer({ videoId }) {
  if (!videoId) return null;
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      width="100%" height="360"
      frameBorder="0" allowFullScreen
    />
  );
}