interface MaterialsPackCardProps {
  data: Record<string, unknown>;
}

const DEFAULT_MATERIALS = [
  '一页纸方案',
  '核保说明',
  '理赔动图',
  '脱敏案例',
];

export function MaterialsPackCard({ data }: MaterialsPackCardProps) {
  const materials = (data.materials as string[]) || DEFAULT_MATERIALS;
  const customerName = (data.customerName as string) || '王哥';

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="px-4 py-2.5 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]">
        <h3 className="text-white font-semibold text-[15px]">素材包</h3>
      </div>
      <div className="p-4 space-y-2">
        {materials.map((m, i) => (
          <div key={i} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-[#F8FAFC]">
            <span className="w-6 h-6 rounded bg-[#E2E8F0] flex items-center justify-center text-[10px] text-[#64748B]">
              {i + 1}
            </span>
            <span className="text-[14px] text-[#0F172A]">{m}</span>
          </div>
        ))}
        <button
          className="mt-3 w-full py-2.5 rounded-xl text-white font-medium text-[14px]"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
        >
          一键全部发送给{customerName}
        </button>
      </div>
    </div>
  );
}
