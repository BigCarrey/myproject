interface CoverageGapCardProps {
  data: Record<string, unknown>;
}

interface GapItem {
  category: string;
  current: number;
  recommended: number;
  unit: string;
  status: 'gap' | 'missing' | 'adequate';
}

export function CoverageGapCard({ data }: CoverageGapCardProps) {
  const customerName = data.customerName as string;
  const analysis = data.analysis as GapItem[];
  const summary = data.summary as string;

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">📊 {customerName} - 保障缺口分析</h3>
      </div>
      <div className="p-3 space-y-2">
        {analysis.map((item, index) => {
          const percentage = item.recommended > 0 ? Math.min((item.current / item.recommended) * 100, 100) : 0;
          const barColor =
            item.status === 'missing'
              ? 'bg-[#F59E0B]'
              : item.status === 'gap'
              ? 'bg-[#6366F1]'
              : 'bg-[#10B981]';

          return (
            <div key={index}>
              <div className="flex items-center justify-between text-[13px] mb-1">
                <span className="font-medium text-[#0F172A]">{item.category}</span>
                <span className="text-[#475569]">
                  {item.current}{item.unit} / {item.recommended}{item.unit}
                </span>
              </div>
              <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {item.status === 'missing' && (
                <p className="text-[13px] text-[#F59E0B] mt-0.5">⚠️ 完全缺失</p>
              )}
            </div>
          );
        })}

        {summary && (
          <div className="mt-2 p-2 bg-[#EFF6FF] rounded-xl text-[13px] text-[#1E3A8A]">
            📌 {summary}
          </div>
        )}
      </div>
    </div>
  );
}
