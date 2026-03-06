interface WorkSummaryCardProps {
  data: Record<string, unknown>;
}

interface MetricData {
  actual: number;
  target: number;
  label: string;
}

export function WorkSummaryCard({ data }: WorkSummaryCardProps) {
  const period = data.period as string;
  const metrics = data.metrics as Record<string, MetricData>;
  const highlights = data.highlights as string[];
  const improvements = data.improvements as string[];

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">📊 工作总结</h3>
        <p className="text-white/80 text-[13px]">{period}</p>
      </div>
      <div className="p-3 space-y-3">
        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-2">
          {Object.values(metrics).slice(0, 3).map((metric, i) => {
            const rate = Math.round((metric.actual / metric.target) * 100);
            return (
              <div key={i} className="text-center bg-[#F8FAFC] rounded-xl p-2">
                <p className="text-[13px] text-[#475569]">{metric.label}</p>
                <p className={`text-lg font-bold ${rate >= 80 ? 'text-[#10B981]' : 'text-[#3B82F6]'}`}>
                  {metric.label === '保费收入'
                    ? `${(metric.actual / 10000).toFixed(1)}万`
                    : metric.actual}
                </p>
                <p className="text-[13px] text-[#475569]">
                  目标 {metric.label === '保费收入' ? `${(metric.target / 10000).toFixed(1)}万` : metric.target}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional metrics */}
        <div className="grid grid-cols-2 gap-2">
          {Object.values(metrics).slice(3).map((metric, i) => {
            const rate = Math.round((metric.actual / metric.target) * 100);
            return (
              <div key={i} className="bg-[#F8FAFC] rounded-xl p-2 flex items-center justify-between">
                <span className="text-[13px] text-[#475569]">{metric.label}</span>
                <span className={`text-[15px] font-bold ${rate >= 80 ? 'text-[#10B981]' : 'text-[#3B82F6]'}`}>
                  {metric.label === '保费收入'
                    ? `${(metric.actual / 10000).toFixed(1)}万`
                    : metric.actual}/{metric.label === '保费收入' ? `${(metric.target / 10000).toFixed(1)}万` : metric.target}
                </span>
              </div>
            );
          })}
        </div>

        {/* Highlights */}
        <div>
          <p className="text-[13px] font-medium text-[#10B981] mb-1">✅ 本周亮点：</p>
          {highlights.map((h, i) => (
            <p key={i} className="text-[13px] text-[#475569] ml-2 mb-0.5">• {h}</p>
          ))}
        </div>

        {/* Improvements */}
        <div>
          <p className="text-[13px] font-medium text-[#D4AF37] mb-1">⚠️ 待改进：</p>
          {improvements.map((imp, i) => (
            <p key={i} className="text-[13px] text-[#475569] ml-2 mb-0.5">• {imp}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
