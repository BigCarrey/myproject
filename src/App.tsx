import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MessageBubble } from './components/MessageBubble';
import { InputBar } from './components/InputBar';
import { QuickReplies } from './components/QuickReplies';
import { TypingIndicator } from './components/TypingIndicator';
import { OverviewPage } from './components/OverviewPage';
import { WeChatSimulator } from './components/WeChatSimulator';
import { FieldMemoryPanel } from './components/FieldMemoryPanel';
import { useChat } from './hooks/useChat';
import { useSpeech } from './hooks/useSpeech';
import { scenarios as backofficeScenarioData } from './data/scenarios';
import { fieldScenarios } from './data/fieldScenarios';
import type { WeChatState, WeChatEvent, WeChatChatMessage, WeChatMoment, FollowUpReminder, WeChatNotification, MessageContentType } from './types';

const backofficeModules = [
  {
    id: 'backoffice-progress-tracking',
    name: '进度自动追踪',
    timing: '进度追踪',
    icon: '📊',
    color: '#3B82F6',
    narration: '郑晓您好，本月代理人业绩追踪已自动更新，让我们来看看各位代理人的进度。',
    category: 'backoffice',
  },
  {
    id: 'backoffice-problem-diagnosis',
    name: '问题预警诊断',
    timing: '问题预警',
    icon: '🔍',
    color: '#DC2626',
    narration: '系统正在为您从多个数据源自动抓取代理人经营数据，进行问题预警诊断。',
    category: 'backoffice',
  },
  {
    id: 'backoffice-meeting-strategy',
    name: '面谈策略指引',
    timing: '面谈策略',
    icon: '💡',
    color: '#7C3AED',
    narration: '根据代理人的问题诊断结果，系统已为您生成面谈策略指引。',
    category: 'backoffice',
  },
  {
    id: 'backoffice-meeting-assist',
    name: '面谈全程辅助',
    timing: '面谈辅助',
    icon: '🎙️',
    color: '#059669',
    narration: '面谈全程辅助已准备就绪，系统将为您实时录音、转写并生成面谈总结。',
    category: 'backoffice',
  },
  {
    id: 'backoffice-report-generation',
    name: '报告一键制作',
    timing: '智能报告',
    icon: '📋',
    color: '#6366F1',
    narration: '报告一键制作功能已就绪，请上传素材或授权数据，AI将自动生成专业报告。',
    category: 'backoffice',
  },
  {
    id: 'backoffice-material-generation',
    name: '营销素材生成',
    timing: '营销素材',
    icon: '🎨',
    color: '#9333EA',
    narration: '营销素材生成功能已就绪，30秒内为您生成全套营销素材并支持跨平台分发。',
    category: 'backoffice',
  },
  {
    id: 'backoffice-case-mining',
    name: '典范案例挖掘',
    timing: '案例挖掘',
    icon: '🏆',
    color: '#047857',
    narration: '典范案例挖掘功能已就绪，系统将根据您设定的标签自动匹配最佳案例。',
    category: 'backoffice',
  },
  {
    id: 'backoffice-case-summary',
    name: '案例智能归纳',
    timing: '案例归纳',
    icon: '🎬',
    color: '#0369A1',
    narration: 'AI数字人访谈功能已就绪，将自动归纳典范事迹并生成宣导视频。',
    category: 'backoffice',
  },
];

