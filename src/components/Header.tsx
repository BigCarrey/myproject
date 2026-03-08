interface HeaderProps {
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}

export function Header({ isSpeaking, onStopSpeaking, autoSpeak, onToggleAutoSpeak }: HeaderProps) {
  return (
    <header
      className="pt-10 pb-3 px-5 relative z-10"
      style={{
        background: 'linear-gradient(180deg, rgba(239,246,255,0.98) 0%, rgba(248,250,255,0.95) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(99,102,241,0.08)',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)',
      }} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* AI avatar icon */}
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3" fill="white" />
              <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="5" cy="12" r="1.5" fill="rgba(255,255,255,0.7)" />
              <circle cx="19" cy="12" r="1.5" fill="rgba(255,255,255,0.7)" />
              <line x1="6.5" y1="12" x2="9" y2="10" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <line x1="17.5" y1="12" x2="15" y2="10" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            </svg>
          </div>
          <div>
            <h1
              className="text-[15px] font-black text-[#1E3A8A] tracking-wider leading-none"
              style={{ fontFamily: '"Noto Serif SC", "Noto Serif CJK SC", "Source Han Serif SC", "PingFang SC", serif' }}
            >
              万能营销
            </h1>
            <div style={{ fontSize: 10, color: '#6366F1', fontWeight: 500, marginTop: 2, letterSpacing: '0.05em' }}>
              AI 助理 · 外勤模式
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={onStopSpeaking}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))',
                color: '#3B82F6',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <span className="flex items-center gap-0.5">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-0.5 rounded-full"
                    style={{
                      height: '10px',
                      background: 'linear-gradient(180deg, #3B82F6, #6366F1)',
                      animation: `voice-wave 0.5s ease-in-out infinite ${i * 0.1}s`,
                    }}
                  />
                ))}
              </span>
              停止
            </button>
          )}

          {/* AI pulse status dot */}
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 6px rgba(16,185,129,0.6)',
            animation: 'ai-breathe 2s ease-in-out infinite',
          }} />

          <button
            onClick={onToggleAutoSpeak}
            className="w-8 h-8 flex items-center justify-center transition-all active:scale-90 rounded-full"
            style={{
              background: autoSpeak
                ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))'
                : 'rgba(0,0,0,0.04)',
              color: autoSpeak ? '#3B82F6' : '#94A3B8',
              border: autoSpeak ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
            }}
            title={autoSpeak ? '关闭自动语音' : '开启自动语音'}
          >
            {autoSpeak ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
