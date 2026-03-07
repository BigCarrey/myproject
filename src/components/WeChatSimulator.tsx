import { useRef, useEffect } from 'react';
import type { WeChatChatMessage, WeChatMoment, WeChatScreenshotHelper, WeChatNotification } from '../types';

interface WeChatSimulatorProps {
  currentView: 'home' | 'chat' | 'moments';
  chatMessages: WeChatChatMessage[];
  moments: WeChatMoment[];
  screenshotHelper: WeChatScreenshotHelper | null;
  notification: WeChatNotification | null;
  onSwitchView: (view: 'home' | 'chat' | 'moments') => void;
  onDismissNotification: () => void;
  onNotificationClick: () => void;
}

// ── Phone status bar ─────────────────────────────────────────────────────────
function PhoneStatusBar() {
  return (
    <div className="phone-status-bar">
      <span className="phone-status-time">10:32</span>
      <div className="phone-status-icons">
        <span>●●●</span>
        <span>WiFi</span>
        <span>🔋</span>
      </div>
    </div>
  );
}

// ── Phone Home Screen ─────────────────────────────────────────────────────────
const HOME_APPS = [
  { icon: '💬', name: '微信', color: '#07C160' },
  { icon: '📅', name: '日历', color: '#FF3B30' },
  { icon: '🎙️', name: '录音', color: '#FF9500' },
  { icon: '📝', name: '备忘录', color: '#FFD60A' },
  { icon: '📷', name: '相机', color: '#34C759' },
  { icon: '🖼️', name: '照片', color: '#5856D6' },
];

const HOME_DOCK = [
  { icon: '📞', name: '电话', color: '#34C759' },
  { icon: '✉️', name: '短信', color: '#32ADE6' },
];

