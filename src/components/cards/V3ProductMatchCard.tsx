interface Plan {
  name: string;
  tag: string;
  tagColor: string;
  products: string[];
  yearlyPremium: string;
  features: string[];
  recommended?: boolean;
  aiNote?: string;
}

interface V3ProductMatchCardProps {
  data: Record<string, unknown>;
}

export function V3ProductMatchCard({ data }: V3ProductMatchCardProps) {
  const plans = (data.plans as Plan[]) || [];
  const aiRecommendNote = data.aiRecommendNote as string | undefined;

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }} className="px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">📦 产品精准匹配</h3>
        <p className="text-white/80 text-[12px] mt-0.5">基于画像 + 缺口分析，AI 自动输出两套方案</p>
      </div>

      <div className="p-3 space-y-3">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`rounded-xl overflow-hidden border-2 ${plan.recommended ? 'border-orange-300' : 'border-gray-100'}`}
          >
            {/* Plan header */}
            <div className={`flex items-center justify-between px-3 py-2.5 ${plan.recommended ? 'bg-gradient-to-r from-orange-50 to-amber-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[15px] text-gray-800">{plan.name}</span>
                <span
                  className="text-[11px] px-1.5 py-0.5 rounded font-bold text-white"
                  style={{ background: plan.tagColor }}
                >
                  {plan.tag}
                </span>
                {plan.recommended && (
                  <span className="text-[11px] bg-orange-400 text-white px-1.5 py-0.5 rounded font-bold">主推</span>
                )}
              </div>
              <span className="text-[14px] font-bold text-orange-600">{plan.yearlyPremium}<span className="text-[11px] text-gray-400">/年</span></span>
            </div>

            {/* Products */}
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="flex flex-wrap gap-1.5">
                {plan.products.map((prod, j) => (
                  <span key={j} className="text-[12px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                    {prod}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="px-3 py-2.5 space-y-1.5">
              {plan.features.map((f, j) => (
                <div key={j} className="flex gap-2 items-start">
                  <span className="text-green-500 mt-0.5 flex-shrink-0 text-[13px]">✓</span>
                  <p className="text-[12px] text-gray-700 leading-relaxed">{f}</p>
                </div>
              ))}
            </div>

            {/* AI note */}
            {plan.aiNote && (
              <div className="mx-3 mb-3 bg-[#FFF9E7] rounded-lg p-2 border-l-4 border-amber-300">
                <p className="text-[12px] text-amber-800">💡 {plan.aiNote}</p>
              </div>
            )}
          </div>
        ))}

        {/* AI recommendation note */}
        {aiRecommendNote && (
          <div className="bg-[#F5F3FF] rounded-xl p-3 border border-purple-100">
            <div className="flex gap-2 items-start">
              <span className="text-[14px] flex-shrink-0">🤖</span>
              <p className="text-[12px] text-purple-800 leading-relaxed">{aiRecommendNote}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
