import { useEffect, useCallback } from 'react';

const OVERVIEW_NARRATION =
  '欢迎体验"万能营销助手"。' +
  '绩优小张，入职平安人寿十年，服务五百多位客户，是营业区的业绩标兵。' +
  '她平时最大的痛点是——客户太多、时间不够用；客户信息分散、整理费时间；不常联系的客户想加强经营，却不知从何入手。' +
  '万能营销助手按月、周、日三级节奏，为她提供持续的客户经营引导。' +
  '下面用五个场景，带您快速体验。';

interface OverviewPageProps {
  onStart: () => void;
  narrate: (text: string, onEnd?: () => void) => void;
}

const pillars = [
  {
    icon: '📊',
    title: '客户分层可视化',
    color: '#4F6BF6',
    gradient: 'linear-gradient(135deg, #4F6BF6 0%, #667eea 100%)',
    points: [
      '500+ 客户自动分层，温度-价值宫格一目了然',
      '生日、生存金、保单节点全掌握',
    ],
  },
  {
    icon: '🔔',
    title: '主动经营提醒',
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
    points: [
      '月/周/日三级节奏自动推送经营计划',
      '低温升温、高温促成全覆盖',
    ],
  },
  {
    icon: '📲',
    title: '一键高效触客',
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
    points: [
      '一键问候低温客户，一键转发资讯',
      '面访前自动准备方案与攻略',
    ],
  },
  {
    icon: '📈',
    title: '闭环复盘提升',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    points: [
      '周报自动标出薄弱环节与待加强客户',
      '月度复盘亮点与技能短板，个性化学习计划',
    ],
  },
];

const timeline = [
  { icon: '📋', label: '每月初', desc: '盘点客户', color: '#4F6BF6' },
  { icon: '📅', label: '每周初', desc: '经营计划', color: '#6366F1' },
  { icon: '📲', label: '每天', desc: '当日经营', color: '#818CF8' },
  { icon: '📊', label: '每周末', desc: '周工作总结', color: '#0EA5E9' },
  { icon: '📈', label: '每月末', desc: '月度复盘', color: '#10B981' },
];

export function OverviewPage({ onStart, narrate }: OverviewPageProps) {
  useEffect(() => {
    const t = window.setTimeout(() => narrate(OVERVIEW_NARRATION), 500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <p className="overview-subtitle">绩优代理人的 AI 客户经营引导助手</p>
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
