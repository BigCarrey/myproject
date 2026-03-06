import { products } from '../../data/products';

interface ProductCardProps {
  data: Record<string, unknown>;
}

export function ProductCard({ data }: ProductCardProps) {
  const product = products.find((p) => p.id === data.productId);
  if (!product) return null;

  const reason = data.reason as string | undefined;

  const typeColors: Record<string, string> = {
    '终身寿险': 'from-[#3B82F6] to-[#1D4ED8]',
    '重疾险': 'from-[#6366F1] to-[#4F46E5]',
    '年金险': 'from-[#0EA5E9] to-[#0284C7]',
    '医疗险': 'from-[#10B981] to-[#059669]',
    '万能险': 'from-[#0EA5E9] to-[#0284C7]',
  };

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className={`bg-gradient-to-br ${typeColors[product.type] || 'from-[#3B82F6] to-[#1D4ED8]'} px-4 py-2`}>
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-[15px]">{product.name}</h3>
          <span className="bg-white/20 text-white text-[13px] px-2 py-0.5 rounded-full">{product.type}</span>
        </div>
      </div>
      <div className="p-3">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {product.features.map((f) => (
            <span key={f} className="text-[13px] bg-[#F8FAFC] text-[#475569] px-2 py-0.5 rounded-lg">
              {f}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[13px] mb-2">
          <div className="bg-[#F8FAFC] rounded-xl p-2">
            <span className="text-[#64748B]">保费</span>
            <p className="font-medium text-[#0F172A] mt-0.5">{product.premium}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-2">
            <span className="text-[#64748B]">保额</span>
            <p className="font-medium text-[#0F172A] mt-0.5">{product.coverage}</p>
          </div>
        </div>

        {reason && (
          <div className="p-2 bg-[#EFF6FF] rounded-xl text-[13px] text-[#1E3A8A]">
            💡 推荐理由：{reason}
          </div>
        )}
      </div>
    </div>
  );
}
