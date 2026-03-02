const tabs = [
  { id: 'notes', label: 'NOTES', icon: '◈' },
  { id: 'timestamps', label: 'TIMESTAMPS', icon: '◷' },
  { id: 'actions', label: 'ACTIONS', icon: '◻' },
  { id: 'qa', label: 'ASK AI', icon: '◎' },
];

export default function TabSwitcher({ activeTab, setActiveTab }) {
  return (
    <div style={{
      display: 'flex', gap: 4,
      padding: '0 32px', marginBottom: 16,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            padding: '10px 20px',
            background: activeTab === tab.id ? 'var(--accent)' : 'var(--surface)',
            color: activeTab === tab.id ? '#080b0f' : 'var(--muted)',
            border: '1px solid',
            borderColor: activeTab === tab.id ? 'var(--accent)' : 'var(--border)',
            borderRadius: 10, cursor: 'pointer',
            fontSize: 11, fontFamily: "'Syne', sans-serif",
            fontWeight: 700, letterSpacing: 1.5,
            transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span>{tab.icon}</span> {tab.label}
        </button>
      ))}
    </div>
  );
}