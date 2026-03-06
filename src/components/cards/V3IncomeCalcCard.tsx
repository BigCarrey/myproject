interface PlanCalc {
  planName: string;
  yearlyPremium: string;
  firstYearRate: string;
  firstYearIncome: string;
  renewalIncome: string;
  highlight?: boolean;
}

interface V3IncomeCalcCardProps {
  data: Record<string, unknown>;
}

export function V3IncomeCalcCard({ data }: V3IncomeCalcCardProps) {
  const plans = (data.plans as PlanCalc[]) || [];
  const aiNote = data.aiNote as string | undefined;

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #059669 0%, #0D9488 100%)' }} className="px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">💰 代理人收益测算</h3>
        <p className="text-white/80 text-[12px] mt-0.5">基于两套方案的佣金收益预测</p>
      </div>

      <div className="p-3 space-y-3">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`rounded-xl overflow-hidden border ${plan.highlight ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50' : 'border-gray-100 bg-gray-50'}`}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-opacity-50 border-gray-200">
              <span className="font-semibold text-[14px] text-gray-800">{plan.planName}</span>
              {plan.highlight && (
                <span className="text-[11px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">推荐</span>
              )}
            </div>

            <div className="px-3 py-2.5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-500">年缴保费</span>
                <span className="text-[13px] font-semibold text-gray-800">{plan.yearlyPremium}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-500">首年佣金比例</span>
                <span className="text-[13px] font-semibold text-orange-600">{plan.firstYearRate}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-500">首年预计到手</span>
                <span className="text-[16px] font-bold text-emerald-600">{plan.firstYearIncome}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-500">续期3年合计</span>
                <span className="text-[13px] font-semibold text-emerald-700">{plan.renewalIncome}</span>
              </div>
            </div>
          </div>
        ))}

        {aiNote && (
          <div className="bg-[#F0FDF4] rounded-xl p-3 border border-emerald-200">
            <div className="flex gap-2 items-start">
              <span className="text-[14px] flex-shrink-0">📈</span>
              <p className="text-[12px] text-emerald-800 leading-relaxed">{aiNote}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
