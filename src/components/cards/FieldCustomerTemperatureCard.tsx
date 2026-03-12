import { useEffect, useRef } from 'react';

interface TemperatureData {
  total?: number;
  hotCount?: number;
  coldCount?: number;
  conversionRate?: string;
}

interface Props {
  data: Record<string, unknown>;
}

export function FieldCustomerTemperatureCard({ data }: Props) {
  const d = data as unknown as TemperatureData;
  const total = d.total ?? 20;
  const hotCount = d.hotCount ?? 8;
  const coldCount = d.coldCount ?? 5;
  const neutralCount = total - hotCount - coldCount;
  const conversionRate = d.conversionRate ?? '~10%';

  const hotPct = (hotCount / total) * 100;
  const neutralPct = (neutralCount / total) * 100;
  const coldPct = (coldCount / total) * 100;

  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'scaleX(0.6)';
    el.style.transformOrigin = 'left';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.5s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
      el.style.opacity = '1';
      el.style.transform = 'scaleX(1)';
    });
  }, []);

  return (
    <div className="rounded-[16px] overflow-hidden" style={{ background: '#fff', border: '1px solid #F1F5F9' }}>
      {/* Header */}
      <div className="px-3.5 pt-3 pb-2 flex items-center gap-2">
        <span className="text-[15px]">🌡️</span>
        <span className="text-[11px] font-semibold text-[#374151]">近半年互动温度分析</span>
        <span className="ml-auto text-[9px] text-[#94A3B8]">共 {total} 位客户</span>
      </div>

      {/* Temperature bar */}
      <div className="px-3.5 pb-2">
        <div ref={barRef} className="flex h-3 rounded-full overflow-hidden gap-[2px]">
          <div style={{ width: `${hotPct}%`, background: 'linear-gradient(90deg, #F97316, #EF4444)', borderRadius: '999px 0 0 999px', minWidth: 8 }} />
          <div style={{ width: `${neutralPct}%`, background: '#E2E8F0', minWidth: 8 }} />
          <div style={{ width: `${coldPct}%`, background: 'linear-gradient(90deg, #93C5FD, #60A5FA)', borderRadius: '0 999px 999px 0', minWidth: 8 }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-[#F97316] font-medium">🔥 热/温 {hotCount}位</span>
          <span className="text-[9px] text-[#94A3B8]">观望 {neutralCount}位</span>
          <span className="text-[9px] text-[#60A5FA] font-medium">❄️ 冷却 {coldCount}位</span>
        </div>
      </div>

      {/* Two action cards */}
      <div className="px-2.5 pb-3 grid grid-cols-2 gap-2">
        {/* Hot card */}
        <div className="rounded-[12px] px-3 py-2.5" style={{ background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[13px]"
              style={{ background: 'linear-gradient(135deg, #F97316, #EF4444)' }}>
              {hotCount}
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#C2410C]">中高温客户</div>
              <div className="text-[8.5px] text-[#EA580C]">转化率 {conversionRate}</div>
            </div>
          </div>
          <div className="text-[8.5px] text-[#92400E] leading-[1.5]">
            🎯 建议尽快邀约拜访，直接进行产品推荐
          </div>
        </div>

        {/* Cold card */}
        <div className="rounded-[12px] px-3 py-2.5" style={{ background: 'linear-gradient(135deg, #F0F9FF, #EFF6FF)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[13px]"
              style={{ background: 'linear-gradient(135deg, #60A5FA, #3B82F6)' }}>
              {coldCount}
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#1D4ED8]">冷却客户</div>
              <div className="text-[8.5px] text-[#3B82F6]">长期未联系</div>
            </div>
          </div>
          <div className="text-[8.5px] text-[#1E40AF] leading-[1.5]">
            💬 加强线上互动频次，提升客户关系
          </div>
        </div>
      </div>
    </div>
  );
}
