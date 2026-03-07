import type { AgentMemoryField } from '../types';

interface AgentMemoryPanelProps {
  fields: AgentMemoryField[];
}

export function AgentMemoryPanel({ fields }: AgentMemoryPanelProps) {
  const staticFields = fields.filter((f) => f.category === 'static');
  const dynamicFields = fields.filter((f) => f.category === 'dynamic');
  const customerFields = fields.filter((f) => f.category === 'customer');

  return (
    <div className="memory-panel">
      <div className="memory-header">
        <div className="memory-avatar">🧠</div>
        <div>
          <div className="memory-title">代理人记忆</div>
          <div className="memory-subtitle">Agent Memory</div>
        </div>
      </div>

      {/* Static Profile */}
      <div className="memory-section">
        <div className="memory-section-label">📋 基础画像</div>
        <div className="memory-fields">
          {staticFields.map((field, i) => (
            <div key={i} className="memory-field">
              <span className="memory-field-icon">{field.icon}</span>
              <span className="memory-field-label">{field.label}</span>
              <span className="memory-field-value">{field.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Fields - collected through conversation */}
      {dynamicFields.length > 0 && (
        <div className="memory-section">
          <div className="memory-section-label">💡 深度洞察</div>
          <div className="memory-fields">
            {dynamicFields.map((field, i) => (
              <div
                key={`dynamic-${i}`}
                className="memory-field memory-field-dynamic animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="memory-field-icon">{field.icon}</span>
                <span className="memory-field-label">{field.label}</span>
                <span className="memory-field-value">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Notes */}
      {customerFields.length > 0 && (
        <div className="memory-section">
          <div className="memory-section-label">👤 客户档案</div>
          <div className="memory-fields">
            {customerFields.map((field, i) => (
              <div
                key={`customer-${i}`}
                className="memory-field memory-field-customer animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="memory-field-icon">{field.icon}</span>
                <span className="memory-field-label">{field.label}</span>
                <span className="memory-field-value">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {dynamicFields.length === 0 && customerFields.length === 0 && (
        <div className="memory-empty-hint">
          <div className="memory-empty-icon">💬</div>
          <div className="memory-empty-text">通过AI对话收集更多信息</div>
          <div className="memory-empty-text">记忆将实时更新...</div>
        </div>
      )}
    </div>
  );
}
