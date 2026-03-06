interface KeyMoment {
  time: string;
  label: string;
  quote: string;
  type: 'pain-point' | 'positive' | 'objection' | 'opportunity';
}

interface BusinessAdvice {
  category: string;
  icon: string;
  advice: string;
}

interface V2VoiceReviewCardProps {
  data: Record<string, unknown>;
}

const momentTypeConfig: Record<string, { color: string; bg: string; label: string }> = {
  'pain-point': { color: '#EF4444', bg: '#FEF2F2', label: '痛点' },
  'positive': { color: '#10B981', bg: '#ECFDF5', label: '正向' },
  'objection': { color: '#F59E0B', bg: '#FFFBEB', label: '异议' },
  'opportunity': { color: '#4F6BF6', bg: '#EEF2FF', label: '机会' },
};

export function V2VoiceReviewCard({ data }: V2VoiceReviewCardProps) {
  const customerName = data.customerName as string;
  const duration = data.duration as string;
  const sentiment = data.sentiment as string;
  const sentimentScore = data.sentimentScore as number;
  const keyMoments = (data.keyMoments as KeyMoment[]) || [];
  const advices = (data.advices as BusinessAdvice[]) || [];
  const nextStep = data.nextStep as string | undefined;

  const sentimentColor = sentimentScore >= 70 ? '#10B981' : sentimentScore >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">🎙️ 拜访复盘分析 · {customerName}</h3>
        <p className="text-white/80 text-[12px] mt-0.5">语音记录 {duration} · AI 智能分析提炼</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        <div className="px-3 py-2.5 text-center">
          <div className="text-[18px] font-bold" style={{ color: sentimentColor }}>{sentimentScore}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">情绪评分</div>
        </div>
        <div className="px-3 py-2.5 text-center">
          <div className="text-[14px] font-bold text-gray-700">{sentiment}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">客户态度</div>
        </div>
        <div className="px-3 py-2.5 text-center">
          <div className="text-[14px] font-bold text-[#4F6BF6]">{keyMoments.length}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">关键时刻</div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Key moments */}
        {keyMoments.length > 0 && (
          <div>
            <p className="text-[13px] font-semibold text-gray-700 mb-2">🎯 关键时刻提炼</p>
            <div className="space-y-2">
              {keyMoments.map((m, i) => {
                const cfg = momentTypeConfig[m.type] || momentTypeConfig['positive'];
                return (
                  <div key={i} className="flex gap-2.5">
                    <div className="flex-shrink-0 mt-0.5">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-400">{m.time}</p>
                      <p className="text-[12px] text-gray-600 italic mt-0.5">"{m.quote}"</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Business advice */}
        {advices.length > 0 && (
          <div>
            <p className="text-[13px] font-semibold text-gray-700 mb-2">💼 经营建议</p>
            <div className="space-y-2">
              {advices.map((adv, i) => (
                <div key={i} className="bg-[#f8f9ff] rounded-xl px-3 py-2.5 flex gap-2.5 items-start">
                  <span className="text-[16px] flex-shrink-0">{adv.icon}</span>
                  <div>
                    <p className="text-[12px] font-medium text-[#4F6BF6]">{adv.category}</p>
                    <p className="text-[12px] text-gray-600 mt-0.5 leading-relaxed">{adv.advice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next step */}
        {nextStep && (
          <div className="bg-gradient-to-r from-[#f0f4ff] to-[#f5f3ff] rounded-xl px-3 py-2.5 flex gap-2 items-start border border-indigo-100">
            <span className="text-[14px] flex-shrink-0">🚀</span>
            <div>
              <p className="text-[12px] font-medium text-indigo-700">建议下一步行动</p>
              <p className="text-[12px] text-indigo-600 mt-0.5">{nextStep}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
