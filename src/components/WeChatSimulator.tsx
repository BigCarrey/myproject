import { useRef, useEffect, useState } from 'react';
import type { WeChatChatMessage, WeChatMoment, WeChatScreenshotHelper, SmartKeyboardData, SmartKeyboardContentItem } from '../types/index';

interface WeChatSimulatorProps {
  currentView: 'chat' | 'moments';
  chatMessages: WeChatChatMessage[];
  moments: WeChatMoment[];
  screenshotHelper: WeChatScreenshotHelper | null;   // keep existing (for backward compat, may not be used)
  smartKeyboard: SmartKeyboardData | null;             // NEW
  showFloatBtn: boolean;                               // NEW
  onSwitchView: (view: 'chat' | 'moments') => void;
  onSendReply?: (text: string) => void;
  onReturnToAssistant?: () => void;                    // NEW - called when float btn clicked
  selfName?: string;
  contactName?: string;
}

/* ─── WeChat top status bar ─── */
function StatusBar() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  return (
    <div className="wc-status-bar">
      <span className="wc-status-time">{h}:{m}</span>
      <div className="wc-status-icons">
        <span>●●●</span>
        <span>WiFi</span>
        <span>🔋</span>
      </div>
    </div>
  );
}

/* ─── Chat header ─── */
function ChatHeader({ title }: { title: string }) {
  return (
    <div className="wc-chat-header">
      <button className="wc-back-btn">‹</button>
      <div className="wc-chat-header-title">{title}</div>
      <button className="wc-more-btn">⋯</button>
    </div>
  );
}

/* ─── Moments header ─── */
function MomentsHeader() {
  return (
    <div className="wc-moments-header">
      <div className="wc-moments-cover" />
      <div className="wc-moments-profile">
        <div className="wc-moments-avatar-large">王</div>
        <div className="wc-moments-name">王芳</div>
      </div>
    </div>
  );
}

