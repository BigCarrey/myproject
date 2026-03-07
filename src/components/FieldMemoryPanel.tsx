import { MessageBubble } from './MessageBubble';
import type { Message, MessageContentType } from '../types';

const MEMORY_TYPES: MessageContentType[] = [
  'field-ai-analysis',
  'field-customer-profile',
  'field-needs-analysis',
  'field-gap-diagnosis',
  'field-product-plans',
  'field-commission',
];

interface FieldMemoryPanelProps {
  messages: Message[];
  onSpeak: (text: string) => void;
}

export function FieldMemoryPanel({ messages, onSpeak }: FieldMemoryPanelProps) {
  // Get the most recent instance of each memory type
  const memoryMessages = MEMORY_TYPES
    .map(type => {
      const msgs = messages.filter(m => m.type === type);
      return msgs.length > 0 ? msgs[msgs.length - 1] : null;
    })
    .filter((m): m is Message => m !== null);

  return (
    <div className="field-memory-panel">
      {memoryMessages.length === 0 ? (
        <div className="field-memory-empty">
          <div className="field-memory-empty-icon">🧠</div>
          <div className="field-memory-empty-title">代理人记忆</div>
          <div className="field-memory-empty-desc">
            对话开始后，AI将自动分析客户信息<br />洞察结果将实时展示在此处
          </div>
          <div className="field-memory-empty-hints">
            <div className="field-memory-hint-item">
              <span className="field-memory-hint-icon">👤</span>
              <span>客户画像</span>
            </div>
            <div className="field-memory-hint-item">
              <span className="field-memory-hint-icon">🔍</span>
              <span>需求解析</span>
            </div>
            <div className="field-memory-hint-item">
              <span className="field-memory-hint-icon">🛡️</span>
              <span>缺口诊断</span>
            </div>
            <div className="field-memory-hint-item">
              <span className="field-memory-hint-icon">📦</span>
              <span>产品匹配</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="field-memory-content">
          {memoryMessages.map(msg => (
            <MessageBubble key={msg.id} message={msg} onSpeak={onSpeak} />
          ))}
        </div>
      )}
    </div>
  );
}