const fieldModules = [
  {
    id: 'field-content-creation',
    name: '个性内容定制',
    timing: '朋友圈内容',
    icon: '✍️',
    color: '#3B82F6',
    narration: '小李您好，我来帮您定制一条个性化朋友圈内容，吸引潜在客户关注。',
    category: 'field',
  },
  {
    id: 'field-smart-reply',
    name: '问题智能回复',
    timing: '客户咨询',
    icon: '💬',
    color: '#DC2626',
    narration: '王哥在微信上发来了关于健康险的咨询，我来帮您快速生成专业回复。',
    category: 'field',
  },
  {
    id: 'field-interest-insight',
    name: '好友兴趣洞察',
    timing: '需求解析',
    icon: '🔍',
    color: '#7C3AED',
    narration: '正在分析王哥的社交动态和兴趣偏好，为您生成个性化需求分析。',
    category: 'field',
  },
  {
    id: 'field-sales-script',
    name: '精准话术推荐',
    timing: '话术准备',
    icon: '🎯',
    color: '#059669',
    narration: '基于王哥的需求画像，为您推荐最合适的销售话术和沟通策略。',
    category: 'field',
  },
  {
    id: 'field-coverage-gap',
    name: '保障缺口诊断',
    timing: '缺口分析',
    icon: '🛡️',
    color: '#6366F1',
    narration: '正在分析王哥现有的保障情况，诊断潜在的保障缺口。',
    category: 'field',
  },
  {
    id: 'field-product-matching',
    name: '产品精准匹配',
    timing: '产品推荐',
    icon: '📦',
    color: '#9333EA',
    narration: '根据保障缺口，为王哥精准匹配最合适的保险产品组合。',
    category: 'field',
  },
  {
    id: 'field-commission-calc',
    name: '收益分析测算',
    timing: '佣金测算',
    icon: '💰',
    color: '#047857',
    narration: '为您测算本次推荐方案的预期收益和佣金明细。',
    category: 'field',
  },
  {
    id: 'field-presentation-gen',
    name: '讲解素材生成',
    timing: '素材与跟进',
    icon: '📑',
    color: '#0369A1',
    narration: '正在为您生成面见王哥时的专业讲解素材和跟进提醒计划。',
    category: 'field',
  },
];

// Message types shown in 对话调度 (conversation dispatch phone)
const DISPATCH_TYPES: MessageContentType[] = [
  'text',
  'field-moments-post',
  'field-reply-preview',
  'field-sales-script',
  'field-materials',
];


