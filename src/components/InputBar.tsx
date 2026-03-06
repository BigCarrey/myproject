import { useState, useRef, useEffect } from 'react';

interface InputBarProps {
  onSend: (text: string) => void;
  onSendImage?: (imageUrl: string, text?: string) => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  isListening: boolean;
  transcript: string;
  disabled?: boolean;
}

const GRADIENT_TECH = 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';

export function InputBar({
  onSend,
  onSendImage,
  onVoiceStart,
  onVoiceStop,
  isListening,
  transcript,
  disabled,
}: InputBarProps) {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (transcript && isListening) {
      setText(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    if (mode === 'text' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const handleSend = () => {
    const msg = text.trim();
    if (!msg) return;
    onSend(msg);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      onVoiceStop();
      if (text.trim()) {
        setTimeout(() => handleSend(), 200);
      }
    } else {
      setText('');
      onVoiceStart();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || !onSendImage) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onSendImage(dataUrl, text.trim() || undefined);
      setText('');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  /* 悬浮操作岛 - 底部半透明渐变蒙层 */
  const inputWrapperClass = 'pt-4 pb-7 px-6 bg-gradient-to-t from-white/90 via-white/70 to-transparent backdrop-blur-[12px] border-t border-white/50 flex-shrink-0';

  const imageButton = onSendImage ? (
    <button
      onClick={() => fileInputRef.current?.click()}
      disabled={disabled}
      className="w-9 h-9 rounded-[16px] glass flex items-center justify-center text-[#3B82F6] hover:shadow-[0_8px_24px_rgba(59,130,246,0.15)] transition-all hover:scale-105 disabled:opacity-50 flex-shrink-0"
      title="拍照/上传图片"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </button>
  ) : null;

  // Voice mode - large button with pulse + shimmer
  if (mode === 'voice' && !isListening) {
    return (
      <div className={inputWrapperClass}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageSelect}
          className="hidden"
          aria-hidden
        />
        <div className="flex items-center justify-center relative">
          <button
            onClick={handleVoiceToggle}
            disabled={disabled}
            className="group relative w-16 h-16 rounded-[20px] flex items-center justify-center transition-all disabled:opacity-50 hover:scale-105 active:scale-95 overflow-hidden shimmer"
            style={{
              background: GRADIENT_TECH,
              boxShadow: '0 8px 30px rgba(59, 130, 246, 0.4)',
            }}
          >
            <div
              className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: GRADIENT_TECH, animation: 'voice-pulse 2s ease-out infinite' }}
            />
            <svg className="w-6 h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <rect x="10" y="4" width="4" height="12" rx="2" />
              <path d="M6 12c0 3.314 2.686 6 6 6s6-2.686 6-6M12 18v4m-4 0h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </button>

          <div className="absolute right-0 flex items-center gap-1.5">
            {imageButton}
            <button
              onClick={() => setMode('text')}
              className="w-10 h-10 rounded-[16px] glass flex items-center justify-center text-[#3B82F6] hover:shadow-[0_8px_24px_rgba(59,130,246,0.15)] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Listening mode
  if (isListening) {
    return (
      <div className={inputWrapperClass}>
        {text && (
          <div className="mb-3 px-3.5 py-2 glass rounded-[20px] text-[14px] text-[#0F172A]">
            {text}
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1 h-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <span
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  height: '20px',
                  background: GRADIENT_TECH,
                  opacity: 0.6,
                  animation: `voice-wave 0.5s ease-in-out infinite ${i * 0.07}s`,
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center w-full relative">
            <button
              onClick={() => { onVoiceStop(); setText(''); }}
              className="absolute left-4 w-10 h-10 rounded-[16px] glass flex items-center justify-center text-[#475569] hover:shadow-[0_8px_24px_rgba(59,130,246,0.1)] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={handleVoiceToggle}
              className="relative w-16 h-16 rounded-[20px] flex items-center justify-center animate-pulse-glow overflow-hidden"
              style={{
                background: GRADIENT_TECH,
                boxShadow: '0 8px 30px rgba(59, 130, 246, 0.4)',
              }}
            >
              <svg className="w-6 h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <rect width="12" height="12" x="6" y="6" />
              </svg>
            </button>

            <button
              onClick={() => { onVoiceStop(); if (text.trim()) setTimeout(handleSend, 200); }}
              className={`absolute right-4 w-10 h-10 rounded-[16px] flex items-center justify-center transition-all ${
                text.trim()
                  ? 'text-white hover:scale-105'
                  : 'glass text-[#94a3b8]'
              }`}
              style={text.trim() ? {
                background: GRADIENT_TECH,
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)',
              } : {}}
              disabled={!text.trim()}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          <p className="text-[12px] text-[#3B82F6] font-medium">正在聆听...</p>
        </div>
      </div>
    );
  }

  // Text input mode
  return (
    <div className={inputWrapperClass}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelect}
        className="hidden"
        aria-hidden
      />
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setMode('voice')}
          className="w-9 h-9 rounded-[16px] flex items-center justify-center text-white flex-shrink-0 transition-all hover:scale-105 group shimmer"
          style={{
            background: GRADIENT_TECH,
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)',
          }}
        >
          <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
            <rect x="10" y="4" width="4" height="12" rx="2" />
            <path d="M6 12c0 3.314 2.686 6 6 6s6-2.686 6-6M12 18v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        </button>

        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="说点什么或发张图..."
            disabled={disabled}
            className="w-full glass rounded-[20px] px-4 py-2.5 text-[14px] text-[#0F172A] outline-none focus:ring-2 focus:ring-[#3B82F6]/30 transition-all disabled:opacity-50 placeholder:text-[#94a3b8]"
          />
        </div>

        {imageButton}

        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className={`w-9 h-9 rounded-[16px] flex items-center justify-center flex-shrink-0 transition-all group shimmer ${
            text.trim()
              ? 'text-white hover:scale-105'
              : 'glass text-[#94a3b8]'
          }`}
          style={text.trim() ? {
            background: GRADIENT_TECH,
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)',
          } : {}}
        >
          <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
