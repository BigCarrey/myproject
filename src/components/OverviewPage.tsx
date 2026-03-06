import { useCallback } from 'react';

const OVERVIEW_NARRATION =
  '传统代理人靠记忆、靠表格、靠人力堆砌。效率低、易遗漏、客户一多就顾不过来。' +
  '万能营销助手，基于 OpenClaw 智能体架构，实现自动感知、主动触达、自主规划、智能执行四大能力。' +
  '自动感知：识别客户私信、朋友圈动态、情绪与意向，无需你主动搜索。主动触达：月初提醒盘点、每周推送计划、拜访前推送方案，无需你触发，AI 主动推送。自主规划：将目标拆解为可执行动作，保障检视、话术推荐、缺口诊断一气呵成。智能执行：今日待办、回访提醒、学习计划、收入追踪，任务自动编排，全天候在线。' +
  '从靠人力到靠智能，这就是代际鸿沟。' +
  '点击开始演示，亲眼见证颠覆。';

interface OverviewPageProps {
  onStart: () => void;
  narrate: (text: string, onEnd?: () => void) => void;
}

/** OpenClaw 技术特性 × 代理人业务场景（面向业务领导） */
const openClawCapabilities = [
  {
    name: '自动感知',
    desc: '识别私信意图、朋友圈动态、客户情绪与意向阶段',
    scene: '无需你搜，AI 先懂',
    icon: '👁',
    color: '#6366F1',
  },
  {
    name: '主动触达',
    desc: '月初提醒盘点、每周推送计划、拜访前推送方案',
    scene: '无需你触发，AI 主动推送',
    icon: '🚀',
    color: '#10B981',
  },
  {
    name: '自主规划',
    desc: '目标拆解为可执行动作，保障检视→话术→缺口一气呵成',
    scene: '感知→规划→行动→反馈',
    icon: '📐',
    color: '#3B82F6',
  },
  {
    name: '智能执行',
    desc: '今日待办、回访提醒、学习计划、收入追踪，任务自动编排',
    scene: '全天候在线，只等你确认',
    icon: '📋',
    color: '#3B82F6',
  },
];

/** 传统 vs AI 对比，第一屏抓眼球 */
const contrastItems = [
  {
    scene: '朋友圈发什么',
    traditional: '自己想半天，复制粘贴',
    ai: '秒级生成，人设+热点+城市融合',
    icon: '📱',
    color: '#07C160',
  },
  {
    scene: '客户私信来了',
    traditional: '查资料、想话术、怕说错',
    ai: '先分析情绪再生成，一键发送',
    icon: '💬',
    color: '#6366F1',
  },
  {
    scene: '拜访前准备',
    traditional: '翻档案、做方案、半小时起',
    ai: 'AI 主动推送，保障检视+方案自动生成',
    icon: '💼',
    color: '#4F6BF6',
  },
  {
    scene: '拜访后记录',
    traditional: '写半天总结，容易忘细节',
    ai: '说话即记录，秒变总结+跟进计划',
    icon: '📝',
    color: '#4F6BF6',
  },
];

export function OverviewPage({ onStart, narrate }: OverviewPageProps) {
  const handleTitleClick = useCallback(() => {
    narrate(OVERVIEW_NARRATION);
  }, [narrate]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.overview-start-btn') || (e.target as HTMLElement).closest('.overview-contrast-card') || (e.target as HTMLElement).closest('.overview-capability-card')) return;
      const synth = window.speechSynthesis;
      if (synth && !synth.speaking && !synth.pending) {
        narrate(OVERVIEW_NARRATION);
      }
    },
    [narrate]
  );

  return (
    <div className="overview-page relative" onClick={handleClick}>
      {/* 噪点纹理覆盖层 */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Hero */}
      <div className="overview-hero">
        <h1
          className="overview-title cursor-pointer select-none hover:opacity-90 active:scale-[0.98] transition-all"
          onClick={handleTitleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleTitleClick()}
          title="点击播放介绍"
        >
          万能营销
        </h1>
        <p className="overview-subtitle">AI 驱动的智能保险销售全流程解决方案</p>
        <p className="text-[12px] font-semibold text-[#1E3A8A] tracking-wide mt-0.5">
          从靠记忆到靠智能 · 从靠人力到靠 AI
        </p>
      </div>

      {/* 代际鸿沟金句 */}
      <div className="overview-quote-block crystal rounded-[16px] border border-white/80">
        <p className="text-[12px] font-medium text-[#0F172A] text-center">
          传统代理人靠人力堆砌 · AI 代理人靠智能赋能
        </p>
        <p className="text-[16px] font-bold text-[#1D4ED8] mt-0.5 text-center tracking-wide">
          这就是代际鸿沟
        </p>
      </div>

      {/* 传统 vs AI 对比 - 2x2 对称网格 */}
      <div className="overview-section">
        <h3 className="overview-section-title">
          <span className="text-[#94a3b8]">传统方式</span>
          <span className="mx-2 text-[#64748B]">→</span>
          <span className="text-[#1E3A8A]">万能营销</span>
        </h3>
        <div className="overview-grid-2x2">
          {contrastItems.map((c) => (
            <div
              key={c.scene}
              className="overview-contrast-card crystal rounded-[14px] border border-white/80 p-2.5"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: `${c.color}22`, color: c.color }}
                >
                  {c.icon}
                </span>
                <span className="font-semibold text-[12px] text-[#0F172A] truncate">{c.scene}</span>
              </div>
              <div className="space-y-0.5 text-[11px]">
                <div className="flex items-start gap-1">
                  <span className="text-[#94a3b8] flex-shrink-0 w-6">传统</span>
                  <span className="text-[#64748B] line-through truncate">{c.traditional}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="font-medium flex-shrink-0 w-6" style={{ color: c.color }}>AI</span>
                  <span className="text-[#0F172A] font-medium truncate">{c.ai}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 智能体四大能力 - 2x2 对称网格 */}
      <div className="overview-section">
        <h3 className="overview-section-title">智能体四大能力</h3>
        <div className="overview-grid-2x2">
          {openClawCapabilities.map((cap) => (
            <div
              key={cap.name}
              className="overview-capability-card crystal rounded-[14px] border border-white/80 p-2.5"
            >
              <div className="flex items-start gap-2">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${cap.color}22`, color: cap.color }}
                >
                  {cap.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[12px] text-[#0F172A]">{cap.name}</p>
                  <p className="text-[10px] text-[#64748B] mt-0.5 leading-tight line-clamp-2">{cap.desc}</p>
                  <p className="text-[10px] font-medium mt-0.5" style={{ color: cap.color }}>{cap.scene}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="overview-cta">
        <button className="overview-start-btn group shimmer" onClick={onStart}>
          开始演示
        </button>
      </div>
    </div>
  );
}
