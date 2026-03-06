interface IncomeCardProps {
  data: Record<string, unknown>;
}

export function IncomeCard({ data }: IncomeCardProps) {
  const period = data.period as string;
  const basicSalary = data.basicSalary as number;
  const commission = data.commission as number;
  const bonus = data.bonus as number;
  const teamOverride = data.teamOverride as number;
  const total = data.total as number;
  const comparison = data.comparison as string;
  const yearlyTotal = data.yearlyTotal as number;
  const yearlyTarget = data.yearlyTarget as number;
  const ranking = data.ranking as string;
  const bonusAlert = data.bonusAlert as string;

  const items = [
    { label: '基本工资', amount: basicSalary, icon: '💼' },
    { label: '佣金收入', amount: commission, icon: '💰' },
    { label: '奖金', amount: bonus, icon: '🏆' },
    { label: '管理津贴', amount: teamOverride, icon: '👥' },
  ];

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-3">
        <p className="text-white/80 text-[13px]">{period}</p>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-white text-2xl font-bold">
            ¥{total.toLocaleString()}
          </span>
          <span className="text-white/80 text-[15px] font-medium mb-0.5">
            {comparison} 环比上月
          </span>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {/* Income breakdown */}
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-[15px]">
              <span className="text-[#475569] flex items-center gap-1.5">
                <span>{item.icon}</span>
                {item.label}
              </span>
              <span className="font-medium">¥{item.amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-[#E2E8F0] pt-1.5 flex items-center justify-between text-[15px] font-bold">
            <span className="text-[#0F172A]">合计</span>
            <span className="text-[#3B82F6]">¥{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Year progress */}
        <div className="bg-[#F8FAFC] rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[13px] mb-1">
            <span className="text-[#475569]">年度收入进度</span>
            <span className="font-medium">
              {(yearlyTotal / 10000).toFixed(1)}万 / {(yearlyTarget / 10000).toFixed(0)}万
            </span>
          </div>
          <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] rounded-full"
              style={{ width: `${Math.round((yearlyTotal / yearlyTarget) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[13px] mt-1">
            <span className="text-[#475569]">排名：{ranking}</span>
            <span className="text-[#10B981] font-medium">
              {Math.round((yearlyTotal / yearlyTarget) * 100)}%
            </span>
          </div>
        </div>

        {/* Bonus alert */}
        {bonusAlert && (
          <div className="bg-[#FEF3C7] rounded-xl p-2 text-[13px] text-[#B45309] font-medium">
            🔥 {bonusAlert}
          </div>
        )}
      </div>
    </div>
  );
}
