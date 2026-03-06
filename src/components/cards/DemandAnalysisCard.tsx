interface DemandAnalysisCardProps {
  data: Record<string, unknown>;
}

export function DemandAnalysisCard({ data }: DemandAnalysisCardProps) {
  const primary = (data.primary as string) || '重疾保障（三高可投）';
  const secondaryRaw = data.secondary;
  const secondary = Array.isArray(secondaryRaw)
    ? secondaryRaw
    : typeof secondaryRaw === 'string'
      ? [secondaryRaw]
      : ['寿险', '养老规划'];
  const urgency = (data.urgency as number) || 4;

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="px-4 py-2.5 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]">
        <h3 className="text-white font-semibold text-[15px]">需求分析</h3>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <span className="text-[12px] text-[#64748B]">核心需求</span>
          <p className="text-[14px] font-medium text-[#0F172A] mt-0.5">{primary}</p>
        </div>
        <div>
          <span className="text-[12px] text-[#64748B]">次要需求</span>
          <p className="text-[14px] text-[#0F172A] mt-0.5">{secondary.join('、')}</p>
        </div>
        <div>
          <span className="text-[12px] text-[#64748B]">紧迫度</span>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`text-lg ${i <= urgency ? 'text-[#F59E0B]' : 'text-[#E5E7EB]'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
