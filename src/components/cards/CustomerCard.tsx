import { customers } from '../../data/customers';

interface CustomerCardProps {
  data: Record<string, unknown>;
}

const priorityColors = {
  high: 'bg-[#FEF3C7] text-[#B45309]',
  medium: 'bg-[#EFF6FF] text-[#1D4ED8]',
  low: 'bg-[#F0FDF4] text-[#10B981]',
};

const priorityLabels = { high: '高优先', medium: '中优先', low: '低优先' };

export function CustomerCard({ data }: CustomerCardProps) {
  const customer = customers.find((c) => c.id === data.customerId);
  if (!customer) return null;

  return (
    <div className="crystal rounded-[24px] overflow-hidden w-full border border-white/80">
      <div className="p-4 flex flex-col gap-3">

        {/* 顶部个人信息 */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex-shrink-0 flex items-center justify-center text-[#3B82F6] font-medium text-[15px]">
            {customer.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[15px] text-[#0F172A]">{customer.name}</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${priorityColors[customer.priority]}`}>
                {priorityLabels[customer.priority]}
              </span>
            </div>
            <p className="text-[13px] text-[#475569] mt-0.5">
              {customer.age}岁 · {customer.occupation}
            </p>
          </div>
        </div>

        {/* 标签区域 */}
        <div className="flex flex-wrap gap-1.5">
          {customer.tags.map((tag) => (
            <span key={tag} className="text-[12px] bg-[#F8FAFC] text-[#475569] px-2 py-0.5 rounded-lg border border-[#E2E8F0]">
              {tag}
            </span>
          ))}
        </div>

        {/* 💡 黄色备注栏 */}
        {customer.notes && (
          <div className="bg-[#FFF9E7] rounded-xl p-3 border-l-4 border-[#D4AF37]">
            <div className="flex gap-1.5 items-start">
              <span className="text-[13px] flex-shrink-0">💡</span>
              <p className="text-[13px] text-[#92400E] leading-relaxed break-words">
                {customer.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
