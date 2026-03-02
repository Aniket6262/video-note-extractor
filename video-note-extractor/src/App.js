import { useState, useRef } from 'react';
import InputBar from './components/InputBar';
import VideoPlayer from './components/VideoPlayer';
import StatsBar from './components/StatsBar';
import TabSwitcher from './components/TabSwitcher';
import ResultsPanel from './components/ResultsPanel';
import QAPanel from './components/QAPanel';
import { extractVideoId } from './utils/extractVideoId';
import { fetchTranscript } from './utils/fetchTranscript';
import { generateNotes, generateTimestamps, generateActions, askQuestion } from './services/openai';

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

  async function handleAsk(question) {
    setResults(r => ({ ...r, qa: '' }));
    await askQuestion(transcriptRef.current, question, text =>
      setResults(r => ({ ...r, qa: text }))
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', fontFamily: 'sans-serif', paddingBottom: 60 }}>
      
      {/* Header */}
      <div style={{ padding: '32px 24px 8px' }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>🎬 Video Note Extractor</h1>
        <p style={{ color: '#888', marginTop: 6 }}>
          Paste a YouTube URL to get organized notes, timestamps, and action items instantly.
        </p>
      </div>

      {/* URL Input */}
      <InputBar
        url={url}
        setUrl={setUrl}
        onExtract={handleExtract}
        loading={loading}
      />

      {/* Error Message */}
      {error && (
        <p style={{ color: 'red', padding: '0 24px', fontSize: 14 }}>⚠ {error}</p>
      )}

      {/* Loading Status */}
      {loading && (
        <p style={{ color: '#0070f3', padding: '0 24px', fontSize: 14 }}>
          ⏳ Fetching transcript and generating notes...
        </p>
      )}

      {/* Video Player */}
      <div style={{ padding: '0 24px', marginTop: 16 }}>
        <VideoPlayer videoId={videoId} />
      </div>

      {/* Stats Bar — only shows after transcript is fetched */}
      <StatsBar segments={segments} />

      {/* Tabs + Results — only shows when there's something to show */}
      {(results.notes || results.timestamps || results.actions || loading) && (
        <>
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

          <div style={{ marginTop: 16 }}>
            {activeTab === 'notes' && (
              <ResultsPanel content={results.notes} />
            )}
            {activeTab === 'timestamps' && (
              <ResultsPanel content={results.timestamps} />
            )}
            {activeTab === 'actions' && (
              <ResultsPanel content={results.actions} />
            )}
            {activeTab === 'qa' && (
              <QAPanel onAsk={handleAsk} answer={results.qa} />
            )}
          </div>
        </>
      )}

    </div>
  );
}