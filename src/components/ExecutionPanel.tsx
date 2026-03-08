import { useEffect, useRef } from 'react';
import type {
  ExecutionTab,
  WeChatChatMessage,
  WeChatMoment,
  WeChatScreenshotHelper,
  CalendarEntry,
  TranscriptItem,
  ExecutionNotification,
  IMEState,
} from '../types';

interface ExecutionPanelProps {
  activeTab: ExecutionTab;
  onSwitchTab: (tab: ExecutionTab) => void;
  // WeChat Chat
  chatMessages: WeChatChatMessage[];
  screenshotHelper: WeChatScreenshotHelper | null;
  // Moments
  moments: WeChatMoment[];
  // Calendar
  calendarEntries: CalendarEntry[];
  // Recording
  isRecording: boolean;
  recordingDuration: number;
  transcriptItems: TranscriptItem[];
  // Notification
  notification: ExecutionNotification | null;
  onNotificationClick: (notification: ExecutionNotification) => void;
  onDismissNotification: () => void;
  // IME
  imeState: IMEState | null;
  onIMEScreenshotHelp?: () => void;
  onIMESendReply?: (text: string) => void;
}

const tabs: { key: ExecutionTab; icon: string; label: string }[] = [
  { key: 'chat', icon: '💬', label: '微信聊天' },
  { key: 'moments', icon: '📷', label: '朋友圈' },
  { key: 'calendar', icon: '📅', label: '日历' },
  { key: 'recording', icon: '🎙️', label: '录音' },
];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/* 9-key keyboard layout */
const KEY_ROWS = [
  [
    { main: '1', sub: '' },
    { main: '2', sub: 'ABC' },
    { main: '3', sub: 'DEF' },
  ],
  [
    { main: '4', sub: 'GHI' },
    { main: '5', sub: 'JKL' },
    { main: '6', sub: 'MNO' },
  ],
  [
    { main: '7', sub: 'PQRS' },
    { main: '8', sub: 'TUV' },
    { main: '9', sub: 'WXYZ' },
  ],
];

