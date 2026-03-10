import { useState, useRef, useEffect } from 'react';
import { useNarrator, NarratorSubtitle } from '../Narrator';
import { useSpeech } from '../../../hooks/useSpeech';

interface Props { onBack: () => void; }

const CMD1 = '请帮我每周五对月钻石占比达成后2名的部经理进行电话追踪并反馈结果。';
const CMD2 = '请帮我对首周主管钻石挂零的营业部组织主管检视会。';

const R1 = [
  '语音识别完成，正在解析指令… 识别到关键意图：①排名维度=月钻石占比；②追踪对象=达成后2名的部经理；③动作=AI电话追踪；④输出=反馈结果；⑤频率=每周五。正在调取本周8个营业部月钻石占比排名…',
  '数据排名完成：月钻石占比末位2名为张宁经理、王芯经理 → 启动AI外呼任务，正在与张宁、王芯通话中…',
];

const R2 = [
  '语音识别完成，正在解析指令… 识别到关键意图：①筛选条件=首周主管钻石挂零；②动作=组织主管检视会。正在调取全区主管首周钻石数据… 正在拉取相关人员日历空闲时段…',
  '数据匹配完成：启明部主管刘志兴首周钻石挂零 → 符合条件 → 已向王芯、刘志兴发送检视会议邀请 → 正在自动生成检视会议PPT…',
];

// ── 两通外呼的对话脚本 ──
interface DialogLine { role: 'ai' | 'person'; text: string; }

const CALL_SCRIPTS: { name: string; dept: string; lines: DialogLine[] }[] = [
  {
    name: '张宁经理', dept: '启阳部',
    lines: [
      { role: 'ai', text: '张宁经理您好，这里是平安营业区AI助手，受赵虎安排，跟您做本月钻石占比的进度追踪。' },
      { role: 'person', text: '好的，你说。' },
      { role: 'ai', text: '目前启阳部月钻石占比排名倒数第二，主要差距在新人出单率偏低，想了解一下您这边的情况和计划。' },
      { role: 'person', text: '确实最近新人比较多，辅导没跟上，下周我准备每天加一个小时做新人专项辅导。' },
      { role: 'ai', text: '好的，已记录。那咱们约定下周五再做一次回访确认进展，可以吗？' },
      { role: 'person', text: '没问题。' },
    ],
  },
  {
    name: '王芯经理', dept: '启明部',
    lines: [
      { role: 'ai', text: '王芯经理您好，受赵虎安排做月钻石占比追踪。启明部目前排名末位，主管刘志兴首周钻石挂零，想了解下您的应对计划。' },
      { role: 'person', text: '刘志兴最近状态确实不好，我已经约他明天到部里面谈。' },
      { role: 'ai', text: '了解。刘志兴目前出勤和活动量都明显下滑，面谈时建议重点关注他的活动量恢复计划。' },
      { role: 'person', text: '好，我会重点抓这块。' },
      { role: 'ai', text: '收到，王芯经理这边标注为高风险，后续会持续跟踪，辛苦了。' },
    ],
  },
];

const PPT_SLIDES = [
  {
    label: 'P1-P2', title: '营业区8个部核心指标排名',
    bullets: ['NBEV月度达成率对比', '钻石占比排名 Top/Bottom', '有效活动率趋势图', '三好五星达成进度条'],
  },
  {
    label: 'P3-P4', title: '优秀案例展示',
    bullets: ['朝阳部李平安 · 钻石达标经验复盘', '朝阳部王帅 · 60万大单实战拆解', '含关键动作拆解 + 可复制路径'],
  },
  {
    label: 'P5', title: '三好五星缺口分析',
    bullets: ['各部达标差距热力图', '落后指标归因（行为/管理/市场）', '环比趋势 + 预警标记'],
  },
  {
    label: 'P6', title: '下一步工作要求',
    bullets: ['各部整改动作清单', '责任人 · 截止日期 · 检查标准', '追踪节点已同步AI日历'],
  },
];

