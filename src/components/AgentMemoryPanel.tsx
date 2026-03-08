import { useState } from 'react';
import type { AgentMemoryField } from '../types';

interface AgentMemoryPanelProps {
  fields: AgentMemoryField[];
  syncRate: number;
}

const categoryConfig: Record<string, { color: string; bg: string; label: string }> = {
  喜好: { color: '#7C3AED', bg: 'rgba(124,58,237,0.06)', label: '喜好' },
  社交圈: { color: '#2563EB', bg: 'rgba(37,99,235,0.06)', label: '圈子' },
  目标: { color: '#059669', bg: 'rgba(5,150,105,0.06)', label: '目标' },
  挑战: { color: '#DC2626', bg: 'rgba(220,38,38,0.06)', label: '挑战' },
  客户: { color: '#9333EA', bg: 'rgba(147,51,234,0.06)', label: '客户' },
  新增潜在客户: { color: '#F59E0B', bg: 'rgba(245,158,11,0.06)', label: '新客户' },
  面谈预约: { color: '#3B82F6', bg: 'rgba(59,130,246,0.06)', label: '日程' },
  王哥爱好: { color: '#7C3AED', bg: 'rgba(124,58,237,0.06)', label: '客户喜好' },
  王哥家庭: { color: '#9333EA', bg: 'rgba(147,51,234,0.06)', label: '客户家庭' },
  王哥健康: { color: '#EF4444', bg: 'rgba(239,68,68,0.06)', label: '客户健康' },
};

function getConfig(label: string, category: string) {
  if (categoryConfig[label]) return categoryConfig[label];
  if (category === 'customer') return { color: '#7C3AED', bg: 'rgba(124,58,237,0.06)', label: label };
  return { color: '#3B82F6', bg: 'rgba(59,130,246,0.06)', label: label };
}

