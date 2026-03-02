import { useState } from 'react';
import axios from 'axios';

export default function QAPanel({ videoId, apiKey, answer, setAnswer }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await axios.post('http://localhost:5000/ask', {
        videoId,
        question,
        apiKey,
      });
      setAnswer(res.data.answer);
    } catch (e) {
      setAnswer('Error: ' + e.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 24 }}>
      <p style={{ color: '#888', fontSize: 13, marginTop: 0 }}>
        🔍 Powered by RAG — searches relevant parts of the transcript before answering
      </p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && handleAsk()}
          placeholder="What was mentioned about...?"
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          style={{ padding: '10px 20px', borderRadius: 8, background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Searching...' : 'Ask →'}
        </button>
      </div>
      {answer && (
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, lineHeight: 1.8 }}>
          {answer}
        </div>
      )}
    </div>
  );
}