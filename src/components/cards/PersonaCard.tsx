interface PersonaCardProps {
  data: Record<string, unknown>;
}

export function PersonaCard({ data }: PersonaCardProps) {
  const hobby = (data.hobby as string) || '跑步、半马';
  const city = (data.city as string) || '深圳';
  const years = (data.years as string) || '2年+';
  const targetGroup = (data.targetGroup as string) || '企业中层、家庭保障';
  const style = (data.style as string) || '靠谱、不硬推';

  const items = [
    { label: '爱好', value: hobby },
    { label: '常驻城市', value: city },
    { label: '从业年限', value: years },
    { label: '主攻客群', value: targetGroup },
    { label: '风格标签', value: style },
  ];

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="px-4 py-2.5 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]">
        <h3 className="text-white font-semibold text-[15px]">您的人设</h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg bg-[#F8FAFC] px-3 py-2">
            <span className="text-[11px] text-[#64748B] block">{item.label}</span>
            <span className="text-[13px] font-medium text-[#0F172A]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
