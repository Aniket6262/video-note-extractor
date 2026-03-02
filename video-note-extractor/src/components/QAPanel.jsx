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
        videoId, question, apiKey,
      });
      setAnswer(res.data.answer);
    } catch (e) {
      setAnswer('Error: ' + e.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ margin: '0 32px', animation: 'fadeUp 0.3s ease' }}>
      <p style={{
        color: 'var(--muted)', fontSize: 12,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: 1, marginBottom: 16,
      }}>
        ◎ RAG-POWERED — searches transcript vectors before answering
      </p>
      <div style={{
        display: 'flex', gap: 8,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14, padding: 8,
        marginBottom: 16,
      }}>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && handleAsk()}
          placeholder="Ask anything about the video..."
          style={{
            flex: 1, background: 'transparent',
            border: 'none', padding: '10px 14px',
            color: 'var(--text)', fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          style={{
            background: 'var(--accent)', color: '#080b0f',
            border: 'none', borderRadius: 10,
            padding: '10px 22px', cursor: 'pointer',
            fontSize: 12, fontFamily: "'Syne', sans-serif",
            fontWeight: 700, letterSpacing: 1,
            opacity: (!question.trim() || loading) ? 0.4 : 1,
          }}
        >
          {loading ? '...' : 'ASK →'}
        </button>
      </div>
      {answer && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--accent2)',
          borderRadius: 14, padding: '20px 24px',
          color: '#a0aec0', fontSize: 14, lineHeight: 1.8,
        }}>
          {answer}
        </div>
      )}
    </div>
  );
}