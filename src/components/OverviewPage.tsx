import { useEffect, useCallback } from 'react';

const OVERVIEW_NARRATION =
  '欢迎体验"万能营销助手"。' +
  '一位资深代理人，每天面对几十位客户、无数待办，传统方式靠记忆、靠表格，效率低、易遗漏。' +
  '今天，我们重新思考：当AI深度融入展业全流程，会发生什么？' +
  '我们打造了四大核心能力。' +
  '深度可视化：保障缺口一目了然，需求洞察如影随形。' +
  '服务被动转主动：计划自动驱动，提醒走在行动之前。' +
  '对话即交易：语音实时交互，异议处理与拜访总结，秒级完成。' +
  '闭环式成交：从盘点到复盘，业绩全链路智能驱动。' +
  '从月初客户盘点、周初经营计划，到每日拜访前的方案准备、拜访后的精准记录，当晚的团队辅导，周末与月末的高效复盘。' +
  '全时段、全场景、全闭环。' +
  '下面，让我们看看，一位代理人的一天，如何被AI彻底改变。';

interface OverviewPageProps {
  onStart: () => void;
  narrate: (text: string, onEnd?: () => void) => void;
}

const pillars = [
  {
    icon: '📊',
    title: '深度可视化',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    points: [
      '客户画像多维分析，精准定位客群',
      '保障缺口可视化，量化需求差距',
      '团队经营数据仪表盘，实时掌握全局',
    ],
  },
  {
    icon: '🔔',
    title: '服务被动转主动',
    color: '#2563EB',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    points: [
      '每月自动提醒盘点客户，生成经营计划',
      '每周推送行事历，持续跟进不遗漏',
      '拜访前主动提醒，提前准备方案',
    ],
  },
  {
    icon: '💬',
    title: '对话即交易',
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    points: [
      '对话式定制产品方案，自然流畅',
      '语音智能记录拜访，自动生成总结',
      '实时推送销售攻略与异议处理话术',
    ],
  },
  {
    icon: '🎯',
    title: '闭环式成交',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    points: [
      '盘点→计划→拜访→复盘，全流程闭环',
      '智能推荐附近客户，提升拜访效率',
      '收入激励追踪，驱动目标达成',
    ],
  },
];

const timeline = [
  { icon: '📋', label: '每月初', desc: '盘点客户', color: '#3B82F6' },
  { icon: '📅', label: '每周初', desc: '经营计划', color: '#2563EB' },
  { icon: '💼', label: '拜访前', desc: '方案准备', color: '#60A5FA' },
  { icon: '📝', label: '拜访后', desc: '智能记录', color: '#6366F1' },
  { icon: '👥', label: '当晚', desc: '辅导下属', color: '#8B5CF6' },
  { icon: '📊', label: '每周末', desc: '周工作总结', color: '#0EA5E9' },
  { icon: '📈', label: '每月末', desc: '月度复盘', color: '#10B981' },
];

export function OverviewPage({ onStart, narrate }: OverviewPageProps) {
  const handleTitleClick = useCallback(() => {
    narrate(OVERVIEW_NARRATION);
  }, [narrate]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.overview-start-btn')) return;
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

      {/* Hero - 纯文字品牌，无 Logo 图标，点击播放 TTS */}
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
      </div>

      {/* 4 Pillars - Crystal 风格 */}
      <div className="overview-pillars">
        {pillars.map((p) => (
          <div key={p.title} className="overview-pillar-card">
            <div
              className="overview-pillar-icon"
              style={{ background: p.gradient }}
            >
              {p.icon}
            </div>
            <h3 className="overview-pillar-title" style={{ color: p.color }}>
              {p.title}
            </h3>
            <ul className="overview-pillar-points">
              {p.points.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Timeline - 毛玻璃背景，科技蓝圆点 */}
      <div className="overview-timeline-section">
        <h2 className="overview-section-title">全场景演示流程</h2>
        <div className="overview-timeline">
          {timeline.map((t, i) => (
            <div key={i} className="overview-timeline-item">
              <div
                className="overview-timeline-dot"
                style={{ background: t.color }}
              >
                {t.icon}
              </div>
              <div className="overview-timeline-label">{t.label}</div>
              <div className="overview-timeline-desc">{t.desc}</div>
              {i < timeline.length - 1 && (
                <div className="overview-timeline-connector" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Start Button - 科技蓝渐变 + 扫光 */}
      <div className="overview-start-area">
        <button className="overview-start-btn group shimmer" onClick={onStart}>
          开始演示
        </button>
      </div>
    </div>
  );
}