/* ─── Bottom tab bar ─── */
function WeChatTabBar({ current, onSwitch }: { current: 'chat' | 'moments'; onSwitch: (v: 'chat' | 'moments') => void }) {
  const tabs = [
    { id: 'chat' as const, icon: '💬', label: '微信' },
    { id: 'moments' as const, icon: '📷', label: '朋友圈' },
    { id: 'contacts' as const, icon: '👥', label: '通讯录' },
    { id: 'me' as const, icon: '👤', label: '我' },
  ];
  return (
    <div className="wc-tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`wc-tab-item ${(tab.id === 'chat' || tab.id === 'moments') && current === tab.id ? 'active' : ''}`}
          onClick={() => {
            if (tab.id === 'chat' || tab.id === 'moments') onSwitch(tab.id);
          }}
        >
          <span className="wc-tab-icon">{tab.icon}</span>
          <span className="wc-tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Chat bubble ─── */
function ChatBubble({ msg, contactName }: { msg: WeChatChatMessage; contactName: string }) {
  const isMe = msg.sender === 'xiaoli' || msg.sender === 'self';
  const displayName = isMe ? '王芳' : (msg.senderName || contactName);
  const initial = displayName.charAt(0);
  const avatarBg = isMe ? '#07C160' : '#5B8DEF';

  return (
    <div className={`wc-bubble-row ${isMe ? 'wc-bubble-right' : 'wc-bubble-left'}`}>
      {!isMe && (
        <div className="wc-avatar-circle" style={{ background: avatarBg }}>
          {initial}
        </div>
      )}
      <div className="wc-bubble-body">
        {!isMe && <div className="wc-bubble-name">{displayName}</div>}
        {msg.contentType === 'file' ? (
          <div className="wc-bubble wc-bubble-file">
            <span style={{ fontSize: 20 }}>📄</span>
            <div>
              <div style={{ fontSize: 11, color: '#333', fontWeight: 500 }}>{msg.content.replace('[文件] ', '')}</div>
              <div style={{ fontSize: 9, color: '#999' }}>文件</div>
            </div>
          </div>
        ) : (
          <div className={`wc-bubble ${isMe ? 'wc-bubble-me' : 'wc-bubble-other'}`}>
            {msg.content}
          </div>
        )}
        {msg.timestamp && (
          <div className="wc-bubble-time" style={{ textAlign: isMe ? 'right' : 'left' }}>
            {msg.timestamp}
          </div>
        )}
      </div>
      {isMe && (
        <div className="wc-avatar-circle" style={{ background: avatarBg }}>
          {initial}
        </div>
      )}
    </div>
  );
}

/* ─── Moment post ─── */
function MomentPost({ moment }: { moment: WeChatMoment }) {
  const initial = moment.author.charAt(0);
  return (
    <div className="wc-moment-item">
      <div className="wc-moment-avatar">{initial}</div>
      <div className="wc-moment-content-col">
        <div className="wc-moment-author">{moment.author}</div>
        <div className="wc-moment-text">{moment.content}</div>
        {moment.imageUrls && moment.imageUrls.length > 0 ? (
          <div className="wc-moment-images">
            {moment.imageUrls.map((url, i) => (
              <img key={i} src={url} alt={`图片${i + 1}`} className="wc-moment-img" style={{ objectFit: 'cover' }} />
            ))}
          </div>
        ) : moment.images && moment.images.length > 0 ? (
          <div className="wc-moment-images">
            {moment.images.map((img, i) => (
              <div key={i} className="wc-moment-img-placeholder">{img}</div>
            ))}
          </div>
        ) : null}
        <div className="wc-moment-time">{moment.time}</div>
        {((moment.likes && moment.likes.length > 0) || (moment.comments && moment.comments.length > 0)) && (
          <div className="wc-moment-interactions">
            {moment.likes && moment.likes.length > 0 && (
              <div className="wc-moment-likes">❤️ {moment.likes.join('，')}</div>
            )}
            {moment.comments && moment.comments.map((c, i) => (
              <div key={i} className="wc-moment-comment">
                <span className="wc-moment-comment-author">{c.author}：</span>{c.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── AI helper panel (slides up from bottom) ─── */
function AIHelperPanel({
  helper,
  contactName,
  onSend,
  onDismiss,
}: {
  helper: WeChatScreenshotHelper;
  contactName: string;
  onSend: (text: string) => void;
  onDismiss: () => void;
}) {
  const initial = contactName.charAt(0);
  return (
    <div className="wc-ai-helper">
      {/* Header row */}
      <div className="wc-ai-helper-header">
        <span className="wc-ai-helper-title">✨ 截图给AI →</span>
        <button className="wc-ai-helper-close" onClick={onDismiss}>✕</button>
      </div>
      {/* Customer row */}
      <div className="wc-ai-helper-customer">
        <div className="wc-ai-helper-avatar">{initial}</div>
        <span className="wc-ai-helper-name">{contactName}</span>
        <span className="wc-ai-badge">✨ AI建议</span>
      </div>
      {/* Analysis summary */}
      {helper.analysis && (
        <div className="wc-ai-helper-analysis">{helper.analysis}</div>
      )}
      {/* Reply text */}
      <div className="wc-ai-helper-reply">{helper.generatedReply}</div>
      {/* Send button */}
      <button
        className="wc-ai-helper-send"
        onClick={() => onSend(helper.generatedReply)}
      >
        点击发送
      </button>
    </div>
  );
}

/* ─── Input bar ─── */
function WeChatInputBar({ onShowHelper }: { onShowHelper?: () => void }) {
  return (
    <div className="wc-input-bar">
      <button className="wc-input-icon">🎤</button>
      <div className="wc-input-field">输入消息...</div>
      <button className="wc-input-icon">😊</button>
      {onShowHelper && (
        <button className="wc-ai-screenshot-btn" onClick={onShowHelper}>
          ✨ 截图
        </button>
      )}
      <button className="wc-input-icon">＋</button>
    </div>
  );
}

/* ─── Content Keyboard (触客内容 card style) ─── */
function ContentKeyboard({ data, onSend }: { data: SmartKeyboardData; onSend: (text: string) => void }) {
  const items: SmartKeyboardContentItem[] = data.contentItems!;
  return (
    <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '10px 14px 8px',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
        }}
      >
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>📤 AI生成触客内容</div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10, marginTop: 2 }}>
          {data.analysis}
        </div>
      </div>

      {/* Content items */}
      <div style={{ padding: '8px 10px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 10,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #E0F2FE, #EDE9FE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1E293B' }}>{item.title}</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: '#0EA5E9',
                    background: '#E0F2FE',
                    borderRadius: 4,
                    padding: '1px 5px',
                  }}
                >
                  {item.tag}
                </span>
              </div>
              <div style={{ fontSize: 10, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.desc}
              </div>
            </div>
            {/* Number badge */}
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* AI forwarding script */}
      <div style={{ padding: '8px 10px 10px' }}>
        <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4, fontWeight: 500 }}>
          📝 AI生成转发话术：
        </div>
        <div
          style={{
            fontSize: 11,
            color: '#334155',
            lineHeight: 1.55,
            background: '#F1F5F9',
            borderRadius: 8,
            padding: '7px 10px',
            marginBottom: 8,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          "{data.recommendedScript}"
        </div>
        <button
          onClick={() => onSend(data.recommendedScript)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            border: 'none',
            borderRadius: 10,
            padding: '9px 0',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          一键发送
        </button>
      </div>
    </div>
  );
}

/* ─── Smart Keyboard ─── */
function SmartKeyboard({
  data,
  onSend,
  onDismiss: _onDismiss,
}: {
  data: SmartKeyboardData;
  onSend: (text: string) => void;
  onDismiss: () => void;
}) {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'ready'>('idle');

  // Auto-start analyzing when component mounts if data is provided
  useEffect(() => {
    setStatus('analyzing');
    const t = setTimeout(() => setStatus('ready'), 2000);
    return () => clearTimeout(t);
  }, []);

  const screenshotBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    padding: '0 8px',
    height: 32,
    borderRadius: 6,
    border: 'none',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    background: status === 'idle'
      ? '#e0e0e0'
      : 'linear-gradient(135deg, #3B82F6, #6366F1)',
    color: status === 'idle' ? '#555' : '#fff',
    boxShadow: status !== 'idle'
      ? '0 0 8px rgba(59,130,246,0.6)'
      : 'none',
    animation: status === 'analyzing' ? 'pulse 1.2s ease-in-out infinite' : 'none',
  };

  const inputRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    height: 52,
    minHeight: 52,
    padding: '0 10px',
    background: '#ededed',
    flexShrink: 0,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* AI panel — stacked above input row */}
      {status !== 'idle' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            borderRadius: '16px 16px 0 0',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {status === 'analyzing' && (
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500, marginBottom: 10 }}>
                🔍 AI正在分析截图中...
              </div>
              {/* Shimmer progress bar */}
              <div
                style={{
                  width: '100%',
                  height: 6,
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '40%',
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(59,130,246,0.9), transparent)',
                    animation: 'shimmer 1.4s ease-in-out infinite',
                  }}
                />
              </div>
              <style>{`
                @keyframes shimmer {
                  0% { transform: translateX(-150%); }
                  100% { transform: translateX(350%); }
                }
                @keyframes pulse {
                  0%, 100% { box-shadow: 0 0 6px rgba(59,130,246,0.5); }
                  50% { box-shadow: 0 0 14px rgba(99,102,241,0.9); }
                }
              `}</style>
            </div>
          )}

          {status === 'ready' && data.contentItems && data.contentItems.length > 0 && (
            <ContentKeyboard data={data} onSend={onSend} />
          )}
          {status === 'ready' && (!data.contentItems || data.contentItems.length === 0) && (
            <div>
              {/* Header */}
              <div
                style={{
                  padding: '10px 14px 8px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>✨ AI识别结果</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 3 }}>
                  识别到: {data.analysis}
                </div>
              </div>
              {/* Script section */}
              <div style={{ padding: '10px 14px 14px' }}>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 6 }}>💬 推荐话术</div>
                <div
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: 12,
                  }}
                >
                  "{data.recommendedScript}"
                </div>
                <button
                  onClick={() => onSend(data.recommendedScript)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: 12,
                    padding: '10px 0',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                  }}
                >
                  发 送 话 术
                </button>
              </div>
              <style>{`
                @keyframes pulse {
                  0%, 100% { box-shadow: 0 0 6px rgba(59,130,246,0.5); }
                  50% { box-shadow: 0 0 14px rgba(99,102,241,0.9); }
                }
              `}</style>
            </div>
          )}
        </div>
      )}

      {/* Input row */}
      <div style={inputRowStyle}>
        <button className="wc-input-icon">🎤</button>
        <div className="wc-input-field" style={{ flex: 1 }}>输入消息...</div>
        <button style={screenshotBtnStyle} onClick={() => {}}>
          📸 截屏{status !== 'idle' ? '✨' : ''}
        </button>
        <button className="wc-input-icon">😊</button>
        <button className="wc-input-icon">＋</button>
      </div>
    </div>
  );
}