function App() {
  const [mode, setMode] = useState<'backoffice' | 'field'>('backoffice');

  const currentModules = mode === 'backoffice' ? backofficeModules : fieldModules;
  const currentScenarios = useMemo(
    () => (mode === 'backoffice' ? backofficeScenarioData : fieldScenarios),
    [mode]
  );

  const chat = useChat(currentScenarios);
  const speech = useSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastTranscriptRef = useRef<string>('');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showOverview, setShowOverview] = useState(false);
  const [transition, setTransition] = useState<{ icon: string; label: string } | null>(null);

  // WeChat simulator state (only used in field mode)
  const [wechatState, setWechatState] = useState<WeChatState>({
    currentView: 'home',
    chatMessages: [],
    moments: [],
    screenshotHelper: null,
    notification: null,
  });

  // Execution panel focus (center overlay) state
  const [executionFocused, setExecutionFocused] = useState(false);

  // Follow-up reminder popup state
  const [followUpReminder, setFollowUpReminder] = useState<FollowUpReminder | null>(null);

  // WeChat event handler
  const handleWeChatEvents = useCallback((events: WeChatEvent[]) => {
    events.forEach((evt) => {
      if (evt.type === 'show-followup-reminder') {
        setFollowUpReminder(evt.data as FollowUpReminder);
        return;
      }
      if (evt.type === 'show-wechat-notification') {
        const notif = evt.data as WeChatNotification;
        // Delay notification by 2 seconds after moments view switches
        setTimeout(() => {
          setWechatState((prev) => ({ ...prev, notification: notif }));
        }, 2000);
        return;
      }
      if (evt.type === 'hide-wechat-notification') {
        setWechatState((prev) => ({ ...prev, notification: null }));
        return;
      }
      setWechatState((prev) => {
        switch (evt.type) {
          case 'add-chat':
            return { ...prev, chatMessages: [...prev.chatMessages, evt.data as WeChatChatMessage] };
          case 'add-moment':
            return { ...prev, moments: [evt.data as WeChatMoment, ...prev.moments] };
          case 'set-chat-messages':
            return { ...prev, chatMessages: evt.data as WeChatChatMessage[] };
          case 'set-moments':
            return { ...prev, moments: evt.data as WeChatMoment[] };
          case 'switch-view': {
            const newView = evt.data as 'home' | 'chat' | 'moments';
            // When switching to moments, briefly focus execution panel
            if (newView === 'moments') {
              setTimeout(() => {
                setExecutionFocused(true);
                setTimeout(() => setExecutionFocused(false), 3500);
              }, 300);
            }
            return { ...prev, currentView: newView };
          }
          case 'show-screenshot-helper':
            return { ...prev, screenshotHelper: evt.data as WeChatState['screenshotHelper'] };
          case 'hide-screenshot-helper':
            return { ...prev, screenshotHelper: null };
          default:
            return prev;
        }
      });
    });
  }, []);

  useEffect(() => {
    chat.initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const noop = () => {};
    chat.registerSpeak(
      autoSpeak ? speech.speak : noop,
      autoSpeak ? speech.enqueueSpeak : noop
    );
  }, [autoSpeak, speech.speak, speech.enqueueSpeak, chat.registerSpeak]);

  useEffect(() => {
    if (mode === 'field') {
      chat.registerWeChatEvent(handleWeChatEvents);
    } else {
      chat.registerWeChatEvent(() => {});
    }
  }, [mode, chat.registerWeChatEvent, handleWeChatEvents]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat.messages, chat.isTyping, chat.quickReplies]);

  useEffect(() => {
    if (speech.isListening) return;
    if (!speech.transcript) return;
    const text = speech.transcript.trim();
    if (!text) return;
    if (text === lastTranscriptRef.current) return;
    lastTranscriptRef.current = text;
    chat.handleUserMessage(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.isListening, speech.transcript]);

  const startModuleWithNarration = useCallback(
    (moduleId: string) => {
      const mod = currentModules.find((m) => m.id === moduleId);
      if (!mod) return;
      setActiveModule(moduleId);
      if (autoSpeak && mod.narration) {
        setTransition({ icon: mod.icon, label: mod.name });
        speech.narrate(mod.narration, () => {
          setTransition(null);
          chat.resetAndStartScenario(moduleId);
        });
      } else {
        chat.resetAndStartScenario(moduleId);
      }
    },
    [chat, speech, autoSpeak, currentModules]
  );

  const handleStartDemo = useCallback(() => {
    setShowOverview(false);
    startModuleWithNarration(currentModules[0].id);
  }, [startModuleWithNarration, currentModules]);

  const handleModuleClick = useCallback(
    (moduleId: string) => {
      startModuleWithNarration(moduleId);
    },
    [startModuleWithNarration]
  );

  const handleQuickReply = useCallback(
    (reply: { label: string; value: string }) => {
      const mod = currentModules.find((m) => m.id === reply.value);
      if (mod) {
        chat.addMessage({ role: 'user', type: 'text', content: reply.label });
        chat.startScenario(mod.id);
        setActiveModule(mod.id);
      } else {
        chat.handleQuickReply(reply);
      }
    },
    [chat, currentModules]
  );

  const handleSpeak = useCallback(
    (text: string) => {
      if (speech.isSpeaking) {
        speech.stopSpeaking();
      } else {
        speech.speak(text);
      }
    },
    [speech]
  );

  const handleModeToggle = useCallback(() => {
    const newMode = mode === 'backoffice' ? 'field' : 'backoffice';
    setMode(newMode);
    setActiveModule(null);
    speech.stopSpeaking();
    setTransition(null);
    setExecutionFocused(false);
    setWechatState({ currentView: 'home', chatMessages: [], moments: [], screenshotHelper: null, notification: null });
    setFollowUpReminder(null);

    setTimeout(() => {
      if (newMode === 'backoffice') {
        chat.initChat();
      } else {
        chat.initChat(
          '小李您好！我是您的AI销售助理\n\n我将全程协助您拓展客户、精准营销。让我们开始今天的工作吧！\n\n📌 待跟进客户：\n• 王哥 — 三高体况，健康险咨询意向\n• 朋友圈营销内容待发布\n\n请选择您需要的服务：',
          '小李您好！我是您的AI销售助理，让我们开始今天的工作。'
        );
      }
    }, 50);
  }, [mode, chat, speech]);

  // Dispatch messages – shown in 对话调度 phone
  const dispatchMessages = useMemo(
    () => chat.messages.filter((m) => DISPATCH_TYPES.includes(m.type as MessageContentType)),
    [chat.messages]
  );

  // All messages – passed to FieldMemoryPanel for memory extraction
  const allMessages = chat.messages;

  if (showOverview) {
    return (
      <OverviewPage
        onStart={handleStartDemo}
        narrate={autoSpeak ? speech.narrate : () => {}}
      />
    );
  }

  // ── Field mode layout ─────────────────────────────────────────────────────
  if (mode === 'field') {
    const wechatProps = {
      currentView: wechatState.currentView,
      chatMessages: wechatState.chatMessages,
      moments: wechatState.moments,
      screenshotHelper: wechatState.screenshotHelper,
      notification: wechatState.notification,
      onSwitchView: (v: 'home' | 'chat' | 'moments') => setWechatState((prev) => ({ ...prev, currentView: v })),
      onDismissNotification: () => setWechatState((prev) => ({ ...prev, notification: null })),
      onNotificationClick: () => {
        setWechatState((prev) => ({ ...prev, currentView: 'chat', notification: null }));
      },
    };

    return (
      <div className="h-full flex items-center justify-center py-5 noise-overlay" style={{ background: 'linear-gradient(180deg, #EBF5FF 0%, #E0F2FE 50%, #DBEAFE 100%)' }}>
        {/* Left Sidebar Navigation */}
        <div className="sidebar sidebar-compact">
          <div className="sidebar-header">
            <div>
              <h2 className="sidebar-title" style={{ fontSize: 17 }}>万能营销</h2>
              <span style={{ fontSize: '11px', color: '#D4AF37', letterSpacing: '0.15em', fontWeight: 600 }}>PRO</span>
            </div>
          </div>
          <div className="sidebar-label">外勤场景</div>
          <nav className="sidebar-nav">
            {fieldModules.map((mod) => (
              <button
                key={mod.id}
                className={`sidebar-item ${activeModule === mod.id ? 'sidebar-item-active' : ''}`}
                onClick={() => handleModuleClick(mod.id)}
              >
                <span
                  className="sidebar-icon"
                  style={{ background: activeModule === mod.id ? mod.color : undefined }}
                >
                  {mod.icon}
                </span>
                <div className="sidebar-item-text">
                  <span className="sidebar-item-name" style={{ fontSize: 12 }}>{mod.name}</span>
                  <span className="sidebar-item-timing">{mod.timing}</span>
                </div>
                {activeModule === mod.id && (
                  <span className="sidebar-active-dot" style={{ background: mod.color }} />
                )}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <p>智能销售助手</p>
            <p>点击场景开始演示</p>
          </div>
          <button
            className="mode-toggle-tab"
            onClick={handleModeToggle}
            title="切换到内勤场景"
          >
            内勤
          </button>
        </div>

        {/* 3-Column Field Layout */}
        <div className="field-columns-wrapper">
          {/* ── 对话调度 ── */}
          <div className="field-column">
            <div className="field-panel-label">对话调度</div>
            <div className="phone-frame phone-frame-field">
              <div className="phone-notch" />
              <div className="phone-screen">
                {transition ? (
                  <div className="scene-transition">
                    <div className="scene-transition-icon">{transition.icon}</div>
                    <div className="scene-transition-label">{transition.label}</div>
                  </div>
                ) : (
                  <>
                    <Header
                      isSpeaking={speech.isSpeaking}
                      onStopSpeaking={speech.stopSpeaking}
                      autoSpeak={autoSpeak}
                      onToggleAutoSpeak={() => {
                        setAutoSpeak((v) => {
                          if (v) speech.stopSpeaking();
                          return !v;
                        });
                      }}
                    />
                    <div
                      ref={chatContainerRef}
                      className="flex-1 overflow-y-auto pt-4 pb-28"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      {dispatchMessages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} onSpeak={handleSpeak} />
                      ))}
                      {chat.isTyping && <TypingIndicator />}
                      {chat.quickReplies.length > 0 && !chat.isTyping && (
                        <QuickReplies replies={chat.quickReplies} onSelect={handleQuickReply} />
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <InputBar
                      onSend={chat.handleUserMessage}
                      onVoiceStart={speech.startListening}
                      onVoiceStop={speech.stopListening}
                      isListening={speech.isListening}
                      transcript={speech.transcript}
                      disabled={chat.isTyping}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── 代理人记忆 ── */}
          <div className="field-column">
            <div className="field-panel-label">代理人记忆</div>
            <FieldMemoryPanel messages={allMessages} onSpeak={handleSpeak} />
          </div>

          {/* ── 执行面板 ── */}
          <div className="field-column">
            <div className="field-panel-label">执行面板</div>
            <div className="wechat-phone-frame wechat-phone-frame-field">
              <div className="phone-notch" />
              <div className="phone-screen" style={{ background: '#EDEDED' }}>
                <WeChatSimulator {...wechatProps} />
              </div>
            </div>
          </div>
        </div>

        {/* Execution panel focus overlay (after Moments posting) */}
        {executionFocused && (
          <div className="execution-overlay" onClick={() => setExecutionFocused(false)}>
            <div className="execution-overlay-phone" onClick={(e) => e.stopPropagation()}>
              <div className="phone-notch" />
              <div className="phone-screen" style={{ background: '#EDEDED' }}>
                <WeChatSimulator {...wechatProps} />
              </div>
            </div>
          </div>
        )}

        {/* Follow-up Reminder Popup */}
        {followUpReminder && (
          <div className="followup-popup-overlay" onClick={() => setFollowUpReminder(null)}>
            <div className="followup-popup" onClick={(e) => e.stopPropagation()}>
              <div className="followup-popup-header">
                <span className="followup-popup-icon">⏰</span>
                <span className="followup-popup-title">{followUpReminder.title}</span>
                <button className="followup-popup-close" onClick={() => setFollowUpReminder(null)}>✕</button>
              </div>
              <div className="followup-popup-body">
                {followUpReminder.schedule.map((item, i) => (
                  <div key={i} className="followup-popup-item">
                    <div className="followup-popup-date">{item.date}</div>
                    <div className="followup-popup-action">{item.action}</div>
                  </div>
                ))}
              </div>
              {followUpReminder.summary && (
                <div className="followup-popup-summary">{followUpReminder.summary}</div>
              )}
              <button className="followup-popup-confirm" onClick={() => setFollowUpReminder(null)}>
                知道了
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Backoffice mode layout (unchanged) ───────────────────────────────────
  return (
    <div className="h-full flex items-center justify-center py-5 noise-overlay" style={{ background: 'linear-gradient(180deg, #EBF5FF 0%, #E0F2FE 50%, #DBEAFE 100%)' }}>
      {/* Left Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div>
            <h2 className="sidebar-title">万能营销</h2>
            <span style={{ fontSize: '11px', color: '#D4AF37', letterSpacing: '0.15em', fontWeight: 600 }}>PRO</span>
          </div>
        </div>

        <div className="sidebar-label">内勤场景</div>

        <nav className="sidebar-nav">
          {backofficeModules.map((mod) => (
            <button
              key={mod.id}
              className={`sidebar-item ${activeModule === mod.id ? 'sidebar-item-active' : ''}`}
              onClick={() => handleModuleClick(mod.id)}
            >
              <span
                className="sidebar-icon"
                style={{
                  background: activeModule === mod.id ? mod.color : undefined,
                }}
              >
                {mod.icon}
              </span>
              <div className="sidebar-item-text">
                <span className="sidebar-item-name">{mod.name}</span>
                <span className="sidebar-item-timing">{mod.timing}</span>
              </div>
              {activeModule === mod.id && (
                <span className="sidebar-active-dot" style={{ background: mod.color }} />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>智能辅导系统</p>
          <p>点击场景开始演示</p>
        </div>

        <button
          className="mode-toggle-tab"
          onClick={handleModeToggle}
          title="切换到外勤场景"
        >
          外勤
        </button>
      </div>

      {/* Phone Mockup */}
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          {transition ? (
            <div className="scene-transition">
              <div className="scene-transition-icon">{transition.icon}</div>
              <div className="scene-transition-label">{transition.label}</div>
            </div>
          ) : (
            <>
              <Header
                isSpeaking={speech.isSpeaking}
                onStopSpeaking={speech.stopSpeaking}
                autoSpeak={autoSpeak}
                onToggleAutoSpeak={() => {
                  setAutoSpeak((v) => {
                    if (v) speech.stopSpeaking();
                    return !v;
                  });
                }}
              />
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto pt-4 pb-28"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {chat.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} onSpeak={handleSpeak} />
                ))}
                {chat.isTyping && <TypingIndicator />}
                {chat.quickReplies.length > 0 && !chat.isTyping && (
                  <QuickReplies replies={chat.quickReplies} onSelect={handleQuickReply} />
                )}
                <div ref={messagesEndRef} />
              </div>
              <InputBar
                onSend={chat.handleUserMessage}
                onVoiceStart={speech.startListening}
                onVoiceStop={speech.stopListening}
                isListening={speech.isListening}
                transcript={speech.transcript}
                disabled={chat.isTyping}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
