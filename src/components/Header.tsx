interface HeaderProps {
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}

export function Header({ isSpeaking, onStopSpeaking, autoSpeak, onToggleAutoSpeak }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] pt-10 pb-4 px-5 relative z-10 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1
            className="text-[18px] font-black tracking-wider text-white"
            style={{ fontFamily: '"Noto Serif SC", "Noto Serif CJK SC", "Source Han Serif SC", "PingFang SC", serif' }}
          >
            万能营销
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isSpeaking && (
            <button
              onClick={onStopSpeaking}
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white font-medium transition-all hover:bg-white/30"
            >
              <span className="flex items-center gap-0.5">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-0.5 bg-white rounded-full"
                    style={{
                      height: '10px',
                      animation: `voice-wave 0.5s ease-in-out infinite ${i * 0.1}s`,
                    }}
                  />
                ))}
              </span>
              停止
            </button>
          )}

          <button
            onClick={onToggleAutoSpeak}
            className="w-8 h-8 flex items-center justify-center text-white transition-transform active:scale-90 rounded-full"
            style={{ background: autoSpeak ? 'rgba(255,255,255,0.25)' : 'transparent' }}
            title={autoSpeak ? '关闭自动语音' : '开启自动语音'}
          >
            {autoSpeak ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
