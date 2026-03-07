import { useEffect, useRef } from 'react';
import type {
  ExecutionTab,
  WeChatChatMessage,
  WeChatMoment,
  WeChatScreenshotHelper,
  CalendarEntry,
  TranscriptItem,
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

            {/* Screenshot Helper Overlay */}
            {screenshotHelper && screenshotHelper.visible && (
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
    </div>
  );
}
