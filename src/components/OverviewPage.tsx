import { useEffect, useCallback } from 'react';

const OVERVIEW_NARRATION =
  '欢迎体验万能营销助手，聚焦四大能力：深度可视化、服务被动转主动、对话即交易、闭环式成交。接下来用七个典型场景，带您快速体验。';

interface OverviewPageProps {
  onStart: () => void;
  narrate: (text: string, onEnd?: () => void) => void;
}

const pillars = [
  {
    icon: '📊',
    title: '深度可视化',
    color: '#4F6BF6',
    gradient: 'linear-gradient(135deg, #4F6BF6 0%, #667eea 100%)',
    points: [
      '客户画像多维分析，精准定位客群',
      '保障缺口可视化，量化需求差距',
      '团队经营数据仪表盘，实时掌握全局',
    ],
  },
  {
    icon: '🔔',
    title: '服务被动转主动',
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
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
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
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
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    points: [
      '盘点→计划→拜访→复盘，全流程闭环',
      '智能推荐附近客户，提升拜访效率',
      '收入激励追踪，驱动目标达成',
    ],
  },
];

const timeline = [
  { icon: '📋', label: '每月初', desc: '盘点客户', color: '#4F6BF6' },
  { icon: '📅', label: '每周初', desc: '经营计划', color: '#6366F1' },
  { icon: '💼', label: '拜访前', desc: '方案准备', color: '#818CF8' },
  { icon: '📝', label: '拜访后', desc: '智能记录', color: '#7C3AED' },
  { icon: '👥', label: '当晚', desc: '辅导下属', color: '#A78BFA' },
  { icon: '📊', label: '每周末', desc: '周工作总结', color: '#0EA5E9' },
  { icon: '📈', label: '每月末', desc: '月度复盘', color: '#10B981' },
];

export function OverviewPage({ onStart, narrate }: OverviewPageProps) {
  useEffect(() => {
    // Attempt auto-play. Chrome may block this without a prior user gesture —
    // in that case the click handler below serves as a silent fallback.
    const t = window.setTimeout(() => narrate(OVERVIEW_NARRATION), 500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Silent click-to-start fallback: if auto-play was blocked, the first click
  // anywhere on the page (except the start button) triggers narration.
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
    <div className="overview-page" onClick={handleClick}>
      {/* Hero */}
      <div className="overview-hero">
        <div className="overview-logo">AI</div>
        <h1 className="overview-title">万能营销助手</h1>
        <p className="overview-subtitle">AI 驱动的智能保险销售全流程解决方案</p>
      </div>

      {/* 4 Pillars */}
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

      {/* Timeline */}
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

      {/* Start Button */}
      <div className="overview-start-area">
        <button className="overview-start-btn" onClick={onStart}>
          开始演示
        </button>
      </div>
    </div>
  );
}
