interface CommissionCalcCardProps {
  data: Record<string, unknown>;
}

export function CommissionCalcCard({ data }: CommissionCalcCardProps) {
  const plans = (data.plans as Array<{ name: string; firstYear: number; renewal3y: number }>) || [
    { name: '均衡版', firstYear: 3200, renewal3y: 4800 },
    { name: '尊享版', firstYear: 5800, renewal3y: 8700 },
  ];
  const tip = (data.tip as string) || '可根据客户预算与需求灵活调整方案。';

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="px-4 py-2.5 bg-gradient-to-br from-[#10B981] to-[#059669]">
        <h3 className="text-white font-semibold text-[15px]">佣金测算</h3>
      </div>
      <div className="p-4 space-y-3">
        {plans.map((p, i) => (
          <div key={i} className="flex justify-between items-center py-2 px-3 rounded-lg bg-[#F8FAFC]">
            <span className="font-medium text-[14px]">{p.name}</span>
            <div className="text-right">
              <span className="text-[14px] text-[#0F172A]">首年 ¥{p.firstYear}</span>
              <span className="text-[12px] text-[#64748B] ml-2">续期3年 ¥{p.renewal3y}</span>
            </div>
          </div>
        ))}
        <p className="text-[13px] text-[#64748B]">{tip}</p>
      </div>
    </div>
  );
}
