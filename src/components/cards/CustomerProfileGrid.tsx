interface CustomerProfileGridProps {
  data: Record<string, unknown>;
}

interface GridCell {
  label: string;
  color: string;
}

const gridData: GridCell[][] = [
  [
    { label: '小康青年', color: 'bg-blue-50 text-blue-400' },
    { label: '小康壮年', color: 'bg-blue-50 text-blue-400' },
    { label: '小康中年', color: 'bg-blue-100 text-blue-500' },
    { label: '小康盛年', color: 'bg-blue-100 text-blue-500' },
    { label: '小康颐年', color: 'bg-blue-50 text-blue-400' },
  ],
  [
    { label: '中产青年', color: 'bg-blue-100 text-blue-500' },
    { label: '中产壮年', color: 'bg-blue-100 text-blue-500' },
    { label: '中产中年', color: 'bg-indigo-100 text-indigo-600' },
    { label: '中产盛年', color: 'bg-indigo-100 text-indigo-600' },
    { label: '中产颐年', color: 'bg-blue-100 text-blue-500' },
  ],
  [
    { label: '富裕青年', color: 'bg-indigo-50 text-indigo-500' },
    { label: '富裕壮年', color: 'bg-indigo-100 text-indigo-600' },
    { label: '富裕中年', color: 'bg-indigo-200 text-indigo-700' },
    { label: '富裕盛年', color: 'bg-indigo-100 text-indigo-600' },
    { label: '富裕颐年', color: 'bg-indigo-50 text-indigo-500' },
  ],
  [
    { label: '高净值青年', color: 'bg-blue-50 text-blue-500' },
    { label: '高净值壮年', color: 'bg-blue-100 text-blue-600' },
    { label: '社会中坚', color: 'bg-blue-200 text-blue-700' },
    { label: '高净值盛年', color: 'bg-blue-100 text-blue-600' },
    { label: '高净值颐年', color: 'bg-blue-50 text-blue-500' },
  ],
  [
    { label: '超高青年', color: 'bg-sky-50 text-sky-500' },
    { label: '超高壮年', color: 'bg-sky-100 text-sky-600' },
    { label: '超高中年', color: 'bg-sky-200 text-sky-700' },
    { label: '超高盛年', color: 'bg-sky-100 text-sky-600' },
    { label: '超高颐年', color: 'bg-sky-50 text-sky-500' },
  ],
];

const yLabels = ['小康', '中产', '富裕', '高净值', '超高净值'];
const xLabels = ['青年 0~30', '壮年 31~35', '中年 36~50', '盛年 51~65', '颐年 66+'];

export function CustomerProfileGrid({ data }: CustomerProfileGridProps) {
  const customerName = (data.customerName as string) ?? '李平安';
  const highlightRow = (data.highlightRow as number) ?? 3;
  const highlightCol = (data.highlightCol as number) ?? 2;
  const segment = (data.segment as string) ?? '社会中坚客群';
  const painPoints = (data.painPoints as string[]) ?? ['子女优质教育费用高', '父母健康养老焦虑'];
  const description = (data.description as string) ?? '处于社会中坚客群，子女教育占家庭收入35%';

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">👤 客群宫格定位</h3>
      </div>

      <div className="p-3">
        {/* Pain points */}
        <div className="mb-3">
          <p className="text-xs text-[#475569] mb-1.5">{customerName}的核心痛点：</p>
          <div className="flex flex-wrap gap-1.5">
            {painPoints.map((point, i) => (
              <span key={i} className="text-xs bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded-lg border border-[#FDE68A]">
                {point}
              </span>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[320px]">
            {/* X-axis labels */}
            <div className="flex ml-12">
              {xLabels.map((label, i) => (
                <div key={i} className="flex-1 text-center">
                  <span className="text-[10px] text-[#64748B] leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {/* Grid rows */}
            <div className="flex">
              {/* Y-axis labels */}
              <div className="w-12 flex flex-col justify-around pr-1">
                {yLabels.map((label, i) => (
                  <div key={i} className="text-right">
                    <span className="text-[10px] text-[#64748B]">{label}</span>
                  </div>
                ))}
              </div>

              {/* Grid cells */}
              <div className="flex-1 grid grid-rows-5 gap-0.5">
                {gridData.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-5 gap-0.5">
                    {row.map((cell, colIndex) => {
                      const isHighlight = rowIndex === highlightRow && colIndex === highlightCol;
                      return (
                        <div
                          key={colIndex}
                          className={`relative h-9 rounded flex items-center justify-center ${
                            isHighlight
                              ? 'bg-[#3B82F6] text-white ring-2 ring-[#60A5FA] ring-offset-1'
                              : cell.color
                          }`}
                        >
                          <span className={`text-[9px] font-medium leading-tight text-center ${isHighlight ? 'text-white' : ''}`}>
                            {isHighlight ? `📍${segment}` : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-2 bg-[#EFF6FF] rounded-xl px-3 py-2 border border-[#BFDBFE]">
          <p className="text-xs text-[#1E3A8A]">
            <span className="font-medium">📌 {customerName}</span>：{description}
          </p>
        </div>
      </div>
    </div>
  );
}
