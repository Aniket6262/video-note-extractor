import { useState, useRef } from 'react';
import axios from 'axios';
import InputBar from './components/InputBar';
import VideoPlayer from './components/VideoPlayer';
import StatsBar from './components/StatsBar';
import TabSwitcher from './components/TabSwitcher';
import ResultsPanel from './components/ResultsPanel';
import QAPanel from './components/QAPanel';
import { extractVideoId } from './utils/extractVideoId';
import { fetchTranscript } from './utils/fetchTranscript';
import { generateNotes, generateTimestamps, generateActions } from './services/openai';
import './App.css';

export default function App() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('notes');
  const [segments, setSegments] = useState([]);
  const [results, setResults] = useState({ notes: '', timestamps: '', actions: '', qa: '' });
  const transcriptRef = useRef('');

  async function handleExtract() {
    const vid = extractVideoId(url);
    if (!vid) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setError('');
    setVideoId(vid);
    setLoading(true);
    setSegments([]);
    setResults({ notes: '', timestamps: '', actions: '', qa: '' });

    try {
      const fetchedSegments = await fetchTranscript(vid);
      setSegments(fetchedSegments);

      const fullText = fetchedSegments.map(s => `[${s.start}s] ${s.text}`).join('\n');
      transcriptRef.current = fullText;

      await axios.post('http://localhost:5000/process', {
        videoId: vid,
        transcript: fetchedSegments,
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      });

      await Promise.all([
        generateNotes(fullText, text => setResults(r => ({ ...r, notes: text }))),
        generateTimestamps(fetchedSegments, text => setResults(r => ({ ...r, timestamps: text }))),
        generateActions(fullText, text => setResults(r => ({ ...r, actions: text }))),
      ]);
    } catch (e) {
      setError('Error: ' + e.message);
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ padding: '48px 32px 32px', animation: 'fadeUp 0.5s ease' }}>
        <div style={{
          fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--accent)', letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 12,
        }}>
          ◈ AI-POWERED LEARNING TOOL
        </div>
        <h1 style={{
          fontSize: 48, fontWeight: 800,
          fontFamily: "'Syne', sans-serif",
          lineHeight: 1.1, letterSpacing: -1,
          color: 'var(--text)', marginBottom: 12,
        }}>
          Video Note<br />
          <span style={{ color: 'var(--accent)' }}>Extractor</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 460 }}>
          Paste any YouTube URL — get organized notes, key timestamps, action items, and AI-powered Q&A instantly.
        </p>
      </div>

      {/* URL Input */}
      <InputBar url={url} setUrl={setUrl} onExtract={handleExtract} loading={loading} />

      {/* Error Message */}
      {error && (
        <p style={{
          color: 'var(--error)', padding: '0 32px 16px',
          fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
        }}>
          ⚠ {error}
        </p>
      )}

      {/* Loading Status */}
      {loading && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 32px 20px',
          color: 'var(--accent)', fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <div style={{
            width: 14, height: 14, borderRadius: '50%',
            border: '2px solid rgba(232,255,71,0.2)',
            borderTopColor: 'var(--accent)',
            animation: 'spin 0.8s linear infinite',
          }} />
          FETCHING TRANSCRIPT AND GENERATING NOTES...
        </div>
      )}

      {/* Video Player */}
      <VideoPlayer videoId={videoId} />

      {/* Stats Bar */}
      <StatsBar segments={segments} />

      {/* Tabs + Results */}
      {(results.notes || results.timestamps || results.actions || loading) && (
        <>
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

          <div style={{ marginTop: 16 }}>
            {activeTab === 'notes' && <ResultsPanel content={results.notes} />}
            {activeTab === 'timestamps' && <ResultsPanel content={results.timestamps} />}
            {activeTab === 'actions' && <ResultsPanel content={results.actions} />}
            {activeTab === 'qa' && (
              <QAPanel
                videoId={videoId}
                apiKey={process.env.REACT_APP_OPENAI_API_KEY}
                answer={results.qa}
                setAnswer={text => setResults(r => ({ ...r, qa: text }))}
              />
            )}
          </div>
        </>
      )}

    </div>
  );
}