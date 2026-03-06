interface VisitStrategyCardProps {
  data: Record<string, unknown>;
}

interface StrategySection {
  title: string;
  icon: string;
  items: string[];
}

export function VisitStrategyCard({ data }: VisitStrategyCardProps) {
  const customerName = data.customerName as string;
  const sections = data.sections as StrategySection[];
  const successProbability = data.successProbability as number | undefined;
  const riskPoints = data.riskPoints as string[] | undefined;

  const sectionColors = [
    { bg: 'bg-[#EFF6FF]', title: 'text-[#3B82F6]', dot: 'bg-[#3B82F6]' },
    { bg: 'bg-[#F5F3FF]', title: 'text-[#6366F1]', dot: 'bg-[#6366F1]' },
    { bg: 'bg-[#EEF2FF]', title: 'text-[#4F46E5]', dot: 'bg-[#4F46E5]' },
    { bg: 'bg-[#FFFBEB]', title: 'text-[#D4AF37]', dot: 'bg-[#D4AF37]' },
    { bg: 'bg-[#F0FDF4]', title: 'text-[#10B981]', dot: 'bg-[#10B981]' },
  ];

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">📋 {customerName}沟通策略</h3>
      </div>
      <div className="p-3 space-y-2">
        {/* 成功率预估与风险点 */}
        {(successProbability != null || (riskPoints && riskPoints.length > 0)) && (
          <div className="space-y-1.5 mb-2">
            {successProbability != null && (
              <div className="flex items-center justify-between bg-[#EFF6FF] rounded-xl px-3 py-2">
                <span className="text-[12px] text-[#475569]">本次拜访成功率预估</span>
                <span className={`text-[14px] font-bold ${successProbability >= 70 ? 'text-[#10B981]' : successProbability >= 40 ? 'text-[#3B82F6]' : 'text-[#6366F1]'}`}>
                  {successProbability}%
                </span>
              </div>
            )}
            {riskPoints && riskPoints.length > 0 && (
              <div className="bg-[#FEF3C7] rounded-xl px-3 py-2">
                <p className="text-[12px] font-medium text-[#B45309] mb-1">⚠️ 风险点</p>
                <ul className="space-y-0.5">
                  {riskPoints.map((rp, i) => (
                    <li key={i} className="text-[12px] text-[#92400E]">{rp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {sections.map((section, i) => {
          const color = sectionColors[i % sectionColors.length];
          return (
            <div key={i} className={`${color.bg} rounded-xl p-2.5`}>
              <p className={`text-[13px] font-medium ${color.title} mb-1.5`}>
                {section.icon} {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j} className="text-[13px] text-[#0F172A] flex items-start gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${color.dot} mt-1.5 flex-shrink-0`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