export function ScenarioTracking({ onBack }: Props) {
  const [step, setStep] = useState(0);
  const [r1Lines, setR1Lines] = useState(0);
  const [callStep, setCallStep] = useState(0);      // 0=idle, 1=calling, 2=done
  const [r2Lines, setR2Lines] = useState(0);
  const [pptStep, setPptStep] = useState(0);
  const [pptConfirmed, setPptConfirmed] = useState(false);
  const [micReady, setMicReady] = useState(1);
  const [_typed1, setTyped1] = useState(0);
  const [_typed2, setTyped2] = useState(0);
  // Voice recognition overlay
  const [voiceOverlay, setVoiceOverlay] = useState(false);
  const [voiceCmd, setVoiceCmd] = useState(0); // which command is being recorded (1 or 2)
  const [voiceText, setVoiceText] = useState(''); // real recognized text from user speech

  // ── Call modal state ──
  const [callModalIdx, setCallModalIdx] = useState(-1);  // -1=closed, 0=first call, 1=second call
  const [dialogIdx, setDialogIdx] = useState(0);          // how many lines revealed
  const [callsDone, setCallsDone] = useState<boolean[]>([false, false]);

  const bodyRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const recognitionRef = useRef<any>(null);
  const dialogTimerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const dialogCancelledRef = useRef(false);
  const { narratorText, speak } = useNarrator();
  const speech = useSpeech();

  const scroll = () => setTimeout(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, 80);

  // ── Auto-open first call modal when callStep = 1 ──
  useEffect(() => {
    if (callStep === 1 && callModalIdx === -1) {
      setCallModalIdx(0);
      setDialogIdx(0);
    }
  }, [callStep]);

  // ── Auto-play dialogue lines — wait for AI speech to finish before next line ──
  useEffect(() => {
    if (callModalIdx < 0) return;
    const script = CALL_SCRIPTS[callModalIdx];
    if (!script) return;

    setDialogIdx(0);
    dialogTimerRef.current.forEach(clearTimeout);
    dialogTimerRef.current = [];
    dialogCancelledRef.current = false;

    // Play lines sequentially: show line → speak (AI=female, person=male) → wait for speech end → pause → next
    const playLine = (i: number) => {
      if (dialogCancelledRef.current || i >= script.lines.length) return;
      const line = script.lines[i];

      // Show this line
      setDialogIdx(i + 1);

      if (line.role === 'ai') {
        speech.speak(line.text);
      } else {
        // 张宁(callModalIdx=0) → speakMale2, 王芯(callModalIdx=1) → speakMale
        if (callModalIdx === 0) {
          speech.speakMale2(line.text);
        } else {
          speech.speakMale(line.text);
        }
      }

      const pollDone = () => {
        if (dialogCancelledRef.current) return;
        const t = setTimeout(() => {
          if (dialogCancelledRef.current) return;
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            pollDone();
          } else {
            const pause = line.role === 'ai' ? 800 : 600;
            const t2 = setTimeout(() => playLine(i + 1), pause);
            dialogTimerRef.current.push(t2);
          }
        }, 300);
        dialogTimerRef.current.push(t);
      };
      const t0 = setTimeout(pollDone, 500);
      dialogTimerRef.current.push(t0);
    };

    // Start first line after 800ms
    const tStart = setTimeout(() => playLine(0), 800);
    dialogTimerRef.current.push(tStart);

    return () => {
      dialogCancelledRef.current = true;
      dialogTimerRef.current.forEach(clearTimeout);
    };
  }, [callModalIdx]);

  // ── End call handler ──
  const handleEndCall = () => {
    dialogCancelledRef.current = true;
    dialogTimerRef.current.forEach(clearTimeout);
    speech.stopSpeaking();
    const idx = callModalIdx;
    const newDone = [...callsDone];
    newDone[idx] = true;
    setCallsDone(newDone);

    if (idx === 0 && !newDone[1]) {
      // Open second call
      setCallModalIdx(1);
      setDialogIdx(0);
    } else {
      // All calls done
      setCallModalIdx(-1);
      setCallStep(2);
      scroll();
      // Trigger next step after brief delay
      timersRef.current.push(
        setTimeout(() => {
          setStep(4); scroll(); setMicReady(2);
          speak('追踪已完成。张宁经理承诺下周加强新人辅导，王芯经理已约刘志兴明日面谈。需要注意，王芯经理标注为高风险，建议重点关注。');
        }, 500)
      );
    }
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
        setTimeout(() => { setR1Lines(2); scroll(); speak('数据排名完成，月钻石占比末位2名为张宁经理和王芯经理，是否启动AI外呼任务？'); }, 3500),
      ];
    } else if (voiceCmd === 2) {
      setStep(5); setTyped2(CMD2.length);
      scroll();
      timersRef.current = [
        ...timersRef.current,
        setTimeout(() => { setStep(6); scroll(); }, 500),
        setTimeout(() => { setStep(7); setR2Lines(1); scroll(); }, 1500),
        setTimeout(() => { setR2Lines(2); scroll(); }, 3500),
        setTimeout(() => { setStep(8); setPptStep(1); scroll(); speak('主管检视会材料已准备好。PPT共6页，包含核心指标排名、优秀案例、缺口分析和下一步工作要求，请您确认。'); }, 5000),
        setTimeout(() => { setPptStep(2); scroll(); }, 5600),
        setTimeout(() => { setPptStep(3); scroll(); }, 6200),
        setTimeout(() => { setPptStep(4); scroll(); }, 6800),
        setTimeout(() => { setPptStep(5); scroll(); }, 7400),
      ];
    }
  };

  const handleConfirmPPT = () => { setPptConfirmed(true); scroll(); speak('好的，会议邀请已发送至王芯和刘志兴，PPT已同步至会议附件，时间节点已写入AI日历。'); };

  const handleConfirmCall = () => { setCallStep(1); scroll(); };

  // Current call script for modal
  const currentScript = callModalIdx >= 0 ? CALL_SCRIPTS[callModalIdx] : null;

  return (
    <div className="sc-body-outer">
      <div className="sc-body-scroll" ref={bodyRef}>
        {/* Scene Header */}
        <div className="pc-scene-header">
          <div>
            <div className="pc-scene-title-row">
              <h1 className="pc-scene-title"><span className="pc-scene-title-icon">📊</span>周五进度追踪与异常升级</h1>
            </div>
            <div className="pc-scene-meta-row">
              <span className="pc-meta-dot" /><span className="pc-meta-text">人机对话驱动闭环</span>
              <span className="pc-meta-sep">·</span><span className="pc-meta-text">STEP 1 月钻石末位追踪与自动任务设置</span>
              <span className="pc-meta-sep">·</span><span className="pc-meta-text">STEP 2 主管检视会组织与PPT自动生成</span>
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
                {callStep === 0 ? <span className="pc-rp-live-badge">● 处理中</span> : <span className="pc-rp-done-badge">✓ 完成</span>}
              </div>
              <div className="pc-rp-lines">
                {R1.slice(0, r1Lines).map((line, i) => (
                  <div key={i} className="pc-rp-line pc-fade-in-up">
                    <span className="pc-ai-tag">{i === 0 ? 'AI推理' : 'AI执行'}</span><span className="pc-rp-line-text">{line}</span>
                  </div>
                ))}
              </div>
              {r1Lines >= 2 && callStep === 0 && (
                <button className="pc-cta-btn pc-diag-section-reveal" style={{ marginTop: 12, fontSize: 13 }} onClick={handleConfirmCall}>
                  <span>☎️</span> 确认，启动AI外呼
                </button>
              )}
            </div>
          )}

          {/* Dual phone calls */}
          {callStep >= 1 && (
            <div className="sc-calls-panel pc-fade-in">
              <div className="sc-calls-title">
                <span className="pc-rp-icon">☎️</span>
                <span>AI 外呼任务台</span>
                {callStep === 1 && <span className="pc-rp-live-badge">● 通话中</span>}
                {callStep === 2 && <span className="pc-rp-done-badge">✓ 通话完成</span>}
              </div>
              {CALL_SCRIPTS.map((person, i) => (
                <div key={i} className={`sc-call-row ${callsDone[i] ? 'sc-call-done' : ''}`}
                     onClick={() => { if (callStep === 1 && !callsDone[i]) { setCallModalIdx(i); setDialogIdx(0); } }}
                     style={{ cursor: callStep === 1 && !callsDone[i] ? 'pointer' : 'default' }}>
                  <div className="sc-call-info">
                    <span className="sc-call-icon">☎️</span>
                    <div>
                      <div className="sc-call-name">{person.name}</div>
                      <div className="sc-call-dept">{person.dept}</div>
                    </div>
                  </div>
                  {!callsDone[i] && callStep === 1 ? (
                    <div className="sc-call-waveform">
                      {[...Array(8)].map((_, j) => (
                        <span key={j} className="sc-wave-bar sc-wave-bar-call" style={{ animationDelay: `${(i * 0.3 + j * 0.1)}s` }} />
                      ))}
                      <span className="sc-call-status-label">通话中…</span>
                    </div>
                  ) : callsDone[i] ? (
                    <span className="sc-call-done-badge">✓ 已完成</span>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {/* ── Call Recording Modal ── */}
          {callModalIdx >= 0 && currentScript && (
            <div className="sc-call-modal-overlay">
              <div className="sc-call-modal">
                <div className="sc-call-modal-header">
                  <div className="sc-call-modal-status">
                    <span className="sc-call-modal-rec-dot" />
                    <span>录音中</span>
                  </div>
                  <div className="sc-call-modal-title">
                    AI外呼 · {currentScript.name}（{currentScript.dept}）
                  </div>
                  <div className="sc-call-modal-timer">
                    <span className="sc-call-modal-wave">
                      {[...Array(6)].map((_, i) => <span key={i} className="sc-wave-bar sc-wave-bar-modal" style={{ animationDelay: `${i * 0.12}s` }} />)}
                    </span>
                  </div>
                </div>
                <div className="sc-call-modal-body">
                  {currentScript.lines.slice(0, dialogIdx).map((line, i) => (
                    <div key={i} className={`sc-dialog-row sc-dialog-${line.role} pc-fade-in-up`}>
                      <span className="sc-dialog-avatar">
                        {line.role === 'ai' ? '🤖' : '👤'}
                      </span>
                      <div className="sc-dialog-bubble">
                        <div className="sc-dialog-label">
                          {line.role === 'ai' ? 'AI助手' : currentScript.name}
                        </div>
                        <div className="sc-dialog-text">{line.text}</div>
                      </div>
                    </div>
                  ))}
                  {dialogIdx < currentScript.lines.length && (
                    <div className="sc-dialog-typing-row pc-fade-in">
                      <span className="sc-dialog-avatar">
                        {currentScript.lines[dialogIdx].role === 'ai' ? '🤖' : '👤'}
                      </span>
                      <div className="sc-dialog-typing-dots">
                        <span className="pc-dot-pulse" />
                        <span className="pc-dot-pulse" style={{ animationDelay: '0.22s' }} />
                        <span className="pc-dot-pulse" style={{ animationDelay: '0.44s' }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="sc-call-modal-footer">
                  <button className="sc-call-end-btn" onClick={handleEndCall}>
                    📞 结束通话
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feedback report + Calendar 1 */}
          {step >= 4 && (
            <>
              <div className="sc-chat-row sc-chat-ai pc-fade-in-up">
                <span className="sc-avatar-ai">AI</span>
                <div className="sc-chat-bubble-ai">
                  <div className="sc-ai-reply-text">好的，已为您完成追踪，以下是《AI追踪反馈简报》：</div>
                  <div className="sc-feedback-list">
                    {[
                      {
                        name: '张宁经理', issue: '新人辅导期未跟进，属员缺乏支撑',
                        promise: '下周起每日加1小时新人专项辅导', risk: 'mid',
                      },
                      {
                        name: '王芯经理', issue: '主管刘志兴失联，钻石挂零拖累全部达成',
                        promise: '已约刘志兴明日到场面谈', risk: 'high',
                      },
                    ].map((item, i) => (
                      <div key={i} className={`sc-feedback-row sc-feedback-${item.risk}`}>
                        <div className="sc-feedback-header">
                          <span className="sc-feedback-name">{item.name}</span>
                          <span className={`sc-risk-badge sc-risk-${item.risk}`}>
                            {item.risk === 'high' ? '🚨 高风险' : '⚠ 中风险'}
                          </span>
                        </div>
                        <div className="sc-feedback-item"><span className="sc-fb-label">卡点</span>{item.issue}</div>
                        <div className="sc-feedback-item"><span className="sc-fb-label">承诺</span>{item.promise}</div>
                      </div>
                    ))}
                  </div>
                  <div className="sc-ai-reply-text" style={{ marginTop: 10, fontSize: 12, color: '#3B82F6' }}>
                    ⚡ 检测到"每周五"周期关键词 → 自动创建周期任务：每周五自动筛选月钻石占比末位2名 + AI电话追踪 + 生成反馈简报，写入AI日历
                  </div>
                  <div className="sc-calendar-entry" style={{ marginTop: 12 }}>
                    <span className="sc-cal-icon">📅</span>
                    <div>
                      <div className="sc-cal-title">已写入AI日历 · 每周五</div>
                      <div className="sc-cal-sub">月钻石末位追踪 + AI外呼 + 反馈简报 &nbsp;·&nbsp; 自动执行</div>
                    </div>
                    <span className="sc-cal-badge">周期任务</span>
                  </div>
                  <div className="sc-sent-confirm pc-fade-in" style={{ marginTop: 12 }}>
                    <span style={{ fontSize: 16 }}>✅</span>
                    <div>
                      <div className="sc-sent-title">追踪已完成</div>
                      <div className="sc-sent-sub">反馈简报已生成 &nbsp;·&nbsp; 自动任务已写入AI日历 &nbsp;·&nbsp; 后续每周五自动执行</div>
                    </div>
                  </div>
                </div>
              </div>
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
                <span className="pc-rp-title">AI 解析指令</span>
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

          {/* PPT Preview + confirm */}
          {step >= 8 && (
            <div className="sc-chat-row sc-chat-ai pc-fade-in-up">
              <span className="sc-avatar-ai">AI</span>
              <div className="sc-chat-bubble-ai">
                <div className="sc-ai-reply-text">
                  已为您分析数据，启明部主管刘志兴首周钻石挂零，已对启明部王芯经理和刘志兴发送主管检视会邀约。以下是我为您生成的PPT，请您确认：
                </div>
                <div className="sc-ppt-preview">
                  <div className="sc-ppt-header">
                    <span className="sc-ppt-icon">📊</span>
                    <span className="sc-ppt-title">营业区主管检视会议.pptx</span>
                    <span className="sc-ppt-badge">AI生成</span>
                  </div>

                  {/* PPT Cover */}
                  {pptStep >= 1 && (
                    <div className="sc-ppt-cover pc-fade-in-up">
                      <div className="sc-ppt-cover-stripe" />
                      <div className="sc-ppt-cover-content">
                        <div className="sc-ppt-cover-logo">PING AN</div>
                        <div className="sc-ppt-cover-title">营业区主管检视会议</div>
                        <div className="sc-ppt-cover-sub">2026年3月 · AI智能生成</div>
                        <div className="sc-ppt-cover-divider" />
                        <div className="sc-ppt-cover-meta">
                          <span>议题：首周钻石挂零主管检视</span>
                          <span>参会人：王芯、刘志兴</span>
                        </div>
                      </div>
                      <div className="sc-ppt-cover-page">封面</div>
                    </div>
                  )}

                  {/* Slide thumbnails */}
                  <div className="sc-ppt-thumbs">
                    {PPT_SLIDES.slice(0, Math.max(0, pptStep - 1)).map((slide, i) => (
                      <div key={i} className="sc-ppt-thumb pc-fade-in-up">
                        <div className="sc-ppt-thumb-header">
                          <span className="sc-ppt-thumb-label">{slide.label}</span>
                          <span className="sc-ppt-thumb-title">{slide.title}</span>
                        </div>
                        <div className="sc-ppt-thumb-body">
                          {slide.bullets.map((b, j) => (
                            <div key={j} className="sc-ppt-thumb-bullet">
                              <span className="sc-ppt-thumb-dot" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {pptStep >= 5 && !pptConfirmed && (
                    <button className="pc-cta-btn pc-diag-section-reveal" style={{ marginTop: 12, fontSize: 13 }} onClick={handleConfirmPPT}>
                      确认，PPT没问题
                    </button>
                  )}
                </div>

                {pptConfirmed && (
                  <div className="sc-sent-confirm pc-fade-in" style={{ marginTop: 12 }}>
                    <span style={{ fontSize: 20 }}>✅</span>
                    <div>
                      <div className="sc-sent-title">会议邀请已发送至王芯和刘志兴</div>
                      <div className="sc-sent-sub">PPT已同步至会议附件 &nbsp;·&nbsp; 时间节点已写入AI日历</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
