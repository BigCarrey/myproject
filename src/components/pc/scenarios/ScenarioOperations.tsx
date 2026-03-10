import { useState, useRef, useEffect } from 'react';
import { useNarrator, NarratorSubtitle } from '../Narrator';

interface Props { onBack: () => void; }

const CMD1 = '请帮我每周五分析营业部月钻石占比，对第一个达成35%、本周排名最高的营业部发贺报到微信群。';
const CMD2 = '请帮我对每月钻石占比排名第一的营业部、超过单件保费50万大单代理人制作榜样案例，并转发微信群传播。';

// ── WeChat group chat messages ──
interface WxMsg { sender: string; avatar: string; color: string; content: string; isImage?: boolean; imageType?: 'honor' | 'case-diamond' | 'case-premium'; }

const WX_HONOR_MSGS: WxMsg[] = [
  { sender: '平安DO', avatar: '🤖', color: '#07C160', content: '[AI自动发送] 朝阳营业部贺报' },
  { sender: '平安DO', avatar: '🤖', color: '#07C160', content: '', isImage: true, imageType: 'honor' },
  { sender: '张宁', avatar: '张', color: '#5B8DEF', content: '恭喜朝阳部！👏👏' },
  { sender: '王芯', avatar: '王', color: '#F97316', content: '厉害了，35%！我们也要加油' },
  { sender: '赵虎', avatar: '赵', color: '#EF4444', content: '朝阳部这个月表现确实突出，大家向他们学习' },
];

const WX_CASE_MSGS: WxMsg[] = [
  { sender: '平安DO', avatar: '🤖', color: '#07C160', content: '[AI自动发送] 本月榜样案例' },
  { sender: '平安DO', avatar: '🤖', color: '#07C160', content: '', isImage: true, imageType: 'case-diamond' },
  { sender: '平安DO', avatar: '🤖', color: '#07C160', content: '【榜样力量】朝阳部李平安经理，月钻石占比35%，全区排名第一！秘诀：每天坚持3个有效拜访+精细化盘客管理。向李平安经理致敬！' },
  { sender: '平安DO', avatar: '🤖', color: '#07C160', content: '', isImage: true, imageType: 'case-premium' },
  { sender: '平安DO', avatar: '🤖', color: '#07C160', content: '【大单喜报】朝阳部王帅，单件保费60万！深度KYC锁定高净值客户需求，3次专业面谈建立信任。大单没有秘密，只有专业与坚持！' },
  { sender: '李明', avatar: '李', color: '#8B5CF6', content: '李平安和王帅都太强了 🔥' },
  { sender: '刘志兴', avatar: '刘', color: '#06B6D4', content: '学习了，我也要努力' },
];

const R1 = [
  '语音识别完成，正在解析指令… 识别到关键意图：①分析维度=月钻石占比；②触发条件=达成35%且排名第一；③动作=生成贺报；④渠道=微信群；⑤频率=每周五。正在调取本周8个营业部钻石占比数据…',
  '数据扫描完成：朝阳部月钻石占比35%，本周排名第一 → 符合触发条件 → 自动生成贺报',
];

const R2 = [
  '语音识别完成，正在解析指令… 识别到关键意图：①对象A=钻石占比排名第一的营业部；②对象B=单件保费超50万大单代理人；③动作=挖掘制作榜样案例；④渠道=微信群传播；⑤频率=每月。正在调取本月全区业绩数据…',
  '数据匹配完成：朝阳部李平安经理（钻石占比第一）、王帅（保费60万大单）符合条件 → 自动调用内容创作智能体启动案例制作',
];

