interface Customer {
  name: string;
  avatar: string;
  segment: string;
  valueScore: number;
  potentialScore: number;
  tags: string[];
  dataSources: string[];
  insight: string;
  priority: 'S' | 'A' | 'B';
}

interface V2TargetSegmentCardProps {
  data: Record<string, unknown>;
}

const priorityColors: Record<string, string> = {
  S: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
  A: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
  B: 'bg-gradient-to-r from-slate-400 to-slate-500 text-white',
};

const scoreBarColor = (score: number) => {
  if (score >= 80) return '#7C3AED';
  if (score >= 60) return '#4F6BF6';
  return '#0EA5E9';
};

export function V2TargetSegmentCard({ data }: V2TargetSegmentCardProps) {
  const customers = (data.customers as Customer[]) || [];
  const segmentSummary = data.segmentSummary as string | undefined;
  const dataSources = (data.dataSources as string[]) || [];

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4F6BF6] to-[#7C3AED] px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">🎯 目标客群推荐</h3>
        {segmentSummary && (
          <p className="text-white/80 text-[12px] mt-0.5">{segmentSummary}</p>
        )}
      </div>

      {/* Data sources banner */}
      {dataSources.length > 0 && (
        <div className="px-3 py-2 bg-[#f8f9ff] border-b border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-gray-500 font-medium">数据来源：</span>
          {dataSources.map((src, i) => (
            <span key={i} className="text-[11px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
              {src}
            </span>
          ))}
        </div>
      )}

      {/* Customer list */}
      <div className="p-3 space-y-3">
        {customers.map((c, i) => (
          <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
            {/* Customer header */}
            <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[14px] flex-shrink-0">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[14px] text-gray-800">{c.name}</span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded font-bold ${priorityColors[c.priority]}`}>
                    {c.priority}级
                  </span>
                </div>
                <p className="text-[12px] text-gray-500">{c.segment}</p>
              </div>
            </div>

            {/* Scores */}
            <div className="px-3 py-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-500 w-16 flex-shrink-0">价值评分</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${c.valueScore}%`, background: scoreBarColor(c.valueScore) }}
                  />
                </div>
                <span className="text-[12px] font-bold text-[#4F6BF6] w-8 text-right">{c.valueScore}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-500 w-16 flex-shrink-0">潜力评分</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${c.potentialScore}%`, background: scoreBarColor(c.potentialScore) }}
                  />
                </div>
                <span className="text-[12px] font-bold text-[#7C3AED] w-8 text-right">{c.potentialScore}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="px-3 pb-2 flex flex-wrap gap-1">
              {c.tags.map((tag, j) => (
                <span key={j} className="text-[11px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Insight */}
            <div className="mx-3 mb-3 bg-[#FFF9E7] rounded-lg p-2.5 border-l-4 border-orange-300">
              <div className="flex gap-1.5 items-start">
                <span className="text-[12px] flex-shrink-0">💡</span>
                <p className="text-[12px] text-orange-800 leading-relaxed">{c.insight}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