function PhoneHomeScreen({ onOpenWeChat }: { onOpenWeChat: () => void }) {
  return (
    <div className="phone-home-screen">
      <PhoneStatusBar />
      <div className="phone-home-date">
        <div className="phone-home-weekday">星期一</div>
        <div className="phone-home-clock">10:32</div>
      </div>
      <div className="phone-home-apps-grid">
        {HOME_APPS.map((app) => (
          <button
            key={app.name}
            className="phone-home-app"
            onClick={app.name === '微信' ? onOpenWeChat : undefined}
          >
            <div className="phone-home-app-icon" style={{ background: app.color }}>
              {app.icon}
            </div>
            <div className="phone-home-app-name">{app.name}</div>
          </button>
        ))}
      </div>
      <div className="phone-home-dock">
        {HOME_DOCK.map((app) => (
          <button key={app.name} className="phone-home-app">
            <div className="phone-home-app-icon" style={{ background: app.color }}>
              {app.icon}
            </div>
            <div className="phone-home-app-name">{app.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── WeChat header ─────────────────────────────────────────────────────────────
function WeChatHeader({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack?: () => void }) {
  return (
    <div className="wechat-header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ fontSize: 16, color: '#000', opacity: 0.6, cursor: 'pointer' }} onClick={onBack}>‹</span>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#000' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 10, color: '#999' }}>{subtitle}</div>}
        </div>
        <span style={{ fontSize: 14, color: '#000', opacity: 0.5 }}>⋯</span>
      </div>
    </div>
  );
}

// ── WeChat nav tabs ───────────────────────────────────────────────────────────
function WeChatNavTabs({ currentView, onSwitch }: { currentView: 'home' | 'chat' | 'moments'; onSwitch: (v: 'chat' | 'moments') => void }) {
  return (
    <div className="wechat-nav-tabs">
      <button
        className={`wechat-nav-tab ${currentView === 'chat' ? 'active' : ''}`}
        onClick={() => onSwitch('chat')}
      >
        💬 聊天
      </button>
      <button
        className={`wechat-nav-tab ${currentView === 'moments' ? 'active' : ''}`}
        onClick={() => onSwitch('moments')}
      >
        📷 朋友圈
      </button>
    </div>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────────────────
function ChatBubble({ msg }: { msg: WeChatChatMessage }) {
  const isMe = msg.sender === 'xiaoli';
  const avatar = isMe ? '🧑‍💼' : '👤';
  const name = isMe ? '小李' : '王哥';

  return (
    <div className={`wechat-bubble-row ${isMe ? 'right' : 'left'}`}>
      {!isMe && <div className="wechat-avatar wangge">{avatar}</div>}
      <div style={{ maxWidth: '75%' }}>
        {!isMe && <div style={{ fontSize: 10, color: '#999', marginBottom: 2 }}>{name}</div>}
        {msg.contentType === 'file' ? (
          <div className="wechat-bubble file">
            <span style={{ fontSize: 20 }}>📄</span>
            <div>
              <div style={{ fontSize: 11, color: '#333', fontWeight: 500 }}>{msg.content.replace('[文件] ', '')}</div>
              <div style={{ fontSize: 9, color: '#999' }}>文件</div>
            </div>
          </div>
        ) : (
          <div className={`wechat-bubble ${isMe ? 'right' : 'left'}`}>
            {msg.content}
          </div>
        )}
        {msg.timestamp && <div style={{ fontSize: 9, color: '#bbb', marginTop: 2, textAlign: isMe ? 'right' : 'left' }}>{msg.timestamp}</div>}
      </div>
      {isMe && <div className="wechat-avatar xiaoli">{avatar}</div>}
    </div>
  );
}

// ── Moment post ───────────────────────────────────────────────────────────────
function MomentPost({ moment }: { moment: WeChatMoment }) {
  return (
    <div className="wechat-moment-item">
      <div className="wechat-moment-header">
        <div className="wechat-moment-avatar">{moment.avatar || '👤'}</div>
        <div className="wechat-moment-author">{moment.author}</div>
      </div>
      <div className="wechat-moment-content">{moment.content}</div>
      {moment.imageUrls && moment.imageUrls.length > 0 ? (
        <div className="wechat-moment-images">
          {moment.imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={moment.images?.[i] || `图片${i + 1}`}
              className="wechat-moment-img-placeholder"
              style={{ objectFit: 'cover' }}
              loading="lazy"
            />
          ))}
        </div>
      ) : moment.images && moment.images.length > 0 ? (
        <div className="wechat-moment-images">
          {moment.images.map((img, i) => (
            <div key={i} className="wechat-moment-img-placeholder">{img}</div>
          ))}
        </div>
      ) : null}
      <div className="wechat-moment-time">{moment.time}</div>
      {((moment.likes && moment.likes.length > 0) || (moment.comments && moment.comments.length > 0)) && (
        <div className="wechat-moment-interactions">
          {moment.likes && moment.likes.length > 0 && (
            <div className="wechat-moment-likes">❤️ {moment.likes.join('，')}</div>
          )}
          {moment.comments && moment.comments.map((c, i) => (
            <div key={i} className="wechat-moment-comment">
              <span className="wechat-moment-comment-author">{c.author}：</span>{c.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AI Input Method (keyboard + screenshot helper) ────────────────────────────
function AIInputMethod({ helper }: { helper: WeChatScreenshotHelper }) {
  const keys = [
    ['1', '2\nABC', '3\nDEF'],
    ['4\nGHI', '5\nJKL', '6\nMNO'],
    ['7\nPQRS', '8\nTUV', '9\nWXYZ'],
    ['符号', '0\n_', '⌫'],
  ];

  return (
    <div className="ai-input-method">
      {/* Input bar */}
      <div className="ai-input-bar">
        <span className="ai-input-bar-mic">🎤</span>
        <div className="ai-input-bar-field">
          <span className="ai-input-bar-cursor">|</span>
        </div>
        <span className="ai-input-bar-emoji">😊</span>
        <span className="ai-input-bar-plus">＋</span>
      </div>

      {/* Screenshot helper banner above keyboard */}
      <div className="ai-screenshot-banner">
        <div className="ai-screenshot-thumb">📸</div>
        <div className="ai-screenshot-label">截图已识别</div>
        <div className="ai-screenshot-arrow">截图帮回 →</div>
      </div>

      {/* AI Suggestion Panel */}
      <div className="ai-suggestion-panel">
        <div className="ai-suggestion-header">
          <div className="ai-suggestion-customer">
            <div className="ai-suggestion-avatar">👤</div>
            <span className="ai-suggestion-name">王哥</span>
            <span className="ai-suggestion-chevron">∨</span>
          </div>
          <button className="ai-suggestion-close">✕</button>
        </div>

        <div className="ai-suggestion-prompt">帮我回复截图里的问题</div>

        <div className="ai-suggestion-result">
          <div className="ai-suggestion-result-header">
            <span className="ai-suggestion-star">✦</span>
            <span>基于客户王哥建议您回复：</span>
            <span className="ai-suggestion-switch">切换客户 ›</span>
          </div>
          <div className="ai-suggestion-text">{helper.generatedReply}</div>
        </div>

        <div className="ai-suggestion-footer">
          <div className="ai-suggestion-stop">⏹ 停止回答</div>
        </div>
      </div>

      {/* Phone keyboard */}
      <div className="phone-keyboard">
        {keys.map((row, ri) => (
          <div key={ri} className="phone-keyboard-row">
            {row.map((key) => (
              <button key={key} className="phone-keyboard-key">
                {key.split('\n').map((part, i) => (
                  <span key={i} style={{ display: 'block', fontSize: i === 0 ? 14 : 9, lineHeight: 1.1 }}>
                    {part}
                  </span>
                ))}
              </button>
            ))}
          </div>
        ))}
        <div className="phone-keyboard-bottom">
          <button className="phone-keyboard-key phone-keyboard-key-sym">符号</button>
          <button className="phone-keyboard-key phone-keyboard-key-space">空格</button>
          <button className="phone-keyboard-key phone-keyboard-key-lang">中/英</button>
          <button className="phone-keyboard-key phone-keyboard-key-send">发送</button>
        </div>
      </div>
    </div>
  );
}

// ── Normal WeChat input bar ───────────────────────────────────────────────────
function WeChatInputBar() {
  return (
    <div className="wechat-input-bar">
      <span style={{ fontSize: 16 }}>🎤</span>
      <div className="wechat-input-field">输入消息...</div>
      <span style={{ fontSize: 16 }}>😊</span>
      <span style={{ fontSize: 16 }}>＋</span>
    </div>
  );
}

// ── WeChat notification toast ─────────────────────────────────────────────────
function WeChatNotificationToast({
  notification,
  onDismiss,
  onClick,
}: {
  notification: WeChatNotification;
  onDismiss: () => void;
  onClick: () => void;
}) {
  return (
    <div className="wechat-notification-toast animate-fade-in" onClick={onClick}>
      <div className="wechat-notification-icon">💬</div>
      <div className="wechat-notification-body">
        <div className="wechat-notification-sender">{notification.sender}</div>
        <div className="wechat-notification-preview">{notification.preview}</div>
      </div>
      <button
        className="wechat-notification-dismiss"
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
      >
        ✕
      </button>
    </div>
  );
}

// ── Main WeChatSimulator ──────────────────────────────────────────────────────
export function WeChatSimulator({
  currentView,
  chatMessages,
  moments,
  screenshotHelper,
  notification,
  onSwitchView,
  onDismissNotification,
  onNotificationClick,
}: WeChatSimulatorProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const showInputMethod = !!(screenshotHelper && screenshotHelper.visible);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: '#EDEDED' }}>
      {/* WeChat notification toast */}
      {notification && notification.visible && (
        <WeChatNotificationToast
          notification={notification}
          onDismiss={onDismissNotification}
          onClick={onNotificationClick}
        />
      )}

      {/* Home screen */}
      {currentView === 'home' && (
        <PhoneHomeScreen onOpenWeChat={() => onSwitchView('chat')} />
      )}

      {/* Chat / Moments view */}
      {currentView !== 'home' && (
        <>
          <WeChatHeader
            title={currentView === 'chat' ? '王哥' : '朋友圈'}
            subtitle={currentView === 'chat' ? '在线' : undefined}
            onBack={() => onSwitchView('home')}
          />
          <WeChatNavTabs currentView={currentView} onSwitch={onSwitchView} />

          {currentView === 'chat' ? (
            <>
              <div className={`wechat-chat-area ${showInputMethod ? 'wechat-chat-area-compressed' : ''}`}>
                {chatMessages.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 40 }}>
                    暂无消息
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <ChatBubble key={i} msg={msg} />
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Show AI input method OR normal input bar */}
              {showInputMethod ? (
                <AIInputMethod helper={screenshotHelper!} />
              ) : (
                <WeChatInputBar />
              )}
            </>
          ) : (
            <>
              <div className="wechat-moments-area">
                {moments.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 40 }}>
                    暂无朋友圈动态
                  </div>
                )}
                {moments.map((m, i) => (
                  <MomentPost key={i} moment={m} />
                ))}
              </div>
              <WeChatInputBar />
            </>
          )}
        </>
      )}
    </div>
  );
}
