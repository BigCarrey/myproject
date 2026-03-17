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
function WeChatInputBar({ onShowHelper, onAIAnalysis }: { onShowHelper?: () => void; onAIAnalysis?: () => void }) {
  return (
    <div className="wc-input-bar">
      <button className="wc-input-icon">🎤</button>
      <div className="wc-input-field">输入消息...</div>
      {onAIAnalysis && (
        <button className="wc-ai-screenshot-btn" onClick={onAIAnalysis}>
          ✨ AI截图分析
        </button>
      )}
      {onShowHelper && !onAIAnalysis && (
        <button className="wc-ai-screenshot-btn" onClick={onShowHelper}>
          ✨ 截图
        </button>
      )}
      <button className="wc-input-icon">😊</button>
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

  useEffect(() => {
    setStatus(data.skipAnalyzing ? 'ready' : 'keyboard');
  }, [data]);

  const handleAISuggest = () => {
    if (status !== 'keyboard') return;
    setStatus('analyzing');
    setTimeout(() => setStatus('ready'), 2000);
  };

  const inputRowBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    height: 52,
    minHeight: 52,
    padding: '0 10px',
    background: '#ededed',
    flexShrink: 0,
  };

  const screenshotBtnActive: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    padding: '0 9px',
    height: 32,
    borderRadius: 6,
    border: 'none',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
    color: '#fff',
  };

  const screenshotBtnNormal: React.CSSProperties = {
    ...screenshotBtnActive,
    background: '#e0e0e0',
    color: '#555',
    fontWeight: 500,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(350%); }
        }
      `}</style>

      {/* ── KEYBOARD STATE: 输入行在上，键盘在下 ── */}
      {status === 'keyboard' && (
        <>
          <div style={inputRowBase}>
            <button className="wc-input-icon">🎤</button>
            <div className="wc-input-field" style={{ flex: 1 }}>输入消息...</div>
            <button style={screenshotBtnNormal}>📸 截屏</button>
            <button className="wc-input-icon">😊</button>
            <button className="wc-input-icon">＋</button>
          </div>

          <div style={{ background: '#d1d5db', flexShrink: 0 }}>
            {/* AI 助手提示条 */}
            <div style={{ background: 'rgba(15,23,42,0.95)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>✨ AI 输入助手</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 }}>点击获取智能回复建议</div>
              </div>
              <button
                onClick={handleAISuggest}
                style={{ background: 'linear-gradient(135deg,#3B82F6,#6366F1)', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', borderRadius: 20, padding: '7px 18px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(59,130,246,0.5)' }}
              >
                AI 建议
              </button>
            </div>
            {/* 工具栏 */}
            <div style={{ background: '#aaafb8', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, padding: '4px 8px' }}>
              {['A','✦','▣','🎤','˅'].map((icon, i) => (
                <button key={i} style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</button>
              ))}
            </div>
            {/* QWERTY */}
            {[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['⇧','Z','X','C','V','B','N','M','⌫']].map((row, ri) => (
              <div key={ri} style={{ display: 'flex', justifyContent: 'center', gap: 5, padding: ri === 0 ? '8px 4px 4px' : '4px' }}>
                {row.map((key) => (
                  <button key={key} style={{ flex: (key==='⇧'||key==='⌫') ? '1.5 1 0' : '1 1 0', minWidth: 0, height: 40, borderRadius: 5, border: 'none', background: (key==='⇧'||key==='⌫') ? '#aaafb8' : '#fff', fontSize: key.length>1 ? 14 : 15, fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 0 rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{key}</button>
                ))}
              </div>
            ))}
            {/* 底部行 */}
            <div style={{ display: 'flex', gap: 5, padding: '4px 4px 10px' }}>
              {[{label:'123',flex:1.4},{label:'😊',flex:1},{label:',',flex:1},{label:'',flex:4,isSpace:true},{label:'中/英',flex:1.4},{label:'发送',flex:1.4,isPrimary:true}].map((k,i) => (
                <button key={i} style={{ flex: k.flex, height: 40, borderRadius: 5, border: 'none', background: k.isPrimary ? '#3B82F6' : k.isSpace ? '#fff' : '#aaafb8', color: k.isPrimary ? '#fff' : '#000', fontSize: 13, fontWeight: k.isPrimary ? 700 : 400, cursor: 'pointer', boxShadow: '0 1px 0 rgba(0,0,0,0.3)' }}>{k.label}</button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── ANALYZING STATE ── */}
      {status === 'analyzing' && (
        <>
          <div style={{ background: 'rgba(15,23,42,0.95)', padding: '14px 14px 16px', flexShrink: 0 }}>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500, marginBottom: 10 }}>
              🔍 {data.analyzingText || 'AI正在分析中...'}
            </div>
            <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '40%', borderRadius: 3, background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.8),rgba(59,130,246,0.9),transparent)', animation: 'shimmer 1.4s ease-in-out infinite' }} />
            </div>
          </div>
          <div style={inputRowBase}>
            <button className="wc-input-icon">🎤</button>
            <div className="wc-input-field" style={{ flex: 1 }}>输入消息...</div>
            <button style={screenshotBtnNormal}>📸 截屏</button>
            <button className="wc-input-icon">😊</button>
            <button className="wc-input-icon">＋</button>
          </div>
        </>
      )}

      {/* ── READY STATE: 图二样式 ── */}
      {status === 'ready' && (
        <>
          {/* 渐变标题栏 */}
          <div style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)', padding: '12px 14px 14px', flexShrink: 0 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>
              {data.headerTitle || '🧑‍💼 AI生成触客内容'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 3 }}>
              {data.headerSubtitle || (data.analysis ? `识别到: ${data.analysis}` : '根据近期热点话题，AI为您定制以下触客内容，可一键转发')}
            </div>
          </div>

          {/* 内容卡片列表 */}
          {data.contentItems && data.contentItems.length > 0 && (
            <div style={{ background: '#fff', margin: '8px 8px 0', borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
              {data.contentItems.map((item: SmartKeyboardContentItem, i: number) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderBottom: i < (data.contentItems?.length ?? 0) - 1 ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, marginLeft: 10, marginRight: 8, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{item.title}</span>
                      <span style={{ background: item.tagColor || '#FFF3E0', color: item.tagTextColor || '#E65100', fontSize: 10, padding: '1px 6px', borderRadius: 3, fontWeight: 500 }}>{item.tag}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{item.description}</div>
                  </div>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#3B82F6', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 话术区 */}
          <div style={{ margin: '8px 8px 0', padding: '10px 12px', background: '#fff', borderRadius: 12, flexShrink: 0 }}>
            <div style={{ color: '#666', fontSize: 11, marginBottom: 6, fontWeight: 500 }}>🎯 AI生成转发话术：</div>
            <div style={{ color: '#333', fontSize: 12, lineHeight: 1.6, background: '#f5f6fa', borderRadius: 8, padding: '8px 10px' }}>
              "{data.recommendedScript}"
            </div>
          </div>

          {/* 一键发送按钮 */}
          <div style={{ padding: '8px 8px 10px', flexShrink: 0 }}>
            <button
              onClick={() => onSend(data.recommendedScript)}
              style={{ width: '100%', background: 'linear-gradient(135deg,#3B82F6,#6366F1)', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', borderRadius: 12, padding: '13px 0', cursor: 'pointer', letterSpacing: '0.03em' }}
            >
              一键发送
            </button>
          </div>

          {/* 输入行在最底部 */}
          <div style={inputRowBase}>
            <button className="wc-input-icon">🎤</button>
            <div className="wc-input-field" style={{ flex: 1 }}>输入消息...</div>
            <button style={screenshotBtnActive}>📸 截屏✨</button>
            <button className="wc-input-icon">😊</button>
            <button className="wc-input-icon">＋</button>
          </div>
        </>
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
          <WeChatInputBar onAIAnalysis={onReturnToAssistant} />
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
