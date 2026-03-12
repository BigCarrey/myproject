import { useState, useEffect } from 'react';

interface Segment {
  type: string;
  count: number;
  icon: string;
  color: string;
  bg: string;
  isNew?: boolean;
  customers?: SegmentCustomer[];
}

interface SegmentCustomer {
  name: string;
  detail?: string;
}

interface Customer {
  name: string;
  tag: string;
  tagColor: string;
}

interface PlanData {
  title?: string;
  totalCount?: number;
  conversionRate?: string;
  estimatedConversion?: string;
  segments?: Segment[];
  customers?: Customer[];
  aiNote?: string;
  isUpdated?: boolean;
  updatedTotal?: number;
}

interface FieldCustomerPlanCardProps {
  data: Record<string, unknown>;
}

function AnimatedCount({ target, duration = 800 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}</span>;
}

function ExpandableSegment({ seg, color }: { seg: Segment; color: string }) {
  const [expanded, setExpanded] = useState(false);
  const hasCustomers = seg.customers && seg.customers.length > 0;

  return (
    <div
      className="rounded-[12px] overflow-hidden transition-all duration-300"
      style={{ background: seg.bg }}
    >
      <div
        className="flex items-center gap-2 px-2.5 py-2 cursor-pointer"
        onClick={() => hasCustomers && setExpanded((v) => !v)}
        style={{ userSelect: 'none' }}
      >
        <span className="text-[16px]">{seg.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-[#1a1a1a]">{seg.type}</span>
            {seg.isNew && (
              <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white" style={{ background: '#3B82F6' }}>
                新增
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="min-w-[28px] h-[28px] rounded-full flex items-center justify-center font-bold text-[13px] text-white"
            style={{ background: color }}
          >
            {seg.count}
          </div>
          {hasCustomers && (
            <span
              className="text-[10px] transition-transform duration-200 inline-block"
              style={{ color, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              ▾
            </span>
          )}
        </div>
      </div>

      {/* Expandable customer list */}
      {expanded && hasCustomers && (
        <div
          className="px-3 pb-2.5 pt-0"
          style={{ borderTop: `1px solid ${color}20` }}
        >
          <div className="flex flex-col gap-1 mt-1.5">
            {seg.customers!.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-2 py-1 rounded-[8px]"
                style={{ background: 'rgba(255,255,255,0.65)' }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0"
                  style={{ background: color }}
                >
                  {c.name.charAt(0)}
                </div>
                <span className="text-[11px] text-[#1a1a1a] font-medium">{c.name}</span>
                {c.detail && (
                  <span className="text-[9px] text-[#666] ml-auto">{c.detail}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function FieldCustomerPlanCard({ data }: FieldCustomerPlanCardProps) {
  const d = (data as unknown as PlanData) || {};
  const segments: Segment[] = d.segments || [
    {
      type: '银行存款到期客户',
      count: 5,
      icon: '🏦',
      color: '#F59E0B',
      bg: '#FFFBEB',
      customers: [
        { name: '陈先生', detail: '存款300万 · 本月到期' },
        { name: '刘女士', detail: '存款150万 · 本月到期' },
        { name: '张先生', detail: '存款200万 · 下月到期' },
        { name: '王总', detail: '存款500万 · 本月到期' },
        { name: '赵女士', detail: '存款80万 · 本月到期' },
      ],
    },
    {
      type: '旺财余额 > 5万',
      count: 3,
      icon: '💰',
      color: '#10B981',
      bg: '#ECFDF5',
      customers: [
        { name: '李先生', detail: '旺财余额 12万' },
        { name: '孙女士', detail: '旺财余额 8万' },
        { name: '周先生', detail: '旺财余额 6万' },
      ],
    },
    {
      type: '资产规模 > 600W',
      count: 10,
      icon: '👑',
      color: '#7C3AED',
      bg: '#F5F3FF',
      customers: [
        { name: '陈先生', detail: '资产约850万' },
        { name: '马总', detail: '资产约1200万' },
        { name: '林女士', detail: '资产约720万' },
        { name: '黄先生', detail: '资产约680万' },
        { name: '吴女士', detail: '资产约900万' },
        { name: '郑总', detail: '资产约1500万' },
        { name: '冯先生', detail: '资产约650万' },
        { name: '沈女士', detail: '资产约780万' },
        { name: '韩先生', detail: '资产约620万' },
        { name: '唐总', detail: '资产约2000万' },
      ],
    },
    {
      type: '冷却客户',
      count: 5,
      icon: '❄️',
      color: '#94A3B8',
      bg: '#F8FAFC',
      customers: [
        { name: '高先生', detail: '资产约680万 · 8个月未联系' },
        { name: '柳女士', detail: '旺财15万 · 6个月未联系' },
        { name: '余先生', detail: '资产约520万 · 5个月未联系' },
        { name: '白女士', detail: '存款100万 · 7个月未联系' },
        { name: '许先生', detail: '资产约450万 · 4个月未联系' },
      ],
    },
  ];

  const displaySegments = segments;

  const totalCount = d.totalCount || 20;
  const isUpdated = d.isUpdated || false;
  const updatedTotal = d.updatedTotal || totalCount;

  return (
    <div className="rounded-[20px] overflow-hidden shadow-sm border border-gray-100" style={{ background: '#fff' }}>
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-bold text-[14px]">🎯 客群智能推荐</div>
            <div className="text-white/70 text-[10px] mt-0.5">{d.title || '4月重点经营客户'}</div>
          </div>
          <div className="text-right">
            <div className="text-white font-black text-[28px] leading-none">
              <AnimatedCount target={isUpdated ? updatedTotal : totalCount} />
            </div>
            <div className="text-white/70 text-[9px]">位重点客户</div>
          </div>
        </div>

        {/* Conversion rate bar */}
        <div className="mt-2.5 bg-white/20 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full"
            style={{
              width: '10%',
              background: 'linear-gradient(90deg, #FCD34D, #F59E0B)',
              transition: 'width 1s ease-out',
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-white/60 text-[9px]">预计转化率 {d.conversionRate || '~10%'}</span>
          <span className="text-[#FCD34D] text-[9px] font-semibold">预计成交 {d.estimatedConversion || '2人'}</span>
        </div>
      </div>

      {/* Segments — tap to expand */}
      <div className="px-3 py-2.5 space-y-1.5">
        <div className="text-[9px] text-[#999] mb-1 font-medium flex items-center gap-1">
          <span>点击可展开查看客户名单</span>
          <span style={{ opacity: 0.5 }}>▾</span>
        </div>
        {displaySegments.map((seg, i) => (
          <ExpandableSegment key={i} seg={seg} color={seg.color} />
        ))}
      </div>

      {/* AI note */}
      {d.aiNote && (
        <div className="mx-3 mb-3 px-3 py-2 rounded-[12px]" style={{ background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)' }}>
          <div className="flex items-start gap-1.5">
            <span className="text-[12px] mt-0.5">🤖</span>
            <p className="text-[10px] text-[#374151] leading-[1.5]">{d.aiNote}</p>
          </div>
        </div>
      )}

      {isUpdated && (
        <div className="mx-3 mb-3 flex items-center gap-1.5 px-3 py-2 rounded-[12px]" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
          <span className="text-[14px]">✅</span>
          <span className="text-[10px] text-[#16A34A] font-medium">计划已按您要求更新，共 {updatedTotal} 位重点客户</span>
        </div>
      )}
    </div>
  );
}
