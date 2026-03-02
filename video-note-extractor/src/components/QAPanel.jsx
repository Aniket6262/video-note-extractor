import { useState } from 'react';

export default function QAPanel({ onAsk, answer, loading }) {
  const [question, setQuestion] = useState('');

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && onAsk(question)}
          placeholder="What was mentioned about...?"
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button
          onClick={() => onAsk(question)}
          disabled={loading || !question.trim()}
          style={{ padding: '10px 20px', borderRadius: 8, background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Ask →
        </button>
      </div>
      {answer && <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, lineHeight: 1.8 }}>{answer}</div>}
    </div>
  );
}