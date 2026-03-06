interface CustomerInsightCardProps {
  data: Record<string, unknown>;
}

export function CustomerInsightCard({ data }: CustomerInsightCardProps) {
  const age = (data.age as number) || 45;
  const job = (data.job as string) || '企业中高层';
  const hobby = (data.hobby as string) || '高尔夫';
  const family = (data.family as string) || '孩子 10 岁';
  const recent = (data.recent as string) || '体检查出三高';
  const preference = (data.preference as string) || '注重保障与性价比';

  const items = [
    { label: '年龄', value: age },
    { label: '职业', value: job },
    { label: '爱好', value: hobby },
    { label: '家庭', value: family },
    { label: '近期行为', value: recent },
    { label: '消费偏好', value: preference },
  ];

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="px-4 py-2.5 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]">
        <h3 className="text-white font-semibold text-[15px]">客户洞察</h3>
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
