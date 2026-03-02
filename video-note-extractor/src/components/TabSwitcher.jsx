const tabs = [
  { id: 'notes', label: '📋 Notes' },
  { id: 'timestamps', label: '⏱ Timestamps' },
  { id: 'actions', label: '✅ Actions' },
  { id: 'qa', label: '💬 Ask AI' },
];

export default function TabSwitcher({ activeTab, setActiveTab }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '0 24px' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd',
            background: activeTab === tab.id ? '#0070f3' : 'white',
            color: activeTab === tab.id ? 'white' : '#333',
            cursor: 'pointer'
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}