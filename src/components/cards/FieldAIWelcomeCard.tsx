interface FieldAIWelcomeCardProps {
  data: Record<string, unknown>;
}

interface WelcomeData {
  agentName?: string;
  agentHobby?: string;
  todayRecommendation?: string;
}

const FIXED_FEATURES = [
  {
    icon: '📱',
    title: '每天发朋友圈',
    desc: '结合你的人设 + 热点，帮你写好内容',
  },
  {
    icon: '💬',
    title: '帮你回消息',
    desc: '读懂客户意图，给出最合适回复',
  },
  {
    icon: '🤝',
    title: '见客前备课',
    desc: '抓取朋友圈，分析画像和策略',
  },
  {
    icon: '📊',
    title: '谈完帮收尾',
    desc: '录音整理、诊断缺口、生成材料',
  },
];

export function FieldAIWelcomeCard({ data }: FieldAIWelcomeCardProps) {
  const welcome = (data as unknown as WelcomeData) || {};
  const agentName = welcome.agentName || '小李';
  const agentHobby = welcome.agentHobby || '跑步';
  const todayRecommendation = welcome.todayRecommendation || '先让圈子里的人看见你——发一条朋友圈。';

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[20px]">🚀</span>
          <div>
            <h3 className="text-white font-semibold text-[15px] leading-tight">
              AI营销助理已就位
            </h3>
            <p className="text-white/70 text-[11px] mt-0.5">
              {agentName}，你好！专属助理为你准备好了
            </p>
          </div>
        </div>
      </div>

      {/* Fixed section: 4 common functions */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-1.5 mb-2.5">
          <div
            className="w-1 h-3.5 rounded-full"
            style={{ background: 'linear-gradient(180deg, #3B82F6, #6366F1)' }}
          />
          <span className="text-[11px] font-semibold text-[#64748B] tracking-wide uppercase">
            常用功能
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FIXED_FEATURES.map((feature, i) => (
            <div
              key={i}
              className="rounded-[14px] p-2.5 flex items-start gap-2"
              style={{
                background: 'linear-gradient(135deg, #F0F7FF 0%, #EEF2FF 100%)',
                border: '1px solid rgba(99,102,241,0.12)',
              }}
            >
              <span className="text-[18px] mt-0.5 flex-shrink-0">{feature.icon}</span>
              <div className="min-w-0">
                <div className="text-[11.5px] font-semibold text-[#1E293B] leading-tight">
                  {feature.title}
                </div>
                <div className="text-[9.5px] text-[#64748B] mt-0.5 leading-[1.4]">
                  {feature.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-gray-100" />

      {/* Personalized section */}
      <div className="px-3 pt-2.5 pb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <div
            className="w-1 h-3.5 rounded-full"
            style={{ background: 'linear-gradient(180deg, #10B981, #059669)' }}
          />
          <span className="text-[11px] font-semibold text-[#64748B] tracking-wide uppercase">
            今日建议
          </span>
        </div>

        {/* Personalized intro */}
        <div
          className="rounded-[14px] p-3 mb-2.5"
          style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}
        >
          <p className="text-[12px] text-[#065F46] leading-[1.7]">
            你的<strong>「{agentHobby}达人」</strong>人设是天然的朋友圈IP——有生活感，不像硬卖保险，客户感觉得出来。
          </p>
          <p className="text-[12px] text-[#065F46] leading-[1.7] mt-1">
            {todayRecommendation}
          </p>
        </div>

        {/* Moments CTA */}
        <div
          className="rounded-[14px] px-3 py-2.5 flex items-center gap-2.5"
          style={{
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)',
            border: '1px solid rgba(245,158,11,0.20)',
          }}
        >
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}
          >
            <span className="text-[15px]">✍️</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-[#92400E]">发一条朋友圈</div>
            <div className="text-[10px] text-[#B45309] mt-0.5">
              AI结合你的运动人设 + 今日热点，帮你写好
            </div>
          </div>
          <div className="text-[#F59E0B] text-[16px] flex-shrink-0">›</div>
        </div>
      </div>
    </div>
  );
}