export function AgentMemoryPanel({ fields, syncRate }: AgentMemoryPanelProps) {
  const [viewMode, setViewMode] = useState<'agent' | 'client-detail'>('agent');
  const [selectedClient, setSelectedClient] = useState<AgentMemoryField | null>(null);

  const staticFields = fields.filter((f) => f.category === 'static');
  const dynamicFields = fields.filter((f) => f.category === 'dynamic');
  const customerFields = fields.filter((f) => f.category === 'customer');
  const isBuilding = syncRate < 100;
  const allDynamic = [...dynamicFields, ...customerFields];

  const handleClientClick = (field: AgentMemoryField) => {
    if (field.clientId) {
      setSelectedClient(field);
      setViewMode('client-detail');
    }
  };

  const handleBack = () => {
    setViewMode('agent');
    setSelectedClient(null);
  };

  // ===== Client Detail View =====
  if (viewMode === 'client-detail' && selectedClient) {
    return (
      <div className="memory-panel">
        {/* Back button */}
        <button className="memory-back-btn" onClick={handleBack}>
          <span className="memory-back-arrow">&larr;</span>
          <span>返回代理人记忆</span>
        </button>

        {/* Client header */}
        <div className="memory-client-header">
          <div className="memory-client-avatar">
            {selectedClient.value.charAt(0)}
          </div>
          <div>
            <div className="memory-client-name">{selectedClient.value}</div>
            <div className="memory-client-tag">潜在客户</div>
          </div>
        </div>

        {/* Client narrative */}
        {selectedClient.narrative && (
          <div className="memory-client-narrative">
            <span className="memory-client-narrative-icon">💡</span>
            <span>{selectedClient.narrative}</span>
          </div>
        )}

        {/* Sub-fields */}
        {selectedClient.subFields && selectedClient.subFields.length > 0 && (
          <div className="memory-cards">
            <div className="memory-section-label">客户档案</div>
            {selectedClient.subFields.map((sf, i) => (
              <div
                key={`sf-${i}`}
                className="memory-card animate-fade-in-up"
                style={{
                  background: 'rgba(147,51,234,0.04)',
                  borderLeft: '3px solid #9333EA',
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="memory-card-header">
                  <span className="memory-card-icon">{sf.icon}</span>
                  <span className="memory-card-tag" style={{ color: '#9333EA' }}>
                    {sf.label}
                  </span>
                </div>
                <div className="memory-card-value">{sf.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Related memory from main fields */}
        {(() => {
          const relatedFields = fields.filter(
            (f) => f.category === 'customer' && f.clientId === selectedClient.clientId && f !== selectedClient
          );
          if (relatedFields.length === 0) return null;
          return (
            <div className="memory-cards" style={{ marginTop: 8 }}>
              <div className="memory-section-label">动态更新</div>
              {relatedFields.map((rf, i) => {
                const cfg = getConfig(rf.label, rf.category);
                return (
                  <div
                    key={`rf-${i}`}
                    className="memory-card animate-fade-in-up"
                    style={{
                      background: cfg.bg,
                      borderLeft: `3px solid ${cfg.color}`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  >
                    <div className="memory-card-header">
                      <span className="memory-card-icon">{rf.icon}</span>
                      <span className="memory-card-tag" style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                    {rf.narrative ? (
                      <div className="memory-card-narrative">{rf.narrative}</div>
                    ) : (
                      <div className="memory-card-value">{rf.value}</div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    );
  }

  // ===== Agent Memory View (default) =====
  return (
    <div className="memory-panel">
      {/* Header: brain icon + title */}
      <div className="memory-header">
        <div className="memory-brain-icon">🧠</div>
        <div>
          <div className="memory-title">代理人记忆</div>
          <div className="memory-subtitle">Agent Memory</div>
        </div>
      </div>

      {/* Sync rate bar */}
      <div className="memory-sync-bar-wrap">
        <div className="memory-sync-label">
          <span>了解度</span>
          <span className="memory-sync-pct">{syncRate}%</span>
        </div>
        <div className="memory-sync-track">
          <div
            className="memory-sync-fill"
            style={{ width: `${syncRate}%` }}
          />
        </div>
      </div>

      {/* Static profile - compact chips */}
      <div className="memory-profile-chips">
        {staticFields.map((f, i) => (
          <div key={i} className="memory-chip">
            <span className="memory-chip-icon">{f.icon}</span>
            <span className="memory-chip-text">{f.value}</span>
          </div>
        ))}
      </div>

      {/* Dynamic memory cards */}
      {allDynamic.length > 0 ? (
        <div className="memory-cards">
          {allDynamic.map((field, i) => {
            const cfg = getConfig(field.label, field.category);
            const isClickable = !!field.clientId;
            return (
              <div
                key={`mem-${i}`}
                className={`memory-card animate-fade-in-up ${isClickable ? 'memory-card-clickable' : ''}`}
                style={{
                  background: cfg.bg,
                  borderLeft: `3px solid ${cfg.color}`,
                  animationDelay: `${i * 0.08}s`,
                }}
                onClick={isClickable ? () => handleClientClick(field) : undefined}
              >
                <div className="memory-card-header">
                  <span className="memory-card-icon">{field.icon}</span>
                  <span className="memory-card-tag" style={{ color: cfg.color }}>
                    {cfg.label}
                  </span>
                  {isClickable && (
                    <span className="memory-card-arrow">&rsaquo;</span>
                  )}
                </div>
                {field.narrative ? (
                  <div className="memory-card-narrative">{field.narrative}</div>
                ) : (
                  <div className="memory-card-value">{field.value}</div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="memory-empty-state">
          <div className="memory-empty-dots">
            <span /><span /><span />
          </div>
          <div className="memory-empty-text">
            {isBuilding ? '通过对话，我会越来越了解你……' : '开始对话，构建你的分身记忆'}
          </div>
        </div>
      )}
    </div>
  );
}
