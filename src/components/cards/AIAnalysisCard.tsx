interface AIAnalysisCardProps {
  data: Record<string, unknown>;
}

export function AIAnalysisCard({ data }: AIAnalysisCardProps) {
  const customerName = (data.customerName as string) || '王哥';

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]">
        <span className="text-white font-semibold text-[15px]">AI 帮回复</span>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-white text-xs">
            {customerName.charAt(0)}
          </div>
          <span className="text-white text-[13px]">{customerName}</span>
          <button className="w-5 h-5 rounded flex items-center justify-center text-white/80 hover:bg-white/20">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#DBEAFE] text-[#1D4ED8] text-[12px] font-medium">
            问题识别：健康告知咨询
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-[12px] font-medium">
            情绪：轻微焦虑
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#DBEAFE] text-[#1D4ED8] text-[12px] font-medium">
            阶段：意向初步萌发
          </span>
        </div>
        <p className="text-[13px] text-[#475569]">
          建议：先安抚再引导预约，不宜直接推产品
        </p>
      </div>
    </div>
  );
}
