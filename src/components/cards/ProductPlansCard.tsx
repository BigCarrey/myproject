import { useState, useEffect, useRef } from 'react';
import { preVisitLiPinganPlans } from '../../data/scenarioProducts';
import type { ScenarioProductPlan } from '../../data/scenarioProducts';

interface ProductPlansCardProps {
  data: Record<string, unknown>;
}

export function ProductPlansCard({ data }: ProductPlansCardProps) {
  const plans = data.plans as ScenarioProductPlan[] | undefined;
  const needsSummary = (data.needsSummary as string) ?? '';
  const firstItemDelay = (data.firstItemDelay as number) ?? 600;
  const itemRevealDelay = (data.itemRevealDelay as number) ?? 1200;

  const displayPlans = plans ?? preVisitLiPinganPlans;

  const [visibleCount, setVisibleCount] = useState(0);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  // Progressive plan reveal
  useEffect(() => {
    if (visibleCount >= displayPlans.length) return;

    const delay = visibleCount === 0 ? firstItemDelay : itemRevealDelay;
    const timer = window.setTimeout(() => {
      setVisibleCount((prev) => prev + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [visibleCount, displayPlans.length, firstItemDelay, itemRevealDelay]);

  // Auto-scroll when a new plan card appears
  useEffect(() => {
    if (visibleCount > 0 && scrollAnchorRef.current) {
      const t = window.setTimeout(() => {
        scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
      return () => window.clearTimeout(t);
    }
  }, [visibleCount]);

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">📋 智能方案推荐</h3>
      </div>

      <div className="p-3">
        {/* Needs summary */}
        {needsSummary && (
          <div className="bg-[#F8FAFC] rounded-xl px-3 py-2 mb-3">
            <p className="text-xs text-[#475569]">{needsSummary}</p>
          </div>
        )}

        {/* Plans - progressive reveal */}
        <div className="space-y-3">
          {displayPlans.map((plan: ScenarioProductPlan, index: number) => {
            if (index >= visibleCount) return null;
            return (
              <div
                key={index}
                className={`rounded-xl border overflow-hidden animate-step-item-reveal ${
                  plan.recommended
                    ? 'border-[#3B82F6]/40 ring-1 ring-[#BFDBFE]'
                    : 'border-[#E2E8F0]'
                }`}
              >
                {/* Plan header */}
                <div className={`px-3 py-2 flex items-center justify-between ${
                  plan.recommended ? 'bg-[#EFF6FF]' : 'bg-[#F8FAFC]'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] text-white px-1.5 py-0.5 rounded ${plan.tagColor}`}>
                      {plan.tag}
                    </span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{plan.name}</span>
                    {plan.subName && (
                      <span className="text-[11px] text-[#64748B]">{plan.subName}</span>
                    )}
                  </div>
                  {plan.recommended && (
                    <span className="text-[10px] bg-[#3B82F6] text-white px-2 py-0.5 rounded-full">
                      优先推荐
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="px-3 py-2">
                  <div className="grid grid-cols-4 gap-2">
                    {plan.metrics.map((metric: { label: string; value: string }, i: number) => (
                      <div key={i} className="text-center">
                        <p className="text-[10px] text-[#64748B]">{metric.label}</p>
                        <p className="text-[13px] font-semibold text-[#0F172A]">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service */}
                {plan.service && (
                  <div className="px-3 pb-1.5">
                    <span className="text-[11px] text-[#3B82F6] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                      🎁 {plan.service}
                    </span>
                  </div>
                )}

                {/* Highlights */}
                {plan.highlights && plan.highlights.length > 0 && (
                  <div className="px-3 pb-2.5">
                    {plan.highlights.map((hl: string, i: number) => (
                      <p key={i} className="text-[11px] text-[#475569] leading-relaxed">
                        • {hl}
                      </p>
                    ))}
                  </div>
                )}

                {/* 促成概率 */}
                {plan.closeProbability != null && (
                  <div className="px-3 pb-2 flex items-center justify-between">
                    <span className="text-[11px] text-[#475569]">促成概率</span>
                    <span className={`text-[13px] font-bold ${plan.closeProbability >= 70 ? 'text-[#10B981]' : plan.closeProbability >= 40 ? 'text-[#3B82F6]' : 'text-[#6366F1]'}`}>
                      {plan.closeProbability}%
                    </span>
                  </div>
                )}

                {/* 风险提示 */}
                {plan.riskHint && (
                  <div className="px-3 pb-2.5">
                    <span className="text-[10px] bg-[#FEF3C7] text-[#B45309] px-2 py-1 rounded-lg block">
                      ⚠️ {plan.riskHint}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking dots while plans are being revealed */}
          {visibleCount > 0 && visibleCount < displayPlans.length && (
            <div className="flex items-center gap-1.5 px-2 py-1 animate-step-item-reveal">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px] text-[#3B82F6] ml-1">匹配中...</span>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={scrollAnchorRef} />
        </div>
      </div>
    </div>
  );
}
