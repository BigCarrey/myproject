import { useState, useEffect, type CSSProperties } from 'react';

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

const glassBubble: CSSProperties = {
  background: 'rgba(255,255,255,0.70)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  boxShadow: '0 8px 30px 0 rgba(37,99,235,0.06)',
  border: '1px solid rgba(255,255,255,0.80)',
};

function fadeIn(visible: boolean): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(18px)',
    transition: 'opacity 0.55s ease, transform 0.55s ease',
  };
}

export function FieldAssistantHome({ agentName, agentHobby, onConfirmPost }: FieldAssistantHomeProps) {
  // 0 = nothing, 1 = greeting, 2 = features, 3 = moments
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const t1 = window.setTimeout(() => setVisible(1), 80);
    const t2 = window.setTimeout(() => setVisible(2), 1080);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className="flex flex-col py-4" style={{ paddingLeft: '16px', paddingRight: '16px' }}>

      {/* ── 1. 打招呼 + AI定位 ───────────────────────────────── */}
      <div className="mb-4" style={fadeIn(visible >= 1)}>
        <div className="max-w-[85%] rounded-[18px] px-4 py-3" style={glassBubble}>
          <p className="text-[15px] leading-[1.65] text-[#0F172A] whitespace-pre-wrap">
            {`嗨 ${agentName} 👋\n\n我是你的AI营销助理，更想当你的营销分身。\n\n朋友圈、客户消息、见客备课——这些事儿从今天起都有我，你只管把精力花在真正值钱的地方。`}
          </p>
        </div>
      </div>

      {/* ── 2. 常用功能 ──────────────────────────────────────── */}
      <div className="mb-4" style={fadeIn(visible >= 2)}>
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
      </div>

      {/* ── 3. 今日定制朋友圈 ─────────────────────────────────── */}
      <div style={fadeIn(visible >= 2)}>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-[3px] h-[14px] rounded-full" style={{ background: 'linear-gradient(180deg,#10B981,#059669)' }} />
          <span className="text-[11.5px] font-semibold text-[#475569] tracking-wide">今日定制朋友圈</span>
          <span
            className="ml-auto text-[9.5px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#047857' }}
          >
            ✨ 基于记忆生成
          </span>
        </div>

        {/* 个性化文案气泡 */}
        <div className="max-w-[85%] rounded-[18px] px-4 py-3 mb-3" style={glassBubble}>
          <p className="text-[15px] leading-[1.65] text-[#0F172A]">
            根据你<strong>「{agentHobby}达人」</strong>的人设 + 今天的运动热点，这条朋友圈是专门为你写的。你看看合不合适，确认就发 👇
          </p>
        </div>

        {/* 朋友圈内容卡片 */}
        <div
          className="rounded-[18px] overflow-hidden mb-3"
          style={{
            background: 'rgba(255,255,255,0.94)',
            border: '1px solid rgba(203,213,225,0.55)',
            boxShadow: '0 4px 20px rgba(37,99,235,0.07)',
          }}
        >
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

          <p className="px-3 pt-2.5 pb-2 text-[11px] text-[#2D2D2D] leading-[1.85] whitespace-pre-wrap">
            {POST_CONTENT}
          </p>

          <div className="px-3 pb-2.5 flex gap-2">
            {POST_IMAGE_URLS.map((url, i) => (
              <div key={i} className="flex-1 relative rounded-[10px] overflow-hidden" style={{ height: 80 }}>
                <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>

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

        {/* 确认发布 */}
        <div className="flex justify-center pb-4">
          <button
            onClick={onConfirmPost}
            className="px-6 py-2.5 rounded-[20px] text-white font-medium text-[14px]"
            style={{
              background: 'linear-gradient(135deg,#3B82F6 0%,#1D4ED8 100%)',
              boxShadow: '0 4px 14px rgba(37,99,235,0.28)',
            }}
          >
            确认发布朋友圈 ✅
          </button>
        </div>
      </div>

    </div>
  );
}
