interface FieldVisitPlanCardProps {
  data: Record<string, unknown>;
}

export default function FieldVisitPlanCard({ data }: FieldVisitPlanCardProps) {
  const clientName = (data?.clientName as string) || '陈诚';
  const clientTitle = (data?.clientTitle as string) || '企业中层 · 45岁';
  const visitDate = (data?.visitDate as string) || '3月24日（周一）';
  const visitTime = (data?.visitTime as string) || '上午 10:00';
  const objective = (data?.objective as string) || '保险需求深度面谈，呈现平安盛盈专属方案';
  const preps: string[] = (data?.preps as string[]) || [
    '准备平安盛盈·居家养老定制方案材料',
    '打印陈诚专属财富规划报告',
    '准备同类企业中层客户成功案例',
  ];
  const aiTip = (data?.aiTip as string) || '上午10点拜访最佳，客户此时精力充沛，决策效率高；定存30万到期是切入主推产品的黄金时机。';

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100" style={{ background: '#fff' }}>
      {/* Header */}
      <div
        className="px-4 py-4"
        style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-white text-[13px] font-semibold">📅 下周拜访计划</span>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}
          >
            已加入日程
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-white font-bold text-[22px] leading-none">{clientName}</div>
            <div className="text-white/75 text-[12px] mt-1">{clientTitle}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-white font-semibold text-[14px]">{visitDate}</div>
            <div className="text-white/80 text-[12px]">{visitTime}</div>
          </div>
        </div>
      </div>

      {/* Visit Objective */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="text-[11px] font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wide">拜访目标</div>
        <div className="text-[13px] text-[#1E293B] font-medium leading-snug">🎯 {objective}</div>
      </div>

      {/* Preparation Checklist */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="text-[11px] font-semibold text-[#94A3B8] mb-2 uppercase tracking-wide">准备清单</div>
        <div className="flex flex-col gap-2">
          {preps.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: 'linear-gradient(135deg, #1D4ED8, #0EA5E9)' }}
              >
                <span className="text-white text-[10px] font-bold">{i + 1}</span>
              </div>
              <span className="text-[13px] text-[#334155] leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Tip */}
      <div className="px-4 py-3" style={{ background: '#EFF6FF' }}>
        <p className="text-[12px] leading-[1.6]" style={{ color: '#1D4ED8' }}>
          ✨ {aiTip}
        </p>
      </div>
    </div>
  );
}
