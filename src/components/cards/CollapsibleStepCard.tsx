import { useState, useEffect, useRef, useCallback } from 'react';
import { CustomerCard } from './CustomerCard';
import { CustomerProfileGrid } from './CustomerProfileGrid';
import { CoverageAnalysisCard } from './CoverageAnalysisCard';

interface StepItem {
  type: string;
  content?: string;
  data?: Record<string, unknown>;
}

interface CollapsibleStepCardProps {
  data: Record<string, unknown>;
}

export function CollapsibleStepCard({ data }: CollapsibleStepCardProps) {
  const title = (data.title as string) ?? '';
  const stepIcon = (data.stepIcon as string) ?? '🔍';
  const autoCollapse = (data.autoCollapse as boolean) ?? true;
  const collapseDelay = (data.collapseDelay as number) ?? 3000;
  const summary = (data.summary as string) ?? '';
  const items = (data.items as StepItem[]) ?? [];
  const itemRevealDelay = (data.itemRevealDelay as number) ?? 1500;
  const firstItemDelay = (data.firstItemDelay as number) ?? 800;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const allItemsVisible = visibleCount >= items.length;

  // Progressive item reveal: items appear one by one
  useEffect(() => {
    if (visibleCount >= items.length) return;

    const delay = visibleCount === 0 ? firstItemDelay : itemRevealDelay;
    const timer = window.setTimeout(() => {
      setVisibleCount((prev) => prev + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [visibleCount, items.length, itemRevealDelay, firstItemDelay]);

  // Re-measure content height as items are progressively revealed
  const measureHeight = useCallback(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    measureHeight();
    // Also measure after a brief delay for images/cards that render async
    const t = window.setTimeout(measureHeight, 100);
    return () => window.clearTimeout(t);
  }, [visibleCount, measureHeight]);

  // Auto-scroll to keep newly revealed items visible
  useEffect(() => {
    if (visibleCount > 0 && scrollAnchorRef.current) {
      const t = window.setTimeout(() => {
        scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
      return () => window.clearTimeout(t);
    }
  }, [visibleCount]);

  // Auto-collapse AFTER all items are visible + collapseDelay
  useEffect(() => {
    if (!autoCollapse || !allItemsVisible) return;

    const timer = window.setTimeout(() => {
      setIsCompleted(true);
      setIsCollapsed(true);
    }, collapseDelay);
    return () => window.clearTimeout(timer);
  }, [autoCollapse, collapseDelay, allItemsVisible]);

  const toggle = () => setIsCollapsed((prev) => !prev);

  const renderItem = (item: StepItem, index: number) => {
    switch (item.type) {
      case 'customer-card':
        return <CustomerCard key={index} data={item.data ?? {}} />;
      case 'customer-profile-grid':
        return <CustomerProfileGrid key={index} data={item.data ?? {}} />;
      case 'coverage-analysis':
        return <CoverageAnalysisCard key={index} data={item.data ?? {}} />;
      case 'text':
        return (
          <div key={index} className="glass rounded-xl px-3 py-2">
            <p className="text-[13px] text-[#0F172A] leading-relaxed">{item.content}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-[24px] overflow-hidden crystal border border-white/80">
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-300 ${
          isCompleted
            ? 'bg-gradient-to-r from-[#F0FDF4] to-[#D1FAE5] hover:from-[#D1FAE5] hover:to-[#A7F3D0]'
            : 'bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE]'
        }`}
        onClick={toggle}
      >
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          )}
          <span className="text-[14px] font-semibold text-[#0F172A]">{stepIcon} {title}</span>
          {isCompleted ? (
            <span className="text-[11px] text-[#10B981] font-medium ml-1">已完成</span>
          ) : (
            <span className="text-[11px] text-[#3B82F6] font-medium ml-1 animate-pulse">分析中...</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-[#64748B] transition-transform duration-300 flex-shrink-0 ${
            isCollapsed ? '' : 'rotate-180'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          maxHeight: isCollapsed ? '0px' : `${contentHeight || 2000}px`,
          opacity: isCollapsed ? 0 : 1,
        }}
      >
        <div className="p-3 space-y-3 bg-[#F8FAFC]/50 border-t border-white/50">
          {items.map((item, index) => {
            if (index >= visibleCount) return null;
            return (
              <div key={index} className="animate-step-item-reveal">
                {renderItem(item, index)}
              </div>
            );
          })}
          {/* Thinking dots when items are still being revealed */}
          {!allItemsVisible && visibleCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 animate-step-item-reveal">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px] text-[#3B82F6] ml-1">思考中...</span>
            </div>
          )}
          {/* Scroll anchor for auto-scroll during item reveal */}
          <div ref={scrollAnchorRef} />
        </div>
      </div>

      {/* Summary when collapsed */}
      {isCollapsed && summary && (
        <div className="px-4 py-2 border-t border-white/50 bg-[#F0FDF4]/50 animate-fade-in">
          <p className="text-[11px] text-[#475569] leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
}
