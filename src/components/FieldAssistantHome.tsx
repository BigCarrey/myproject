interface FieldAssistantHomeProps {
  agentName: string;
  agentHobby: string;
  onConfirmPost: () => void;
}

const FEATURES = [
  { icon: '📱', label: '每天发朋友圈' },
  { icon: '💬', label: '帮你回消息' },
  { icon: '🤝', label: '见客前备课' },
  { icon: '📊', label: '谈完帮收尾' },
];

const POST_CONTENT = `周末半马冲线瞬间，汗流浃背却格外踏实～ 就像做保险这两年，每一次为客户规划保障方案，都和跑步一样：前期充分准备，过程稳步推进，最终才能让客户收获安心。

最近看到 #国内马拉松赛事安全保障升级# 的新闻，更觉得"保障"不分场景——运动需要护具和医疗支持，生活需要保险和规划兜底。

如果你也热爱运动，或想给家人配置全面保障，随时找我聊聊呀～`;

const POST_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop',
];

const POST_HIGHLIGHTS = [
  '融合个人运动IP，塑造真实可信的人设',
  '结合热点新闻自然切入保险话题',
  '软性引导而非硬广，容易引起互动',
];

export function FieldAssistantHome({ agentName, agentHobby, onConfirmPost }: FieldAssistantHomeProps) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: '#EEF5FF' }}>
      {/* ── 1. 欢迎语（有仪式感）────────────────────────────── */}
      <div
        className="flex-shrink-0 px-5 pt-6 pb-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #5B21B6 100%)' }}
      >
        {/* decorative circles */}
        <div className="absolute right-3 top-2 w-24 h-24 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="absolute right-12 bottom-[-8px] w-14 h-14 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.07)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2.5">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.28)',
                backdropFilter: 'blur(8px)',
              }}
            >
              🚀
            </div>
            <div>
              <div className="text-white/60 text-[11px] tracking-widest uppercase">AI营销助理 · 已就位</div>
              <div className="text-white font-bold text-[20px] leading-tight">{agentName}，你好！</div>
            </div>
          </div>
          <p className="text-white/75 text-[12.5px] leading-[1.7] ml-[56px]">
            根据你的
            <strong className="text-white font-semibold">「{agentHobby}达人」</strong>
            人设，已为你定制好了今天的第一条朋友圈。
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4">
        {/* ── 2. 常用功能 ──────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="w-[3px] h-[14px] rounded-full" style={{ background: 'linear-gradient(180deg,#3B82F6,#6366F1)' }} />
            <span className="text-[11.5px] font-semibold text-[#475569] tracking-wide">常用功能</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 py-3 rounded-[14px]"
                style={{
                  background: 'rgba(255,255,255,0.88)',
                  border: '1px solid rgba(99,102,241,0.10)',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.06)',
                }}
              >
                <span className="text-[20px]">{f.icon}</span>
                <span className="text-[9.5px] font-medium text-[#374151] text-center leading-snug px-0.5">{f.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. 个性化朋友圈（已定制，直接展示）────────────── */}
        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="w-[3px] h-[14px] rounded-full" style={{ background: 'linear-gradient(180deg,#10B981,#059669)' }} />
            <span className="text-[11.5px] font-semibold text-[#475569] tracking-wide">今日定制朋友圈</span>
            <span
              className="ml-auto text-[9.5px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#047857' }}
            >
              ✨ 基于记忆生成
            </span>
          </div>

          <div
            className="rounded-[18px] overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.94)',
              border: '1px solid rgba(203,213,225,0.55)',
              boxShadow: '0 4px 20px rgba(37,99,235,0.07)',
            }}
          >
            {/* Author bar */}
            <div className="flex items-center gap-2.5 px-3 pt-3 pb-2 border-b border-gray-50">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[15px] flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#3B82F6,#6366F1)' }}
              >
                🏃
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-[#576B95]">{agentName}</div>
                <div className="text-[9.5px] text-[#BBB]">刚刚 · 朋友圈</div>
              </div>
              <span
                className="text-[9.5px] px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.10)', color: '#2563EB' }}
              >
                AI生成
              </span>
            </div>

            {/* Post text */}
            <p className="px-3 pt-2.5 pb-2 text-[11px] text-[#2D2D2D] leading-[1.85] whitespace-pre-wrap">
              {POST_CONTENT}
            </p>

            {/* Images */}
            <div className="px-3 pb-2.5 flex gap-2">
              {POST_IMAGE_URLS.map((url, i) => (
                <div key={i} className="flex-1 relative rounded-[10px] overflow-hidden" style={{ height: 80 }}>
                  <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div
              className="mx-3 mb-3 rounded-[12px] p-2.5"
              style={{ background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)' }}
            >
              <div className="text-[10px] font-semibold text-[#1D4ED8] mb-1.5">💡 内容亮点</div>
              {POST_HIGHLIGHTS.map((h, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1 last:mb-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold text-blue-700 flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(59,130,246,0.18)' }}
                  >
                    ✓
                  </span>
                  <span className="text-[9.5px] text-[#1D4ED8] leading-[1.4]">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <div className="pb-4">
          <button
            onClick={onConfirmPost}
            className="w-full py-4 rounded-[18px] text-white font-semibold text-[15px]"
            style={{
              background: 'linear-gradient(135deg,#1E40AF 0%,#5B21B6 100%)',
              boxShadow: '0 6px 20px rgba(30,64,175,0.30)',
            }}
          >
            ✅ 确认发布朋友圈
          </button>
          <p className="text-center text-[10.5px] text-[#94A3B8] mt-2">
            发布后 AI 将实时监控互动并提醒你
          </p>
        </div>
      </div>
    </div>
  );
}
