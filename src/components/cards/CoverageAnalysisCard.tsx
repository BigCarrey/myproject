interface CoverageAnalysisCardProps {
  data: Record<string, unknown>;
}

interface CoverageItem {
  name: string;
  existing: string;
  gap: string;
  status: 'adequate' | 'gap' | 'missing';
  priority?: boolean;
}

interface CoverageCategory {
  category: string;
  icon: string;
  items: CoverageItem[];
}

const statusConfig = {
  adequate: { label: '保障充足', color: 'text-[#10B981]', bg: 'bg-[#F0FDF4]', barColor: 'bg-[#10B981]' },
  gap: { label: '', color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]', barColor: 'bg-[#F59E0B]' },
  missing: { label: '缺失', color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]', barColor: 'bg-[#FCA5A5]' },
};

export function CoverageAnalysisCard({ data }: CoverageAnalysisCardProps) {
  const customerName = (data.customerName as string) ?? '李平安';
  const categories = data.categories as CoverageCategory[] | undefined;

  const defaultCategories: CoverageCategory[] = [
    {
      category: '健康保障',
      icon: '🏥',
      items: [
        { name: '疾病保障', existing: '已有50万', gap: '缺50万', status: 'gap', priority: true },
        { name: '医疗保障', existing: '已有1类', gap: '缺2类', status: 'gap' },
        { name: '伤残保障', existing: '已有300万', gap: '保障充足', status: 'adequate' },
        { name: '护理保障', existing: '缺失', gap: '缺100万', status: 'missing' },
        { name: '身故保障', existing: '缺失', gap: '缺100万', status: 'missing' },
      ],
    },
    {
      category: '财富保障',
      icon: '💰',
      items: [
        { name: '财富管理', existing: '已有20万', gap: '缺150万', status: 'gap', priority: true },
      ],
    },
    {
      category: '养老保障',
      icon: '🏡',
      items: [
        { name: '养老储备', existing: '已有30万', gap: '缺180万', status: 'gap', priority: true },
      ],
    },
    {
      category: '传承保障',
      icon: '🤝',
      items: [
        { name: '传承储备', existing: '已有50万', gap: '缺100万', status: 'gap' },
      ],
    },
  ];

  const displayCategories = categories ?? defaultCategories;

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">🔍 {customerName}保障缺口分析</h3>
      </div>

      <div className="p-3">
        {/* Comparison tabs */}
        <div className="flex gap-2 mb-3">
          <button className="text-[11px] px-2.5 py-1 rounded-full bg-[#3B82F6] text-white">
            与前20%客群均值比
          </button>
          <button className="text-[11px] px-2.5 py-1 rounded-full bg-[#F8FAFC] text-[#475569]">
            与前50%客群均值比
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          {displayCategories.map((cat, catIndex) => (
            <div key={catIndex}>
              {/* Category header */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-sm">{cat.icon}</span>
                <span className="text-xs font-semibold text-[#0F172A]">{cat.category}</span>
              </div>

              {/* Items */}
              <div className="space-y-1.5 pl-1">
                {cat.items.map((item, itemIndex) => {
                  const config = statusConfig[item.status];
                  return (
                    <div key={itemIndex} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${config.bg}`}>
                      {/* Name */}
                      <span className="text-[11px] text-[#475569] w-14 flex-shrink-0">{item.name}</span>

                      {/* Progress bar */}
                      <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${config.barColor}`}
                          style={{
                            width: item.status === 'adequate' ? '100%' : item.status === 'gap' ? '40%' : '0%',
                          }}
                        />
                      </div>

                      {/* Existing info */}
                      <span className="text-[11px] text-[#64748B] w-16 text-right flex-shrink-0">
                        {item.existing}
                      </span>

                      {/* Gap / status */}
                      <span className={`text-[11px] font-medium w-16 text-right flex-shrink-0 ${config.color}`}>
                        {item.status === 'adequate' ? '✅ 充足' : item.gap}
                      </span>

                      {/* Priority tag */}
                      {item.priority && (
                        <span className="text-[10px] bg-[#D4AF37] text-white px-1.5 py-0.5 rounded flex-shrink-0">
                          建议优先
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Data source note */}
        <div className="mt-3 pt-2 border-t border-[#E2E8F0]">
          <p className="text-[10px] text-[#64748B]">
            📊 数据来源：公司内部保单 + 中银保信同业保障数据（已获客户授权）
          </p>
        </div>
      </div>
    </div>
  );
}