export function ScenarioOperations({ onBack }: Props) {
  const [step, setStep] = useState(0);
  const [r1Lines, setR1Lines] = useState(0);
  const [r2Lines, setR2Lines] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [honorOpen, setHonorOpen] = useState(false);
  const [honorForwarded, setHonorForwarded] = useState(false);
  const [micReady, setMicReady] = useState(1); // 1=ready for cmd1, 2=ready for cmd2, 0=not ready
  const [_typed1, setTyped1] = useState(0);
  const [_typed2, setTyped2] = useState(0);
  // Voice recognition overlay
  const [voiceOverlay, setVoiceOverlay] = useState(false);
  const [voiceCmd, setVoiceCmd] = useState(0); // which command is being recorded (1 or 2)
  const [voiceText, setVoiceText] = useState(''); // real recognized text from user speech
  // Calendar popup
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarTask, setCalendarTask] = useState({ title: '', schedule: '', detail: '' });
  // WeChat group popup
  const [wxOpen, setWxOpen] = useState(false);
  const [wxMsgs, setWxMsgs] = useState<WxMsg[]>([]);
  const [wxVisibleCount, setWxVisibleCount] = useState(0);
  const [_wxMode, setWxMode] = useState<'honor' | 'case'>('honor');
  const wxTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const wxBodyRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const recognitionRef = useRef<any>(null);
  const { narratorText, speak } = useNarrator();

  const scroll = () => setTimeout(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, 80);

  // Auto-scroll WeChat body when messages appear
  useEffect(() => {
    if (wxBodyRef.current && wxVisibleCount > 0) {
      setTimeout(() => { if (wxBodyRef.current) wxBodyRef.current.scrollTop = wxBodyRef.current.scrollHeight; }, 60);
    }
  }, [wxVisibleCount]);

  // Open WeChat popup and drip messages one by one
  const openWxPopup = (mode: 'honor' | 'case') => {
    const msgs = mode === 'honor' ? WX_HONOR_MSGS : WX_CASE_MSGS;
    setWxMode(mode);
    setWxMsgs(msgs);
    setWxVisibleCount(0);
    setWxOpen(true);
    // Clear prev timers
    wxTimersRef.current.forEach(clearTimeout);
    wxTimersRef.current = [];
    // Drip messages with delays
    msgs.forEach((_msg, i) => {
      const t = setTimeout(() => setWxVisibleCount(i + 1), 600 + i * 900);
      wxTimersRef.current.push(t);
    });
  };

  const closeWxPopup = () => {
    wxTimersRef.current.forEach(clearTimeout);
    setWxOpen(false);
  };

  // Start real speech recognition — capture recognized text into voiceText
  const startRecognition = (durationMs: number) => {
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) return;
      const recognition = new SR();
      recognition.lang = 'zh-CN';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognitionRef.current = recognition;
      recognition.onresult = (e: any) => {
        let transcript = '';
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setVoiceText(transcript);
      };
      recognition.start();
      setTimeout(() => { try { recognition.stop(); } catch { /* */ } }, durationMs);
    } catch { /* browser may not support */ }
  };

  const handleMicClick = () => {
    if (micReady === 1) {
      setMicReady(0);
      setVoiceOverlay(true);
      setVoiceCmd(1);
      setVoiceText('');
      startRecognition(30000);
    } else if (micReady === 2) {
      setMicReady(0);
      setVoiceOverlay(true);
      setVoiceCmd(2);
      setVoiceText('');
      startRecognition(30000);
    }
  };

  // User clicks "完成" on the voice overlay — close overlay and proceed with preset text
  const handleVoiceDone = () => {
    setVoiceOverlay(false);
    try { if (recognitionRef.current) recognitionRef.current.stop(); } catch { /* */ }
    if (voiceCmd === 1) {
      setStep(1); setTyped1(CMD1.length);
      scroll();
      timersRef.current = [
        setTimeout(() => { setStep(2); scroll(); }, 500),
        setTimeout(() => { setStep(3); setR1Lines(1); scroll(); }, 1500),
        setTimeout(() => { setR1Lines(2); scroll(); }, 3500),
        setTimeout(() => { setStep(4); setHonorOpen(true); scroll(); speak('分析完成。朝阳部月钻石占比35%，排名第一，贺报已制作好，请确认后转发到微信群。'); }, 5200),
      ];
    } else if (voiceCmd === 2) {
      setStep(5); setTyped2(CMD2.length);
      scroll();
      timersRef.current = [
        ...timersRef.current,
        setTimeout(() => { setStep(6); scroll(); }, 500),
        setTimeout(() => { setStep(7); setR2Lines(1); scroll(); }, 1500),
        setTimeout(() => { setR2Lines(2); scroll(); }, 3500),
        setTimeout(() => { setStep(8); scroll(); speak('榜样案例已制作完成。包含李平安钻石达标和王帅大单绩优两个案例的海报和转发文案，请您确认后转发到全区微信群。'); }, 5000),
      ];
    }
  };

  const handleConfirm = () => {
    setConfirmed(true); setStep(9); scroll();
    speak('好的，案例已转发至全区8个营业部微信群，周期任务已写入AI日历，后续每月自动执行。');
    openWxPopup('case');
    const calT = setTimeout(() => {
      setCalendarTask({ title: '榜样案例挖掘 + 全区宣发', schedule: '每月自动执行', detail: '自动筛选钻石占比排名第一的营业部和超50万大单代理人，挖掘制作榜样案例并转发至全区微信群。' });
      setCalendarOpen(true);
    }, 6500);
    wxTimersRef.current.push(calT);
  };

  const handleForwardHonor = () => {
    setHonorForwarded(true);
    setMicReady(2);
    scroll();
    speak('贺报已转发至区经理微信群，同时创建了每周五自动执行的周期任务。');
    openWxPopup('honor');
    // Show calendar popup after WeChat popup is likely seen
    const calT = setTimeout(() => {
      setCalendarTask({ title: '钻石占比分析 + 贺报自动生成', schedule: '每周五 09:00', detail: '自动扫描8个营业部钻石占比数据，对达成35%且排名第一的营业部生成贺报并发送至微信群。' });
      setCalendarOpen(true);
    }, 5000);
    wxTimersRef.current.push(calT);
  };

  return (
    <div className="sc-body-outer">
      <div className="sc-body-scroll" ref={bodyRef}>
        {/* Scene Header */}
        <div className="pc-scene-header">
          <div>
            <div className="pc-scene-title-row">
              <h1 className="pc-scene-title"><span className="pc-scene-title-icon">🤖</span>周五自动化运营</h1>
            </div>
            <div className="pc-scene-meta-row">
              <span className="pc-meta-dot" /><span className="pc-meta-text">人机对话驱动贺报与案例宣发</span>
              <span className="pc-meta-sep">·</span><span className="pc-meta-text">STEP 1 贺报自动生成与发布</span>
              <span className="pc-meta-sep">·</span><span className="pc-meta-text">STEP 2 榜样案例挖掘与全区宣发</span>
            </div>
          </div>
          <button className="pc-btn-reinspect" onClick={onBack}>← 返回</button>
        </div>

        {/* Chat Container */}
        <div className="sc-chat-wrap">

          {/* ── Command 1 ── */}
          {step >= 1 && (
            <div className="sc-chat-row sc-chat-user pc-fade-in-up">
              <div className="sc-chat-bubble-user">
                <span className="sc-voice-text">{CMD1}</span>
              </div>
              <span className="sc-avatar-user">我</span>
            </div>
          )}

          {/* Reasoning 1 */}
          {step >= 3 && r1Lines > 0 && (
            <div className="pc-reasoning-panel pc-fade-in" style={{ margin: '12px 0' }}>
              <div className="pc-rp-header">
                <span className="pc-rp-icon">🧠</span>
                <span className="pc-rp-title">AI 解析指令</span>
                {step === 3 ? <span className="pc-rp-live-badge">● 处理中</span> : <span className="pc-rp-done-badge">✓ 完成</span>}
              </div>
              <div className="pc-rp-lines">
                {R1.slice(0, r1Lines).map((line, i) => (
                  <div key={i} className="pc-rp-line pc-fade-in-up">
                    <span className="pc-ai-tag">{i === 0 ? 'AI推理' : 'AI执行'}</span><span className="pc-rp-line-text">{line}</span>
                  </div>
                ))}
                {step === 3 && r1Lines < 2 && (
                  <div className="pc-rp-typing">
                    <span className="pc-dot-pulse" /><span className="pc-dot-pulse" style={{ animationDelay: '0.22s' }} /><span className="pc-dot-pulse" style={{ animationDelay: '0.44s' }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI reply 1 + 贺报 modal + forward/edit buttons + cycle task */}
          {step >= 4 && (
            <>
              {/* 贺报 overlay modal — 4:3 poster / certificate style */}
              {honorOpen && (
                <div className="sc-honor-overlay">
                  <div className="sc-honor-overlay-bg" onClick={() => setHonorOpen(false)} />
                  <div className="sc-honor-poster">
                    <button className="sc-honor-poster-close" onClick={() => setHonorOpen(false)}>✕</button>
                    {/* Decorative corner ornaments */}
                    <div className="sc-honor-corner sc-honor-corner-tl" />
                    <div className="sc-honor-corner sc-honor-corner-tr" />
                    <div className="sc-honor-corner sc-honor-corner-bl" />
                    <div className="sc-honor-corner sc-honor-corner-br" />
                    {/* Inner border */}
                    <div className="sc-honor-inner-border">
                      <div className="sc-honor-poster-header">贺 报</div>
                      <div className="sc-honor-poster-trophy">🏆</div>
                      <div className="sc-honor-poster-congrats">恭喜</div>
                      <div className="sc-honor-poster-dept">朝阳营业部</div>
                      <div className="sc-honor-poster-achievement">
                        月钻石占比达成 <span className="sc-honor-poster-number">35%</span>
                      </div>
                      <div className="sc-honor-poster-rank">本周排名第一</div>
                      <div className="sc-honor-poster-divider" />
                      <div className="sc-honor-poster-date">2026年3月</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="sc-chat-row sc-chat-ai pc-fade-in-up">
                <span className="sc-avatar-ai">AI</span>
                <div className="sc-chat-bubble-ai">
                  <div className="sc-ai-reply-text">已为您完成分析：朝阳部月钻石占比35%，本周排名第一。贺报已制作完成，请确认后转发到区经理微信群。</div>
                </div>
              </div>

              {/* Inline honor badge — click to preview poster */}
              <div className="sc-honor-pop pc-fade-in" onClick={() => setHonorOpen(true)} style={{ cursor: 'pointer' }}>
                <span className="sc-honor-icon">🏆</span>
                <div>
                  <div className="sc-honor-title">恭喜朝阳部</div>
                  <div className="sc-honor-sub">月钻石占比35%，本周排名第一！</div>
                </div>
                <span className="sc-honor-check">{honorForwarded ? '✓ 已转发' : '点击预览'}</span>
              </div>

              {/* Forward / Edit buttons — shown before forwarding */}
              {!honorForwarded && (
                <div className="sc-honor-actions pc-fade-in">
                  <button className="sc-honor-action-btn sc-honor-forward-btn" onClick={handleForwardHonor}>
                    📤 转发到微信群
                  </button>
                  <button className="sc-honor-action-btn sc-honor-edit-btn" onClick={() => setHonorOpen(true)}>
                    ✏️ 修改
                  </button>
                </div>
              )}

              {/* After forwarding: calendar + sent confirm */}
              {honorForwarded && (
                <div className="sc-chat-row sc-chat-ai pc-fade-in-up">
                  <span className="sc-avatar-ai">AI</span>
                  <div className="sc-chat-bubble-ai">
                    <div className="sc-ai-reply-text" style={{ fontSize: 12, color: '#3B82F6' }}>
                      ⚡ 检测到用户指令包含"每周五"周期关键词 → 自动创建周期任务：每周五 09:00 执行"钻石占比分析+贺报生成"，写入AI日历
                    </div>
                    <div className="sc-calendar-entry" style={{ marginTop: 10 }}>
                      <span className="sc-cal-icon">📅</span>
                      <div>
                        <div className="sc-cal-title">已写入AI日历 · 每周五 09:00</div>
                        <div className="sc-cal-sub">钻石占比分析 + 贺报自动生成 &nbsp;·&nbsp; 自动执行</div>
                      </div>
                      <span className="sc-cal-badge">周期任务</span>
                    </div>
                    <div className="sc-sent-confirm pc-fade-in" style={{ marginTop: 12 }}>
                      <span style={{ fontSize: 16 }}>✅</span>
                      <div>
                        <div className="sc-sent-title">贺报已转发至区经理微信群</div>
                        <div className="sc-sent-sub">自动任务已写入AI日历 &nbsp;·&nbsp; 后续每周五自动执行</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Command 2 ── */}
          {step >= 5 && (
            <div className="sc-chat-row sc-chat-user pc-fade-in-up">
              <div className="sc-chat-bubble-user">
                <span className="sc-voice-text">{CMD2}</span>
              </div>
              <span className="sc-avatar-user">我</span>
            </div>
          )}

          {/* Reasoning 2 */}
          {step >= 7 && r2Lines > 0 && (
            <div className="pc-reasoning-panel pc-fade-in" style={{ margin: '12px 0' }}>
              <div className="pc-rp-header">
                <span className="pc-rp-icon">🧠</span>
                <span className="pc-rp-title">AI 解析指令 · 多智能体协同</span>
                {step === 7 ? <span className="pc-rp-live-badge">● 处理中</span> : <span className="pc-rp-done-badge">✓ 完成</span>}
              </div>
              <div className="pc-rp-lines">
                {R2.slice(0, r2Lines).map((line, i) => (
                  <div key={i} className="pc-rp-line pc-fade-in-up">
                    <span className="pc-ai-tag">{i === 0 ? 'AI推理' : 'AI执行'}</span><span className="pc-rp-line-text">{line}</span>
                  </div>
                ))}
                {step === 7 && r2Lines < 2 && (
                  <div className="pc-rp-typing">
                    <span className="pc-dot-pulse" /><span className="pc-dot-pulse" style={{ animationDelay: '0.22s' }} /><span className="pc-dot-pulse" style={{ animationDelay: '0.44s' }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI reply 2 — rich case output + poster + copy + confirm */}
          {step >= 8 && (
            <div className="sc-chat-row sc-chat-ai pc-fade-in-up">
              <span className="sc-avatar-ai">AI</span>
              <div className="sc-chat-bubble-ai">
                <div className="sc-ai-reply-text">好的，本月已为您分析数据，正在对朝阳部李平安经理（钻石占比第一）、王帅（保费60万大单）挖掘制作案例。</div>
                {!confirmed ? (
                  <>
                    <div className="sc-ai-reply-text" style={{ marginTop: 8 }}>
                      已完成朝阳部李平安经理、王帅绩优的案例制作。以下是为您生成的榜样案例海报、宣传文案，请确认后转发到微信群：
                    </div>

                    {/* ── Case 1: 李平安 钻石达标 ── */}
                    <div className="sc-case-card">
                      <div className="sc-case-card-header sc-case-card-diamond">
                        <span className="sc-case-card-badge">🏆 钻石达标榜样</span>
                        <span className="sc-case-card-tag">AI生成</span>
                      </div>
                      {/* Poster preview */}
                      <div className="sc-case-poster sc-case-poster-diamond">
                        <div className="sc-case-poster-top">榜 样 案 例</div>
                        <div className="sc-case-poster-avatar">李</div>
                        <div className="sc-case-poster-name">朝阳部 · 李平安</div>
                        <div className="sc-case-poster-stat">月钻石占比 <span>35%</span> · 排名第一</div>
                        <div className="sc-case-poster-quote">"客户经营没有捷径，每天坚持3个有效拜访，坚持盘客，才有今天的结果。"</div>
                      </div>
                      {/* Promotion style */}
                      <div className="sc-case-style-row">
                        <span className="sc-case-style-label">宣传风格</span>
                        <span className="sc-case-style-value">数据驱动 + 经验萃取 + 金句提炼</span>
                      </div>
                      {/* Forwarding copy */}
                      <div className="sc-case-copy-box">
                        <div className="sc-case-copy-label">微信群转发文案</div>
                        <div className="sc-case-copy-text">
                          【榜样力量】朝阳部李平安经理，月钻石占比35%，全区排名第一！他的秘诀：每天坚持3个有效拜访+精细化盘客管理。从客户KYC到需求分析，每一步都做到极致。这份坚持值得每一位伙伴学习！向李平安经理致敬，大家一起加油！
                        </div>
                      </div>
                    </div>

                    {/* ── Case 2: 王帅 大单绩优 ── */}
                    <div className="sc-case-card">
                      <div className="sc-case-card-header sc-case-card-premium">
                        <span className="sc-case-card-badge">💰 大单绩优榜样</span>
                        <span className="sc-case-card-tag">AI生成</span>
                      </div>
                      {/* Poster preview */}
                      <div className="sc-case-poster sc-case-poster-premium">
                        <div className="sc-case-poster-top">榜 样 案 例</div>
                        <div className="sc-case-poster-avatar sc-case-poster-avatar-gold">王</div>
                        <div className="sc-case-poster-name">朝阳部 · 王帅</div>
                        <div className="sc-case-poster-stat">单件保费 <span>60万</span> · 大单实战</div>
                        <div className="sc-case-poster-quote">"大单不是运气，是足够了解客户后的精准匹配。做好KYC，客户自然会信任你。"</div>
                      </div>
                      {/* Promotion style */}
                      <div className="sc-case-style-row">
                        <span className="sc-case-style-label">宣传风格</span>
                        <span className="sc-case-style-value">实战拆解 + 方法论提炼 + 可复制路径</span>
                      </div>
                      {/* Forwarding copy */}
                      <div className="sc-case-copy-box">
                        <div className="sc-case-copy-label">微信群转发文案</div>
                        <div className="sc-case-copy-text">
                          【大单喜报】朝阳部王帅，单件保费60万！他用了什么方法？深度KYC锁定高净值客户需求，通过3次专业面谈建立信任，最终精准匹配年金+终身寿组合方案。大单没有秘密，只有专业与坚持。向王帅学习，人人都能开大单！
                        </div>
                      </div>
                    </div>

                    <button className="pc-cta-btn" style={{ marginTop: 14, fontSize: 13 }} onClick={handleConfirm}>
                      确认，转发到全区微信群
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Done state */}
          {step >= 9 && confirmed && (
            <>
              <div className="sc-chat-row sc-chat-ai pc-fade-in-up">
                <span className="sc-avatar-ai">AI</span>
                <div className="sc-chat-bubble-ai">
                  <div className="sc-ai-reply-text" style={{ fontSize: 12, color: '#3B82F6' }}>
                    ⚡ 案例已入库并自动打标签（#钻石达标 #大单绩优），转发至全区8个营业部微信群。检测到"每月"周期关键词 → 自动创建周期任务，写入AI日历
                  </div>
                  <div className="sc-calendar-entry" style={{ marginTop: 10 }}>
                    <span className="sc-cal-icon">📅</span>
                    <div>
                      <div className="sc-cal-title">已写入AI日历 · 每月</div>
                      <div className="sc-cal-sub">榜样案例挖掘 + 全区宣发 &nbsp;·&nbsp; 自动执行</div>
                    </div>
                    <span className="sc-cal-badge">周期任务</span>
                  </div>
                  <div className="sc-sent-confirm pc-fade-in" style={{ marginTop: 12 }}>
                    <span style={{ fontSize: 16 }}>✅</span>
                    <div>
                      <div className="sc-sent-title">优秀案例已入库并转发至全区微信群</div>
                      <div className="sc-sent-sub">自动任务已写入AI日历 &nbsp;·&nbsp; 后续每月自动执行</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chat input bar — fixed at bottom */}
      {micReady > 0 && (
        <div className="sc-input-bar pc-fade-in-up">
          <div className="sc-input-bar-inner">
            <div className="sc-input-placeholder">点击麦克风，语音输入指令…</div>
            <button className="sc-input-mic-btn" onClick={handleMicClick}>
              <span className="sc-input-mic-icon">🎙️</span>
              <span className="sc-input-mic-pulse" />
            </button>
          </div>
        </div>
      )}
      {/* ── Calendar Task Card Popup ── */}
      {calendarOpen && (
        <div className="sc-cal-popup-overlay">
          <div className="sc-cal-popup-bg" onClick={() => setCalendarOpen(false)} />
          <div className="sc-cal-popup-frame">
            <div className="sc-cal-popup-header">
              <span className="sc-cal-popup-icon">📅</span>
              <span className="sc-cal-popup-title">AI 日历 · 添加日程</span>
              <button className="sc-cal-popup-close" onClick={() => setCalendarOpen(false)}>✕</button>
            </div>
            <div className="sc-cal-popup-body">
              <div className="sc-cal-popup-card">
                <div className="sc-cal-popup-badge">周期任务</div>
                <div className="sc-cal-popup-task-title">{calendarTask.title}</div>
                <div className="sc-cal-popup-row">
                  <span className="sc-cal-popup-label">执行频率</span>
                  <span className="sc-cal-popup-value">{calendarTask.schedule}</span>
                </div>
                <div className="sc-cal-popup-row">
                  <span className="sc-cal-popup-label">执行内容</span>
                  <span className="sc-cal-popup-value">{calendarTask.detail}</span>
                </div>
                <div className="sc-cal-popup-row">
                  <span className="sc-cal-popup-label">创建方式</span>
                  <span className="sc-cal-popup-value">AI 自动识别周期关键词创建</span>
                </div>
                <div className="sc-cal-popup-row">
                  <span className="sc-cal-popup-label">状态</span>
                  <span className="sc-cal-popup-status">✅ 已写入日历</span>
                </div>
              </div>
            </div>
            <div className="sc-cal-popup-footer">
              <button className="sc-cal-popup-ok-btn" onClick={() => setCalendarOpen(false)}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── WeChat Group Chat Popup ── */}
      {wxOpen && (
        <div className="wx-popup-overlay">
          <div className="wx-popup-bg" onClick={closeWxPopup} />
          <div className="wx-popup-frame">
            <div className="wx-popup-header">
              <span className="wx-popup-back" onClick={closeWxPopup}>‹</span>
              <div className="wx-popup-title">
                <div>赵虎营业区经理群(8)</div>
                <div className="wx-popup-subtitle">群聊</div>
              </div>
              <span className="wx-popup-more">⋯</span>
            </div>
            <div className="wx-popup-body" ref={wxBodyRef}>
              <div className="wx-popup-time-sep">
                {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </div>
              {wxMsgs.slice(0, wxVisibleCount).map((msg, i) => (
                <div key={i} className={`wx-popup-msg pc-fade-in-up ${msg.sender === '赵虎' ? 'wx-popup-msg-self' : ''}`}>
                  {msg.sender !== '赵虎' && (
                    <div className="wx-popup-avatar" style={{ background: msg.color }}>{msg.avatar}</div>
                  )}
                  <div className="wx-popup-msg-body">
                    {msg.sender !== '赵虎' && <div className="wx-popup-sender">{msg.sender}</div>}
                    {msg.isImage && msg.imageType === 'honor' ? (
                      <div className="wx-popup-bubble-img">
                        <div className="wx-popup-honor-thumb">
                          <div className="wx-popup-honor-thumb-header">贺 报</div>
                          <div className="wx-popup-honor-thumb-icon">🏆</div>
                          <div className="wx-popup-honor-thumb-text">朝阳营业部</div>
                          <div className="wx-popup-honor-thumb-sub">月钻石占比 35% · 排名第一</div>
                        </div>
                      </div>
                    ) : msg.isImage && msg.imageType === 'case-diamond' ? (
                      <div className="wx-popup-bubble-img">
                        <div className="wx-popup-case-thumb wx-popup-case-thumb-diamond">
                          <div className="wx-popup-case-thumb-top">榜 样 案 例</div>
                          <div className="wx-popup-case-thumb-avatar">李</div>
                          <div className="wx-popup-case-thumb-name">朝阳部 · 李平安</div>
                          <div className="wx-popup-case-thumb-stat">月钻石占比 <span>35%</span></div>
                        </div>
                      </div>
                    ) : msg.isImage && msg.imageType === 'case-premium' ? (
                      <div className="wx-popup-bubble-img">
                        <div className="wx-popup-case-thumb wx-popup-case-thumb-premium">
                          <div className="wx-popup-case-thumb-top">榜 样 案 例</div>
                          <div className="wx-popup-case-thumb-avatar wx-popup-case-avatar-gold">王</div>
                          <div className="wx-popup-case-thumb-name">朝阳部 · 王帅</div>
                          <div className="wx-popup-case-thumb-stat">单件保费 <span>60万</span></div>
                        </div>
                      </div>
                    ) : (
                      <div className={`wx-popup-bubble ${msg.sender === '赵虎' ? 'wx-popup-bubble-self' : ''}`}>
                        {msg.content}
                      </div>
                    )}
                  </div>
                  {msg.sender === '赵虎' && (
                    <div className="wx-popup-avatar" style={{ background: msg.color }}>{msg.avatar}</div>
                  )}
                </div>
              ))}
              {wxVisibleCount < wxMsgs.length && (
                <div className="wx-popup-typing pc-fade-in">
                  <span className="pc-dot-pulse" />
                  <span className="pc-dot-pulse" style={{ animationDelay: '0.22s' }} />
                  <span className="pc-dot-pulse" style={{ animationDelay: '0.44s' }} />
                </div>
              )}
            </div>
            <div className="wx-popup-input-bar">
              <span style={{ fontSize: 16 }}>🎤</span>
              <div className="wx-popup-input-field">输入消息...</div>
              <span style={{ fontSize: 16 }}>😊</span>
              <span style={{ fontSize: 16 }}>＋</span>
            </div>
          </div>
        </div>
      )}
      {/* ── Voice Recognition Overlay ── */}
      {voiceOverlay && (
        <div className="sc-vr-overlay">
          <div className="sc-vr-panel">
            <div className="sc-vr-header">
              <span className="sc-call-modal-rec-dot" />
              <span className="sc-vr-header-text">语音识别中…</span>
            </div>
            <div className="sc-vr-wave-section">
              <div className="sc-vr-wave-ring">
                <div className="sc-vr-wave-ring-inner">
                  <span className="sc-vr-mic-icon">🎙️</span>
                </div>
              </div>
              <div className="sc-vr-waveform">
                {[...Array(24)].map((_, i) => <span key={i} className="sc-wave-bar sc-vr-wave-bar" style={{ animationDelay: `${i * 0.06}s` }} />)}
              </div>
              <div className="sc-vr-hint">请说出您的指令…</div>
              <div className="sc-vr-prompt-hint">{voiceCmd === 1 ? CMD1 : CMD2}</div>
            </div>
            <div className="sc-vr-text-section">
              <div className="sc-vr-label">语音转文字</div>
              <div className="sc-vr-text">
                {voiceText || <span className="sc-vr-placeholder">正在聆听…</span>}
                {voiceText && <span className="sc-typing-cursor" />}
              </div>
            </div>
            <button className="sc-vr-done-btn" onClick={handleVoiceDone}>
              ✓ 完成
            </button>
          </div>
        </div>
      )}
      <NarratorSubtitle text={narratorText} />
    </div>
  );
}