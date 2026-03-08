import { useState, useEffect, useRef } from 'react';
import type { AgentMemory, ClientMemory, MemoryItem } from '../types';

interface AgentMemoryPanelProps {
  memory: AgentMemory;
  onModeToggle: () => void;
  mode: 'backoffice' | 'field';
}

const categoryMeta: Record<string, { label: string; icon: string; color: string; glow: string }> = {
  thought:  { label: '想法', icon: '💭', color: '#A78BFA', glow: 'rgba(167,139,250,0.4)' },
  preference: { label: '喜好', icon: '💝', color: '#F472B6', glow: 'rgba(244,114,182,0.4)' },
  habit:    { label: '习惯', icon: '🔄', color: '#22D3EE', glow: 'rgba(34,211,238,0.4)' },
  recent:   { label: '近况', icon: '📍', color: '#34D399', glow: 'rgba(52,211,153,0.4)' },
  'client-update': { label: '客户', icon: '👥', color: '#FBBF24', glow: 'rgba(251,191,36,0.4)' },
};

// Animated counter for understanding level
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    const start = ref.current;
    const duration = 1200;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (value - start) * eased);
      setDisplay(current);
      if (progress >= 1) { clearInterval(timer); ref.current = value; }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

// SVG circular progress ring
function CircularProgress({ value }: { value: number }) {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="ai-ring-wrapper">
      <svg width="68" height="68" viewBox="0 0 68 68" className="ai-ring-svg">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="4" />
        {/* Progress */}
        <circle
          cx="34" cy="34" r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 34 34)"
          filter="url(#ringGlow)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        {/* Pulsing dot at progress end */}
        {value > 0 && (
          <circle
            cx={34 + r * Math.cos((value / 100 * 360 - 90) * Math.PI / 180)}
            cy={34 + r * Math.sin((value / 100 * 360 - 90) * Math.PI / 180)}
            r="3"
            fill="#A78BFA"
            className="ai-ring-dot"
          />
        )}
      </svg>
      <div className="ai-ring-center">
        <div className="ai-ring-value"><AnimatedNumber value={value} />%</div>
        <div className="ai-ring-label">了解度</div>
      </div>
    </div>
  );
}

