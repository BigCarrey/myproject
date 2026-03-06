interface TimelineEvent {
  date: string;
  type: 'visit' | 'call' | 'purchase' | 'referral' | 'event' | 'renewal';
  title: string;
  detail: string;
}

interface DimensionScore {
  label: string;
  score: number;
  icon: string;
}

interface V2CustomerArchiveCardProps {
  data: Record<string, unknown>;
}

const timelineTypeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  visit: { icon: '🤝', color: '#4F6BF6', bg: '#EEF2FF' },
  call: { icon: '📞', color: '#7C3AED', bg: '#F5F3FF' },
  purchase: { icon: '🎊', color: '#10B981', bg: '#ECFDF5' },
  referral: { icon: '👥', color: '#F59E0B', bg: '#FFFBEB' },
  event: { icon: '📅', color: '#0EA5E9', bg: '#F0F9FF' },
  renewal: { icon: '🔄', color: '#6366F1', bg: '#EEF2FF' },
};

const scoreColor = (score: number) => {
  if (score >= 80) return '#7C3AED';
  if (score >= 60) return '#4F6BF6';
  return '#0EA5E9';
};

export function V2CustomerArchiveCard({ data }: V2CustomerArchiveCardProps) {
  const customerName = data.customerName as string;
  const avatar = data.avatar as string;
  const relationYears = data.relationYears as number;
  const totalInteractions = data.totalInteractions as number;
  const totalPremium = data.totalPremium as string;
  const lifetimeValue = data.lifetimeValue as string;
  const dimensionScores = (data.dimensionScores as DimensionScore[]) || [];
  const timeline = (data.timeline as TimelineEvent[]) || [];
  const deepInsight = data.deepInsight as string | undefined;
  const nextStrategy = data.nextStrategy as string | undefined;

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#10B981] to-[#4F6BF6] px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">📁 经营档案 · {customerName}</h3>
        <p className="text-white/80 text-[12px] mt-0.5">全景互动历程 · 深度客户洞察</p>
      </div>

      {/* Customer summary */}
      <div className="px-3 pt-3 pb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-[18px] flex-shrink-0">
            {avatar}
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-bold text-gray-800">{customerName}</p>
            <p className="text-[12px] text-gray-500 mt-0.5">建立关系 {relationYears} 年 · 互动 {totalInteractions} 次</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2.5">
          <div className="bg-indigo-50 rounded-lg px-3 py-2 text-center">
            <p className="text-[14px] font-bold text-indigo-700">{totalPremium}</p>
            <p className="text-[11px] text-indigo-500 mt-0.5">累计保费</p>
          </div>
          <div className="bg-purple-50 rounded-lg px-3 py-2 text-center">
            <p className="text-[14px] font-bold text-purple-700">{lifetimeValue}</p>
            <p className="text-[11px] text-purple-500 mt-0.5">客户终身价值</p>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Dimension scores */}
        {dimensionScores.length > 0 && (
          <div>
            <p className="text-[13px] font-semibold text-gray-700 mb-2">📊 多维度画像</p>
            <div className="space-y-1.5">
              {dimensionScores.map((dim, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[13px] w-4 flex-shrink-0">{dim.icon}</span>
                  <span className="text-[12px] text-gray-500 w-14 flex-shrink-0">{dim.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${dim.score}%`, background: scoreColor(dim.score) }}
                    />
                  </div>
                  <span className="text-[12px] font-bold w-7 text-right" style={{ color: scoreColor(dim.score) }}>
                    {dim.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deep insight */}
        {deepInsight && (
          <div className="bg-[#FFF9E7] rounded-xl p-3 border-l-4 border-orange-300 flex gap-2">
            <span className="text-[14px] flex-shrink-0">💡</span>
            <p className="text-[12px] text-orange-800 leading-relaxed">{deepInsight}</p>
          </div>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <div>
            <p className="text-[13px] font-semibold text-gray-700 mb-2">🕐 互动历程</p>
            <div className="relative pl-5 space-y-2.5">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-0 bottom-0 w-px bg-gray-200" />
              {timeline.map((evt, i) => {
                const cfg = timelineTypeConfig[evt.type] || timelineTypeConfig.visit;
                return (
                  <div key={i} className="relative flex gap-2.5">
                    {/* Dot */}
                    <div
                      className="absolute -left-5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: cfg.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400">{evt.date}</span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.icon} {evt.title}
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-500 mt-0.5">{evt.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Next strategy */}
        {nextStrategy && (
          <div className="bg-gradient-to-r from-[#ecfdf5] to-[#eff6ff] rounded-xl px-3 py-2.5 flex gap-2 items-start border border-green-100">
            <span className="text-[14px] flex-shrink-0">🌱</span>
            <div>
              <p className="text-[12px] font-medium text-green-700">下阶段经营策略</p>
              <p className="text-[12px] text-green-600 mt-0.5 leading-relaxed">{nextStrategy}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
