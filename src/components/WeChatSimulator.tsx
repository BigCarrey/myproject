import { useRef, useEffect, useState } from 'react';
import type { WeChatChatMessage, WeChatMoment, WeChatScreenshotHelper, SmartKeyboardData } from '../types/index';

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
function ChatHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="wc-chat-header">
      <button className="wc-back-btn" onClick={onBack}>‹</button>
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

/* ─── Smart Keyboard ─── */
function SmartKeyboard({
  data,
  onSend,
  onDismiss,
}: {
  data: SmartKeyboardData;
  onSend: (text: string) => void;
  onDismiss: () => void;
}) {
  const [status, setStatus] = useState<'keyboard' | 'analyzing' | 'ready'>(
    data.skipAnalyzing ? 'ready' : 'keyboard'
  );

  // Reset to keyboard state whenever new data arrives (safety net for reuse without remount)
  useEffect(() => {
    setStatus(data.skipAnalyzing ? 'ready' : 'keyboard');
  }, [data]);

  const handleAISuggest = () => {
    if (status !== 'keyboard') return;
    setStatus('analyzing');
    setTimeout(() => setStatus('ready'), 2000);
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
    background: '#e0e0e0',
    color: '#555',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
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

      {/* Input row */}
      <div style={inputRowStyle}>
        <button className="wc-input-icon">🎤</button>
        <div className="wc-input-field" style={{ flex: 1 }}>输入消息...</div>
        <button style={screenshotBtnStyle}>
          📸 截屏
        </button>
        <button className="wc-input-icon">😊</button>
        <button className="wc-input-icon">＋</button>
      </div>

      {/* Keyboard panel (idle state) */}
      {status === 'keyboard' && (
        <div style={{ background: '#d1d5db', flexShrink: 0 }}>
          {/* AI input helper bar */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>✨ AI 输入助手</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 }}>点击获取智能回复建议</div>
            </div>
            <button
              onClick={handleAISuggest}
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                borderRadius: 20,
                padding: '7px 18px',
                cursor: 'pointer',
                letterSpacing: '0.03em',
                boxShadow: '0 2px 8px rgba(59,130,246,0.5)',
              }}
            >
              AI 建议
            </button>
          </div>

          {/* Toolbar row */}
          <div
            style={{
              background: '#aaafb8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 6,
              padding: '4px 8px',
            }}
          >
            {['A', '✦', '▣', '🎤', '˅'].map((icon, i) => (
              <button
                key={i}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: 'none',
                  background: 'rgba(255,255,255,0.5)',
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* QWERTY rows */}
          {[
            ['Q','W','E','R','T','Y','U','I','O','P'],
            ['A','S','D','F','G','H','J','K','L'],
            ['⇧','Z','X','C','V','B','N','M','⌫'],
          ].map((row, ri) => (
            <div
              key={ri}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 5,
                padding: ri === 0 ? '8px 4px 4px' : '4px',
              }}
            >
              {row.map((key) => (
                <button
                  key={key}
                  style={{
                    flex: (key === '⇧' || key === '⌫') ? '1.5 1 0' : '1 1 0',
                    minWidth: 0,
                    height: 40,
                    borderRadius: 5,
                    border: 'none',
                    background: (key === '⇧' || key === '⌫') ? '#aaafb8' : '#fff',
                    fontSize: key.length > 1 ? 14 : 15,
                    fontWeight: 500,
                    cursor: 'pointer',
                    boxShadow: '0 1px 0 rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          {/* Bottom row */}
          <div style={{ display: 'flex', gap: 5, padding: '4px 4px 10px' }}>
            {[
              { label: '123', flex: 1.4 },
              { label: '😊', flex: 1 },
              { label: ',', flex: 1 },
              { label: '', flex: 4, isSpace: true },
              { label: '中/英', flex: 1.4 },
              { label: '发送', flex: 1.4, isPrimary: true },
            ].map((k, i) => (
              <button
                key={i}
                style={{
                  flex: k.flex,
                  height: 40,
                  borderRadius: 5,
                  border: 'none',
                  background: k.isPrimary
                    ? '#3B82F6'
                    : k.isSpace
                    ? '#fff'
                    : '#aaafb8',
                  color: k.isPrimary ? '#fff' : '#000',
                  fontSize: 13,
                  fontWeight: k.isPrimary ? 700 : 400,
                  cursor: 'pointer',
                  boxShadow: '0 1px 0 rgba(0,0,0,0.3)',
                }}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Analyzing / Ready: AI panel */}
      {(status === 'analyzing' || status === 'ready') && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {status === 'analyzing' && (
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500, marginBottom: 10 }}>
                🔍 {data.analyzingText || 'AI正在分析中...'}
              </div>
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
            </div>
          )}

          {status === 'ready' && (
            <div>
              <div
                style={{
                  padding: '10px 14px 8px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{data.headerTitle || '✨ AI识别结果'}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 3 }}>
                  {data.headerTitle ? data.analysis : `识别到: ${data.analysis}`}
                </div>
              </div>
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
            </div>
          )}
        </div>
      )}
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
          <ChatHeader title={resolvedContactName} onBack={onReturnToAssistant} />
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
            key={smartKeyboard.analysis}
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