function MemoryItemCard({ item }: { item: MemoryItem }) {
  const meta = categoryMeta[item.category] || categoryMeta.recent;
  return (
    <div
      className={`ai-memory-item ${item.isNew ? 'ai-memory-item-new' : ''}`}
      style={{ '--item-color': meta.color, '--item-glow': meta.glow } as React.CSSProperties}
    >
      <div className="ai-memory-item-bar" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.glow}` }} />
      <div className="ai-memory-item-body">
        <div className="ai-memory-item-tag" style={{ color: meta.color, textShadow: `0 0 8px ${meta.glow}` }}>
          {meta.icon} {meta.label}
        </div>
        <div className="ai-memory-item-content">{item.content}</div>
      </div>
      {item.isNew && <div className="ai-memory-scan-line" />}
    </div>
  );
}

function ClientCard({ client, onClick }: { client: ClientMemory; onClick: () => void }) {
  const statusMap: Record<string, { label: string; color: string; glow: string }> = {
    potential: { label: '潜在', color: '#FBBF24', glow: 'rgba(251,191,36,0.4)' },
    active:    { label: '活跃', color: '#34D399', glow: 'rgba(52,211,153,0.4)' },
    closed:    { label: '成交', color: '#60A5FA', glow: 'rgba(96,165,250,0.4)' },
  };
  const status = statusMap[client.status] || statusMap.potential;
  return (
    <button className="ai-client-card" onClick={onClick}>
      <div className="ai-client-avatar">{client.avatar}</div>
      <div className="ai-client-info">
        <div className="ai-client-name">{client.name}</div>
        <div className="ai-client-reason">{client.addedReason}</div>
      </div>
      <span className="ai-client-status" style={{
        color: status.color,
        border: `1px solid ${status.color}`,
        boxShadow: `0 0 8px ${status.glow}`,
      }}>
        {status.label}
      </span>
    </button>
  );
}

function ClientDetailView({ client, onBack }: { client: ClientMemory; onBack: () => void }) {
  const statusMap: Record<string, string> = { potential: '潜在客户', active: '活跃客户', closed: '已成交' };
  return (
    <div className="ai-client-detail">
      <button className="ai-client-detail-back" onClick={onBack}>‹ 返回代理人记忆</button>
      <div className="ai-client-detail-header">
        <div className="ai-client-detail-avatar">{client.avatar}</div>
        <div>
          <div className="ai-client-detail-name">{client.name}</div>
          <div className="ai-client-detail-status">{statusMap[client.status] || '潜在客户'}</div>
        </div>
      </div>
      {Object.keys(client.profile).length > 0 && (
        <div className="ai-client-section">
          <div className="ai-client-section-title">📋 客户画像</div>
          {Object.entries(client.profile).map(([key, val]) => (
            <div key={key} className="ai-client-profile-row">
              <span className="ai-client-profile-key">{key}</span>
              <span className="ai-client-profile-val">{val}</span>
            </div>
          ))}
        </div>
      )}
      {client.memories.length > 0 && (
        <div className="ai-client-section">
          <div className="ai-client-section-title">🧠 客户记忆</div>
          {client.memories.map((m) => (<MemoryItemCard key={m.id} item={m} />))}
        </div>
      )}
      {client.memories.length === 0 && (
        <div className="ai-memory-empty">暂无记忆，AI将持续收集...</div>
      )}
    </div>
  );
}

type FilterTab = 'all' | 'thought' | 'preference' | 'habit' | 'recent' | 'clients';

// Floating neural node component
function NeuralNodes() {
  return (
    <svg className="ai-neural-bg" viewBox="0 0 280 600" xmlns="http://www.w3.org/2000/svg">
      {/* Nodes */}
      {[
        [30, 80], [80, 140], [140, 60], [200, 120], [250, 80],
        [50, 220], [120, 260], [200, 200], [240, 260],
        [30, 350], [90, 400], [160, 340], [230, 390],
        [60, 500], [140, 460], [220, 510],
      ].map(([x, y], i) => (
        <circle
          key={i} cx={x} cy={y} r="2.5"
          fill="rgba(99,102,241,0.5)"
          className={`ai-neural-node ai-neural-node-${i % 4}`}
        />
      ))}
      {/* Connections */}
      {[
        [30,80,80,140],[80,140,140,60],[140,60,200,120],[200,120,250,80],
        [80,140,50,220],[140,60,120,260],[200,120,200,200],[250,80,240,260],
        [50,220,120,260],[120,260,200,200],[200,200,240,260],
        [50,220,30,350],[120,260,90,400],[200,200,160,340],[240,260,230,390],
        [30,350,90,400],[90,400,160,340],[160,340,230,390],
        [30,350,60,500],[90,400,140,460],[160,340,140,460],[230,390,220,510],
        [60,500,140,460],[140,460,220,510],
      ].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(99,102,241,0.12)" strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}

export function AgentMemoryPanel({ memory, onModeToggle, mode }: AgentMemoryPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedClient, setSelectedClient] = useState<ClientMemory | null>(null);

  const tabs: { key: FilterTab; label: string; icon: string }[] = [
    { key: 'all',        label: '全部', icon: '◈' },
    { key: 'thought',    label: '想法', icon: '💭' },
    { key: 'preference', label: '喜好', icon: '💝' },
    { key: 'habit',      label: '习惯', icon: '🔄' },
    { key: 'recent',     label: '近况', icon: '📍' },
    { key: 'clients',    label: '客户', icon: '👥' },
  ];

  const filteredMemories = activeTab === 'all' || activeTab === 'clients'
    ? memory.memories
    : memory.memories.filter((m) => m.category === activeTab);

  if (selectedClient) {
    const latestClient = memory.clients.find(c => c.name === selectedClient.name) || selectedClient;
    return (
      <div className="ai-memory-panel">
        <NeuralNodes />
        <div className="ai-scan-line" />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <ClientDetailView client={latestClient} onBack={() => setSelectedClient(null)} />
          <button className="ai-mode-toggle" onClick={onModeToggle}>
            {mode === 'backoffice' ? '外勤' : '内勤'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-memory-panel">
      <NeuralNodes />
      <div className="ai-scan-line" />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div className="ai-memory-header">
          {/* Avatar with rotating ring */}
          <div className="ai-avatar-wrapper">
            <div className="ai-avatar-ring" />
            <div className="ai-avatar-ring-outer" />
            <div className="ai-avatar-inner">
              <span style={{ fontSize: 22 }}>🧑‍💼</span>
            </div>
          </div>

          {/* Agent info */}
          <div className="ai-agent-info">
            <div className="ai-agent-name">{memory.name}</div>
            <div className="ai-agent-meta">
              <span className="ai-agent-meta-chip">{memory.gender}</span>
              <span className="ai-agent-meta-chip">{memory.age}岁</span>
              <span className="ai-agent-meta-chip">{memory.location}</span>
            </div>
            {/* Status dots */}
            <div className="ai-agent-status">
              <span className="ai-status-dot" style={{ background: '#34D399', boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
              <span className="ai-status-text">AI 实时学习中</span>
            </div>
          </div>

          {/* Circular progress */}
          <CircularProgress value={memory.understandingLevel} />
        </div>

        {/* Profile grid */}
        <div className="ai-profile-grid">
          {[
            { icon: '🎓', text: memory.education },
            { icon: '📊', text: memory.performance },
            { icon: '📅', text: `入司 ${memory.joinDate}` },
            ...(memory.interests.length ? [{ icon: '⭐', text: memory.interests.join('、') }] : []),
            ...(memory.socialCircle ? [{ icon: '👥', text: memory.socialCircle }] : []),
            ...(memory.goals ? [{ icon: '🎯', text: memory.goals }] : []),
          ].map((row, i) => (
            <div key={i} className="ai-profile-row">
              <span className="ai-profile-icon">{row.icon}</span>
              <span className="ai-profile-text">{row.text}</span>
            </div>
          ))}
        </div>

        {/* Memory count bar */}
        <div className="ai-memory-stats">
          {Object.entries(categoryMeta).map(([key, meta]) => {
            const count = memory.memories.filter(m => m.category === key).length;
            return (
              <div key={key} className="ai-memory-stat-item" title={`${meta.label}: ${count}条`}>
                <div className="ai-memory-stat-bar">
                  <div
                    className="ai-memory-stat-fill"
                    style={{
                      height: `${Math.min(count * 20, 100)}%`,
                      background: meta.color,
                      boxShadow: `0 0 6px ${meta.glow}`,
                    }}
                  />
                </div>
                <div className="ai-memory-stat-icon">{meta.icon}</div>
                <div className="ai-memory-stat-count" style={{ color: meta.color }}>{count}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="ai-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`ai-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.key === 'clients' && memory.clients.length > 0 && (
                <span className="ai-tab-badge">{memory.clients.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="ai-memory-content">
          {activeTab === 'clients' ? (
            memory.clients.length === 0 ? (
              <div className="ai-memory-empty">暂无客户记忆</div>
            ) : (
              memory.clients.map((client) => (
                <ClientCard key={client.name} client={client} onClick={() => setSelectedClient(client)} />
              ))
            )
          ) : (
            filteredMemories.length === 0 ? (
              <div className="ai-memory-empty">
                {memory.understandingLevel <= 2 ? (
                  <div className="ai-memory-waiting">
                    <div className="ai-waiting-dots">
                      <span /><span /><span />
                    </div>
                    <div>等待AI对话收集记忆...</div>
                  </div>
                ) : '暂无此类记忆'}
              </div>
            ) : (
              filteredMemories.map((item) => (
                <MemoryItemCard key={item.id} item={item} />
              ))
            )
          )}
        </div>

        {/* Mode toggle */}
        <button className="ai-mode-toggle" onClick={onModeToggle}>
          {mode === 'backoffice' ? '外勤' : '内勤'}
        </button>
      </div>
    </div>
  );
}