export function ExecutionPanel({
  activeTab,
  onSwitchTab,
  chatMessages,
  screenshotHelper,
  moments,
  calendarEntries,
  isRecording,
  recordingDuration,
  transcriptItems,
  notification,
  onNotificationClick,
  onDismissNotification,
  imeState,
  onIMEScreenshotHelp,
  onIMESendReply,
}: ExecutionPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptItems]);

  return (
    <div className="execution-panel">
      {/* Header */}
      <div className="execution-header">
        <span className="execution-header-title">执行面板</span>
        <span className="execution-header-subtitle">Execution</span>
      </div>

      {/* ── Notification Bar ── */}
      {notification && (
        <div
          className="exec-notification animate-fade-in-up"
          onClick={() => onNotificationClick(notification)}
        >
          <div className="exec-notification-avatar">{notification.avatar || '👤'}</div>
          <div className="exec-notification-body">
            <div className="exec-notification-sender">{notification.sender}</div>
            <div className="exec-notification-content">{notification.content}</div>
          </div>
          <button
            className="exec-notification-close"
            onClick={(e) => { e.stopPropagation(); onDismissNotification(); }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab Bar */}
      <div className="execution-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`execution-tab ${activeTab === tab.key ? 'active' : ''} ${
              tab.key === 'recording' && isRecording ? 'recording-active' : ''
            }`}
            onClick={() => onSwitchTab(tab.key)}
          >
            <span className="execution-tab-icon">{tab.icon}</span>
            <span className="execution-tab-label">{tab.label}</span>
            {tab.key === 'recording' && isRecording && (
              <span className="recording-dot" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="execution-content">
        {activeTab === 'chat' && (
          <div className="wechat-chat-area">
            {chatMessages.length === 0 && (
              <div className="execution-empty">
                <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                <div style={{ color: '#999', fontSize: 12 }}>暂无微信聊天记录</div>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`wechat-bubble-row ${msg.sender === 'wangge' ? 'left' : 'right'}`}>
                <div className={`wechat-avatar ${msg.sender}`}>
                  {msg.sender === 'wangge' ? '王' : '李'}
                </div>
                <div
                  className={`wechat-bubble ${msg.sender === 'wangge' ? 'left' : 'right'} ${
                    msg.contentType === 'file' ? 'file' : ''
                  }`}
                >
                  {msg.contentType === 'file' && <span style={{ fontSize: 16 }}>📄</span>}
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />

            {/* Screenshot Helper Overlay (when no IME or IME not in ai-reply mode) */}
            {screenshotHelper && screenshotHelper.visible && !(imeState && imeState.mode === 'ai-reply') && (
              <div className="wechat-screenshot-overlay">
                <div className="wechat-screenshot-title">🤖 AI智能分析</div>
                <div className="wechat-screenshot-analysis">{screenshotHelper.analysis}</div>
                <div className="wechat-screenshot-reply">{screenshotHelper.generatedReply}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'moments' && (
          <div className="wechat-moments-area">
            {moments.length === 0 && (
              <div className="execution-empty">
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div style={{ color: '#999', fontSize: 12 }}>暂无朋友圈动态</div>
              </div>
            )}
            {moments.map((moment, i) => (
              <div key={i} className="wechat-moment-item">
                <div className="wechat-moment-header">
                  <div className="wechat-moment-avatar">{moment.avatar || '👤'}</div>
                  <span className="wechat-moment-author">{moment.author}</span>
                </div>
                <div className="wechat-moment-content">{moment.content}</div>
                {moment.imageUrls && moment.imageUrls.length > 0 && (
                  <div className="wechat-moment-images">
                    {moment.imageUrls.map((url, j) => (
                      <img
                        key={j}
                        src={url}
                        alt=""
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 4,
                          border: '1px solid #E8E8E8',
                        }}
                      />
                    ))}
                  </div>
                )}
                {(!moment.imageUrls || moment.imageUrls.length === 0) && moment.images && (
                  <div className="wechat-moment-images">
                    {moment.images.map((label, j) => (
                      <div key={j} className="wechat-moment-img-placeholder">{label}</div>
                    ))}
                  </div>
                )}
                <div className="wechat-moment-time">{moment.time}</div>
                {(moment.likes || moment.comments) && (
                  <div className="wechat-moment-interactions">
                    {moment.likes && moment.likes.length > 0 && (
                      <div className="wechat-moment-likes">❤️ {moment.likes.join('、')}</div>
                    )}
                    {moment.comments?.map((c, j) => (
                      <div key={j} className="wechat-moment-comment">
                        <span className="wechat-moment-comment-author">{c.author}：</span>
                        {c.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="calendar-area">
            {calendarEntries.length === 0 && (
              <div className="execution-empty">
                <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                <div style={{ color: '#999', fontSize: 12 }}>暂无日程安排</div>
              </div>
            )}
            {calendarEntries.map((entry) => (
              <div key={entry.id} className={`calendar-entry calendar-entry-${entry.type} animate-fade-in-up`}>
                <div className="calendar-entry-time">
                  <span className="calendar-entry-date">{entry.date}</span>
                  <span className="calendar-entry-hour">{entry.time}</span>
                </div>
                <div className="calendar-entry-body">
                  <div className="calendar-entry-title">{entry.title}</div>
                  <div className="calendar-entry-desc">{entry.description}</div>
                </div>
                <div className="calendar-entry-type-badge">
                  {entry.type === 'meeting' ? '🤝' : entry.type === 'reminder' ? '⏰' : '✅'}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recording' && (
          <div className="recording-area">
            {isRecording ? (
              <>
                <div className="recording-indicator">
                  <div className="recording-pulse-ring" />
                  <div className="recording-dot-large" />
                  <div className="recording-time">{formatDuration(recordingDuration)}</div>
                  <div className="recording-status">录音中...</div>
                </div>
                <div className="recording-transcript">
                  <div className="recording-transcript-title">📝 实时转写</div>
                  {transcriptItems.map((item, i) => (
                    <div key={i} className="transcript-item animate-fade-in-up">
                      <span className="transcript-speaker">{item.speaker}</span>
                      <span className="transcript-time">{item.time}</span>
                      <div className="transcript-text">{item.text}</div>
                    </div>
                  ))}
                  <div ref={transcriptEndRef} />
                </div>
              </>
            ) : transcriptItems.length > 0 ? (
              <div className="recording-transcript">
                <div className="recording-transcript-title">📝 录音记录</div>
                <div className="recording-indicator-done">
                  <span>✅ 录音已完成</span>
                  <span className="recording-time">{formatDuration(recordingDuration)}</span>
                </div>
                {transcriptItems.map((item, i) => (
                  <div key={i} className="transcript-item">
                    <span className="transcript-speaker">{item.speaker}</span>
                    <span className="transcript-time">{item.time}</span>
                    <div className="transcript-text">{item.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="execution-empty">
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎙️</div>
                <div style={{ color: '#999', fontSize: 12 }}>暂无录音记录</div>
                <div style={{ color: '#bbb', fontSize: 11, marginTop: 4 }}>面访时将自动开启录音</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── IME Keyboard Area ── (only in chat tab) */}
      {activeTab === 'chat' && imeState && imeState.visible && (
        <div className="ime-area">
          {imeState.mode === 'ai-reply' ? (
            /* AI Reply Mode */
            <div className="ime-ai-reply">
              {/* Customer header */}
              <div className="ime-ai-reply-header">
                <div className="ime-ai-reply-avatar">{imeState.customerAvatar || '👤'}</div>
                <div className="ime-ai-reply-name">{imeState.customerName}</div>
                <span className="ime-ai-reply-badge">✨ AI建议</span>
              </div>

              {/* AI reply text */}
              <div className="ime-ai-reply-text">
                {imeState.replyText}
              </div>

              {/* Send button */}
              <div className="ime-ai-reply-actions">
                <button
                  className="ime-send-btn"
                  onClick={() => onIMESendReply?.(imeState.replyText || '')}
                >
                  点击发送
                </button>
              </div>
            </div>
          ) : (
            /* Keyboard Mode */
            <div className="ime-keyboard">
              {/* WeChat input bar */}
              <div className="ime-input-bar">
                <div className="ime-mic-btn">🎤</div>
                <div className="ime-input-field">
                  <span className="ime-cursor" />
                </div>
                <div className="ime-emoji-btn">😊</div>
                <div className="ime-plus-btn">⊕</div>
              </div>

              {/* AI screenshot help button */}
              <div className="ime-ai-row">
                <div className="ime-ai-star">✦</div>
                <button className="ime-screenshot-btn" onClick={() => onIMEScreenshotHelp?.()}>
                  <span className="ime-screenshot-icon">📋</span>
                  <span>{imeState.screenshotLabel || '截图帮回'}</span>
                  <span className="ime-screenshot-arrow">→</span>
                </button>
              </div>

              {/* 9-key keyboard grid */}
              <div className="ime-keys">
                {KEY_ROWS.map((row, ri) => (
                  <div key={ri} className="ime-key-row">
                    {row.map((k, ki) => (
                      <div key={ki} className="ime-key">
                        <span className="ime-key-main">{k.main}</span>
                        {k.sub && <span className="ime-key-sub">{k.sub}</span>}
                      </div>
                    ))}
                    {ri === 0 && <div className="ime-key ime-key-fn">⌫</div>}
                    {ri === 1 && <div className="ime-key ime-key-fn">重输</div>}
                    {ri === 2 && <div className="ime-key ime-key-fn">@</div>}
                  </div>
                ))}
                {/* Bottom row */}
                <div className="ime-key-row ime-key-row-bottom">
                  <div className="ime-key ime-key-small">符号</div>
                  <div className="ime-key ime-key-space" />
                  <div className="ime-key ime-key-small">中/英</div>
                  <div className="ime-key ime-key-send">发送</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
