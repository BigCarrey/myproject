import { useState, useEffect } from 'react';

const AI_AVATAR_URL = 'https://api.dicebear.com/7.x/micah/svg?seed=waneng&backgroundColor=transparent';

export function TypingIndicator() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-4 mb-4 animate-stagger-entry">
      <div className="flex gap-2.5">
        {/* AI 头像 - 带呼吸光晕与光轨 */}
        <div className="relative flex-shrink-0 mt-0.5">
          {/* 底层光晕 */}
          <div
            className="absolute inset-0 rounded-full blur-md animate-pulse opacity-60"
            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
          />
          {/* 外围虚线光轨 */}
          <div className="absolute -inset-1 rounded-full border-2 border-dashed border-[#3B82F6]/40 animate-orbit" />
          {/* 头像容器 */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/50 ring-2 ring-white/30">
            <img
              src={AI_AVATAR_URL}
              alt="AI"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="crystal rounded-[20px] rounded-tl-[6px] px-4 py-2.5 flex items-center gap-2">
          <span className="text-[14px] text-[#475569] font-medium">深度思考中</span>
          <span className="text-[13px] text-[#94a3b8]">&middot;</span>
          <span className="text-[13px] text-[#3B82F6] font-medium">{elapsed.toFixed(1)}s</span>
          <span className="flex items-center gap-0.5 ml-0.5">
            <span className="w-1.5 h-1.5 bg-[#3B82F6]/50 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-[#3B82F6]/50 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-[#3B82F6]/50 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  );
}