/* ─── Floating return button ─── */
function FloatingReturnBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: 52,  // below status bar
        right: 10,
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'rgba(29, 78, 216, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(255,255,255,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(29,78,216,0.4)',
      }}
      title="返回万能营销"
    >
      <span style={{ fontSize: 16 }}>🏠</span>
    </button>
  );
}

/* ─── Main component ─── */
export function WeChatSimulator({
  currentView,
  chatMessages,
  moments,
  screenshotHelper,
  smartKeyboard,
  showFloatBtn,
  onSwitchView,
  onSendReply,
  onReturnToAssistant,
  contactName,
}: WeChatSimulatorProps) {
  // Derive contact name dynamically from messages
  const resolvedContactName = contactName || (() => {
    const otherMsg = chatMessages.find((m) => m.sender !== 'xiaoli' && m.sender !== 'self');
    return otherMsg?.senderName || '陈先生';
  })();

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSendReply = (text: string) => {
    if (onSendReply) onSendReply(text);
  };

  return (
    <div className="wc-root">
      <StatusBar />

      {currentView === 'chat' ? (
        <>
          <ChatHeader title={resolvedContactName} />
          <div className="wc-chat-area">
            {chatMessages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 40 }}>
                暂无消息
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} contactName={resolvedContactName} />
            ))}
            <div ref={chatEndRef} />
          </div>
        </>
      ) : (
        <>
          <MomentsHeader />
          <div className="wc-moments-area">
            {moments.length === 0 && (
              <div style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 40 }}>
                暂无朋友圈动态
              </div>
            )}
            {moments.map((m, i) => (
              <MomentPost key={i} moment={m} />
            ))}
          </div>
        </>
      )}

      {/* Smart Keyboard OR regular input bar (only in chat view) */}
      {currentView === 'chat' && (
        smartKeyboard ? (
          <SmartKeyboard
            data={smartKeyboard}
            onSend={(text) => {
              onSendReply?.(text);
            }}
            onDismiss={() => {}}
          />
        ) : (
          <WeChatInputBar />
        )
      )}

      {/* Bottom tab bar */}
      <WeChatTabBar current={currentView} onSwitch={onSwitchView} />

      {/* AI Helper panel — slides up from bottom (backward compat) */}
      {screenshotHelper && screenshotHelper.visible && (
        <AIHelperPanel
          helper={screenshotHelper}
          contactName={resolvedContactName}
          onSend={handleSendReply}
          onDismiss={() => {/* dismissed via wechatEvent from scenario */}}
        />
      )}

      {/* Float return button */}
      {showFloatBtn && onReturnToAssistant && (
        <FloatingReturnBtn onClick={onReturnToAssistant} />
      )}
    </div>
  );
}
