interface GridCell {
  label: string;
  count: number;
}

interface CustomerGridCardProps {
  data: Record<string, unknown>;
}

const heatColors: Record<string, string> = {
  '高温高价值': '#7c3aed',
  '高温中价值': '#8b5cf6',
  '高温低价值': '#a78bfa',
  '中温高价值': '#667eea',
  '中温中价值': '#818cf8',
  '中温低价值': '#a5b4fc',
  '低温高价值': '#6366f1',
  '低温中价值': '#93a3f8',
  '低温低价值': '#c7d2fe',
};

const bgColors: Record<string, string> = {
  '高温高价值': '#f3eeff',
  '高温中价值': '#f5f0ff',
  '高温低价值': '#f8f5ff',
  '中温高价值': '#eef1ff',
  '中温中价值': '#f0f3ff',
  '中温低价值': '#f5f7ff',
  '低温高价值': '#eeeeff',
  '低温中价值': '#f2f2ff',
  '低温低价值': '#f7f7ff',
};

export function CustomerGridCard({ data }: CustomerGridCardProps) {
  const grid = (data.grid as GridCell[][]) || [];
  const tip = data.tip as string | undefined;
  const rowLabels = ['高温', '中温', '低温'];
  const colLabels = ['高价值', '中价值', '低价值'];

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">🔲 客户经营九宫格</h3>
      </div>
      <div className="p-3">
        {/* Column headers */}
        <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-1.5 mb-1.5">
          <div />
          {colLabels.map((col) => (
            <div key={col} className="text-center text-[11px] font-medium text-[#888]">{col}</div>
          ))}
        </div>

        {/* Grid rows */}
        <div className="space-y-1.5">
          {grid.map((row, ri) => (
            <div key={ri} className="grid grid-cols-[40px_1fr_1fr_1fr] gap-1.5">
              <div className="flex items-center justify-center text-[11px] font-medium text-[#888]">
                {rowLabels[ri]}
              </div>
              {row.map((cell, ci) => {
                const key = cell.label;
                const color = heatColors[key] || '#667eea';
                const bg = bgColors[key] || '#f0f4ff';
                return (
                  <div
                    key={ci}
                    className="rounded-xl py-2.5 flex flex-col items-center justify-center transition-transform active:scale-95"
                    style={{ background: bg, border: `1.5px solid ${color}30` }}
                  >
                    <span className="text-[18px] font-bold leading-none" style={{ color }}>
                      {cell.count}
                    </span>
                    <span className="text-[10px] mt-0.5" style={{ color: `${color}bb` }}>位</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {tip && (
          <div className="mt-3 bg-gradient-to-r from-[#fffbeb] to-[#fef3c7] rounded-xl px-3 py-2 flex items-start gap-1.5">
            <span className="text-[14px] leading-none mt-0.5">💡</span>
            <p className="text-[12px] text-[#92400e] leading-relaxed">{tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
