interface GapDiagnosisCardProps {
  data: Record<string, unknown>;
}

export function GapDiagnosisCard({ data }: GapDiagnosisCardProps) {
  const gaps = (data.gaps as Array<{ label: string; status: string }>) || [
    { label: '团险风险提示', status: '需关注' },
    { label: '重疾缺口', status: '20万偏低' },
    { label: '寿险空白', status: '未配置' },
    { label: '养老未启动', status: '未配置' },
  ];
  const summary = (data.summary as string) || '建议优先补齐重疾与寿险，再规划养老。';

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="px-4 py-2.5 bg-gradient-to-br from-[#F59E0B] to-[#D97706]">
        <h3 className="text-white font-semibold text-[15px]">缺口诊断</h3>
      </div>
      <div className="p-4 space-y-2">
        {gaps.map((g, i) => (
          <div key={i} className="flex justify-between items-center py-1.5 border-b border-[#E5E7EB]/60 last:border-0">
            <span className="text-[14px] text-[#0F172A]">{g.label}</span>
            <span className="text-[13px] text-[#DC2626] font-medium">{g.status}</span>
          </div>
        ))}
        <p className="text-[13px] text-[#64748B] mt-2 pt-2 border-t border-[#E5E7EB]">{summary}</p>
      </div>
    </div>
  );
}
