import { useState } from 'react';
import type { AgentMemory, ClientMemory, MemoryItem } from '../types';

interface AgentMemoryPanelProps {
  memory: AgentMemory;
  onModeToggle: () => void;
  mode: 'backoffice' | 'field';
}

const categoryMeta: Record<string, { label: string; icon: string; color: string }> = {
  thought: { label: '想法', icon: '💭', color: '#8B5CF6' },
  preference: { label: '喜好', icon: '💝', color: '#EC4899' },
  habit: { label: '习惯', icon: '🔄', color: '#06B6D4' },
  recent: { label: '近况', icon: '📍', color: '#10B981' },
  'client-update': { label: '客户', icon: '👥', color: '#F59E0B' },
};

function MemoryItemCard({ item }: { item: MemoryItem }) {
  const meta = categoryMeta[item.category] || categoryMeta.recent;
  return (
    <div
      className={`memory-item-card ${item.isNew ? 'memory-item-new' : ''}`}
      style={{ borderLeft: `3px solid ${meta.color}` }}
    >
      <div className="memory-item-category" style={{ color: meta.color }}>
        {meta.icon} {meta.label}
      </div>
      <div className="memory-item-content">{item.content}</div>
    </div>
  );
}

function ClientCard({ client, onClick }: { client: ClientMemory; onClick: () => void }) {
  const statusMap: Record<string, { label: string; color: string }> = {
    potential: { label: '潜在客户', color: '#F59E0B' },
    active: { label: '活跃客户', color: '#10B981' },
    closed: { label: '已成交', color: '#3B82F6' },
  };
  const status = statusMap[client.status] || statusMap.potential;

  return (
    <button className="client-card" onClick={onClick}>
      <div className="client-card-avatar">{client.avatar}</div>
      <div className="client-card-info">
        <div className="client-card-name">{client.name}</div>
        <div className="client-card-reason">{client.addedReason}</div>
      </div>
      <span className="client-card-status" style={{ background: status.color }}>
        {status.label}
      </span>
      <span className="client-card-arrow">›</span>
    </button>
  );
}

function ClientDetailView({ client, onBack }: { client: ClientMemory; onBack: () => void }) {
  return (
    <div className="client-detail-view">
      <button className="client-detail-back" onClick={onBack}>
        ‹ 返回代理人记忆
      </button>
      <div className="client-detail-header">
        <div className="client-detail-avatar">{client.avatar}</div>
        <div>
          <div className="client-detail-name">{client.name}</div>
          <div className="client-detail-status">{client.status === 'potential' ? '潜在客户' : client.status === 'active' ? '活跃客户' : '已成交'}</div>
        </div>
      </div>

      {Object.keys(client.profile).length > 0 && (
        <div className="client-detail-profile">
          <div className="client-detail-section-title">📋 客户画像</div>
          {Object.entries(client.profile).map(([key, val]) => (
            <div key={key} className="client-detail-profile-row">
              <span className="client-detail-profile-key">{key}</span>
              <span className="client-detail-profile-val">{val}</span>
            </div>
          ))}
        </div>
      )}

      {client.memories.length > 0 && (
        <div className="client-detail-memories">
          <div className="client-detail-section-title">🧠 客户记忆</div>
          {client.memories.map((m) => (
            <MemoryItemCard key={m.id} item={m} />
          ))}
        </div>
      )}

      {client.memories.length === 0 && (
        <div className="client-detail-empty">暂无客户记忆，AI将在互动中持续收集</div>
      )}
    </div>
  );
}

type FilterTab = 'all' | 'thought' | 'preference' | 'habit' | 'recent' | 'clients';

export function AgentMemoryPanel({ memory, onModeToggle, mode }: AgentMemoryPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedClient, setSelectedClient] = useState<ClientMemory | null>(null);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'thought', label: '想法' },
    { key: 'preference', label: '喜好' },
    { key: 'habit', label: '习惯' },
    { key: 'recent', label: '近况' },
    { key: 'clients', label: '客户' },
  ];

  const filteredMemories = activeTab === 'all' || activeTab === 'clients'
    ? memory.memories
    : memory.memories.filter((m) => m.category === activeTab);

  if (selectedClient) {
    // Find the latest version of this client from memory
    const latestClient = memory.clients.find(c => c.name === selectedClient.name) || selectedClient;
    return (
      <div className="memory-panel">
        <ClientDetailView client={latestClient} onBack={() => setSelectedClient(null)} />
        <button className="mode-toggle-tab" onClick={onModeToggle} title="切换到内勤场景">
          {mode === 'backoffice' ? '外勤' : '内勤'}
        </button>
      </div>
    );
  }

  return (
    <div className="memory-panel">
      {/* Header */}
      <div className="memory-panel-header">
        <div className="memory-panel-avatar">
          <span className="memory-panel-avatar-icon">🧑‍💼</span>
        </div>
        <div className="memory-panel-agent-info">
          <div className="memory-panel-agent-name">{memory.name}</div>
          <div className="memory-panel-agent-meta">
            {memory.gender} · {memory.age}岁 · {memory.location}
          </div>
        </div>
        <div className="memory-panel-understanding">
          <div className="memory-panel-understanding-label">了解度</div>
          <div className="memory-panel-understanding-value">{memory.understandingLevel}%</div>
          <div className="memory-panel-understanding-bar">
            <div
              className="memory-panel-understanding-fill"
              style={{ width: `${memory.understandingLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Static profile */}
      <div className="memory-panel-profile">
        <div className="memory-panel-profile-row">
          <span className="memory-panel-profile-icon">🎓</span>
          <span>{memory.education}</span>
        </div>
        <div className="memory-panel-profile-row">
          <span className="memory-panel-profile-icon">📊</span>
          <span>{memory.performance}</span>
        </div>
        <div className="memory-panel-profile-row">
          <span className="memory-panel-profile-icon">📅</span>
          <span>入司 {memory.joinDate}</span>
        </div>
        {memory.interests.length > 0 && (
          <div className="memory-panel-profile-row">
            <span className="memory-panel-profile-icon">⭐</span>
            <span>{memory.interests.join('、')}</span>
          </div>
        )}
        {memory.socialCircle && (
          <div className="memory-panel-profile-row">
            <span className="memory-panel-profile-icon">👥</span>
            <span>{memory.socialCircle}</span>
          </div>
        )}
        {memory.goals && (
          <div className="memory-panel-profile-row">
            <span className="memory-panel-profile-icon">🎯</span>
            <span>{memory.goals}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="memory-panel-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`memory-panel-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.key === 'clients' && memory.clients.length > 0 && (
              <span className="memory-panel-tab-badge">{memory.clients.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="memory-panel-content">
        {activeTab === 'clients' ? (
          <>
            {memory.clients.length === 0 ? (
              <div className="memory-panel-empty">暂无客户记忆</div>
            ) : (
              memory.clients.map((client) => (
                <ClientCard
                  key={client.name}
                  client={client}
                  onClick={() => setSelectedClient(client)}
                />
              ))
            )}
          </>
        ) : (
          <>
            {filteredMemories.length === 0 ? (
              <div className="memory-panel-empty">
                {memory.understandingLevel <= 2
                  ? '等待AI对话收集记忆...'
                  : '暂无此类记忆'}
              </div>
            ) : (
              filteredMemories.map((item) => (
                <MemoryItemCard key={item.id} item={item} />
              ))
            )}
          </>
        )}
      </div>

      {/* Mode toggle */}
      <button className="mode-toggle-tab" onClick={onModeToggle} title="切换到内勤场景">
        {mode === 'backoffice' ? '外勤' : '内勤'}
      </button>
    </div>
  );
}
