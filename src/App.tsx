import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MessageBubble } from './components/MessageBubble';
import { InputBar } from './components/InputBar';
import { QuickReplies } from './components/QuickReplies';
import { TypingIndicator } from './components/TypingIndicator';
import { OverviewPage } from './components/OverviewPage';
import { AgentMemoryPanel } from './components/AgentMemoryPanel';
import { ExecutionPanel } from './components/ExecutionPanel';
import { LaunchCeremony } from './components/LaunchCeremony';
import { FieldAssistantHome } from './components/FieldAssistantHome';
import { useChat } from './hooks/useChat';
import { useSpeech } from './hooks/useSpeech';
import { scenarios as backofficeScenarioData } from './data/scenarios';
import { fieldScenarios } from './data/fieldScenarios';
import type {
  WeChatState,
  WeChatEvent,
  WeChatChatMessage,
  WeChatMoment,
  FollowUpReminder,
  AgentMemoryField,
  ExecutionTab,
  CalendarEntry,
  TranscriptItem,
  ExecutionNotification,
  IMEState,
} from './types';

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

// Initial static profile for agent memory
const initialMemoryFields: AgentMemoryField[] = [
  { icon: '👤', label: '姓名', value: '小李', category: 'static' },
  { icon: '⚧', label: '性别', value: '男', category: 'static' },
  { icon: '🎂', label: '年龄', value: '28岁', category: 'static' },
  { icon: '📍', label: '所在地', value: '深圳', category: 'static' },
  { icon: '🎓', label: '学历', value: '本科', category: 'static' },
  { icon: '📈', label: '绩效', value: 'B+', category: 'static' },
  { icon: '🏢', label: '入司时间', value: '2023年3月', category: 'static' },
];

function App() {
  const [mode, setMode] = useState<'backoffice' | 'field'>('field');

  const currentModules = mode === 'backoffice' ? backofficeModules : [];
  const currentScenarios = useMemo(
    () => (mode === 'backoffice' ? backofficeScenarioData : fieldScenarios),
    [mode]
  );

  const chat = useChat(currentScenarios);
  const speech = useSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const homeContainerRef = useRef<HTMLDivElement>(null);
  const lastTranscriptRef = useRef<string>('');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showOverview, setShowOverview] = useState(false);
  const [transition, setTransition] = useState<{ icon: string; label: string } | null>(null);

  // WeChat simulator state (used in both modes for field)
  const [wechatState, setWechatState] = useState<WeChatState>({
    currentView: 'chat',
    chatMessages: [],
    moments: [],
    screenshotHelper: null,
  });

  // Follow-up reminder popup state
  const [followUpReminder, setFollowUpReminder] = useState<FollowUpReminder | null>(null);

  // ===== Field mode specific state =====
  const [showLaunchCeremony, setShowLaunchCeremony] = useState(false);
  const [showAssistantHome, setShowAssistantHome] = useState(false);
  const [memoryCollapsed, setMemoryCollapsed] = useState(false);   // left panel toggle
  const [executionStarted, setExecutionStarted] = useState(false); // revealed by ceremony
  const [executionHidden, setExecutionHidden] = useState(false);   // user manual toggle
  const [memoryFields, setMemoryFields] = useState<AgentMemoryField[]>(initialMemoryFields);
  const [executionTab, setExecutionTab] = useState<ExecutionTab>('chat');
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [notification, setNotification] = useState<ExecutionNotification | null>(null);
  const [imeState, setImeState] = useState<IMEState | null>(null);
  const panelCollapseTimerRef = useRef<number | null>(null);

  // Recording timer effect
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
    } else if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  // Cleanup panel collapse timer
  useEffect(() => {
    return () => {
      if (panelCollapseTimerRef.current) {
        clearTimeout(panelCollapseTimerRef.current);
      }
    };
  }, []);

  // Extended event handler for field mode
  const handleWeChatEvents = useCallback((events: WeChatEvent[]) => {
    events.forEach((evt) => {
      if (evt.type === 'show-followup-reminder') {
        setFollowUpReminder(evt.data as FollowUpReminder);
        return;
      }
      if (evt.type === 'update-memory') {
        const newFields = evt.data as AgentMemoryField[];
        setMemoryFields((prev) => [...prev, ...newFields]);
        return;
      }
      if (evt.type === 'add-calendar-entry') {
        const entry = evt.data as CalendarEntry;
        setCalendarEntries((prev) => [...prev, entry]);
        return;
      }
      if (evt.type === 'switch-execution-tab') {
        setExecutionTab(evt.data as ExecutionTab);
        return;
      }
      if (evt.type === 'start-recording') {
        setIsRecording(true);
        setRecordingDuration(0);
        return;
      }
      if (evt.type === 'stop-recording') {
        setIsRecording(false);
        return;
      }
      if (evt.type === 'add-transcript-item') {
        const item = evt.data as TranscriptItem;
        setTranscriptItems((prev) => [...prev, item]);
        return;
      }
      if (evt.type === 'expand-panel') {
        setPanelExpanded(true);
        // Auto-collapse after 2.8s (scenario sends collapse-panel, but this is a safety fallback)
        if (panelCollapseTimerRef.current) clearTimeout(panelCollapseTimerRef.current);
        panelCollapseTimerRef.current = window.setTimeout(() => setPanelExpanded(false), 2800);
        return;
      }
      if (evt.type === 'collapse-panel') {
        if (panelCollapseTimerRef.current) {
          clearTimeout(panelCollapseTimerRef.current);
          panelCollapseTimerRef.current = null;
        }
        setPanelExpanded(false);
        return;
      }
      if (evt.type === 'show-notification') {
        setNotification(evt.data as ExecutionNotification);
        return;
      }
      if (evt.type === 'show-ime') {
        setImeState(evt.data as IMEState);
        return;
      }
      if (evt.type === 'hide-ime') {
        setImeState(null);
        return;
      }
      if (evt.type === 'set-ime-reply') {
        setImeState(evt.data as IMEState);
        return;
      }

      // Standard WeChat state events
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
          case 'switch-view':
            return { ...prev, currentView: evt.data as 'chat' | 'moments' };
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
    if (mode === 'field') {
      chat.initFieldContinuous('field-continuous');
    } else {
      chat.initChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Register speak callbacks
  useEffect(() => {
    const noop = () => {};
    chat.registerSpeak(
      autoSpeak ? speech.speak : noop,
      autoSpeak ? speech.enqueueSpeak : noop
    );
  }, [autoSpeak, speech.speak, speech.enqueueSpeak, chat.registerSpeak]);

  // Register WeChat event handler
  useEffect(() => {
    if (mode === 'field') {
      chat.registerWeChatEvent(handleWeChatEvents);
    } else {
      chat.registerWeChatEvent(() => {});
    }
  }, [mode, chat.registerWeChatEvent, handleWeChatEvents]);

  // Auto scroll to bottom (normal chat)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat.messages, chat.isTyping, chat.quickReplies]);

  // Scroll home container to top when it appears
  useEffect(() => {
    if (showAssistantHome && homeContainerRef.current) {
      homeContainerRef.current.scrollTop = 0;
    }
  }, [showAssistantHome]);

  // Handle voice transcript submission
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
    if (mode === 'backoffice') {
      startModuleWithNarration(currentModules[0].id);
    }
  }, [startModuleWithNarration, currentModules, mode]);

  const handleModuleClick = useCallback(
    (moduleId: string) => {
      startModuleWithNarration(moduleId);
    },
    [startModuleWithNarration]
  );

  const handleQuickReply = useCallback(
    (reply: { label: string; value: string }) => {
      if (mode === 'backoffice') {
        const mod = currentModules.find((m) => m.id === reply.value);
        if (mod) {
          chat.addMessage({ role: 'user', type: 'text', content: reply.label });
          chat.startScenario(mod.id);
          setActiveModule(mod.id);
        } else {
          chat.handleQuickReply(reply);
        }
      } else {
        // Field mode: "start-work" opens the ceremony then the assistant home
        // — clear messages immediately so nothing flashes behind the ceremony
        if (reply.value === 'start-work') {
          chat.clearMessages();
          setMemoryCollapsed(true);   // hide memory immediately when ceremony starts
          setShowLaunchCeremony(true);
          return;
        }
        chat.handleQuickReply(reply);
      }
    },
    [chat, currentModules, mode]
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

  const handleConfirmPost = useCallback(() => {
    setShowAssistantHome(false);
    // Jump straight to "post success + Wang Ge reacted" (step 4 in the scenario)
    chat.jumpToStep('field-continuous', 4);
  }, [chat]);

  const handleModeToggle = useCallback(() => {
    const newMode = mode === 'backoffice' ? 'field' : 'backoffice';
    setMode(newMode);
    setActiveModule(null);
    speech.stopSpeaking();
    setTransition(null);
    // Reset WeChat state
    setWechatState({ currentView: 'chat', chatMessages: [], moments: [], screenshotHelper: null });
    setFollowUpReminder(null);
    // Reset field-specific state
    setShowLaunchCeremony(false);
    setShowAssistantHome(false);
    setMemoryFields(initialMemoryFields);
    setExecutionTab('chat');
    setCalendarEntries([]);
    setIsRecording(false);
    setRecordingDuration(0);
    setTranscriptItems([]);
    setPanelExpanded(false);
    setNotification(null);
    setImeState(null);

    // Reinitialize chat
    setTimeout(() => {
      if (newMode === 'backoffice') {
        chat.initChat();
      } else {
        // Field mode: start the continuous scenario directly
        chat.initFieldContinuous('field-continuous');
      }
    }, 50);
  }, [mode, chat, speech]);

  if (showOverview) {
    return (
      <OverviewPage
        onStart={handleStartDemo}
        narrate={autoSpeak ? speech.narrate : () => {}}
      />
    );
  }

  // ===== Field Mode: 3-column layout =====
  if (mode === 'field') {
    return (
      <div className="h-full flex items-center justify-center py-5 noise-overlay" style={{ background: 'linear-gradient(180deg, #EBF5FF 0%, #E0F2FE 50%, #DBEAFE 100%)' }}>
        {/* Left: Agent Memory Panel — retracted when ceremony starts */}
        <div className={`field-column field-column-left${memoryCollapsed ? ' panel-retracted' : ''}`}>
          {/* Memory collapse/expand button — at right inner edge */}
          <button
            className="field-drawer-btn field-drawer-btn-right"
            onClick={() => setMemoryCollapsed(v => !v)}
            title={memoryCollapsed ? '展开记忆面板' : '收起记忆面板'}
          >
            {memoryCollapsed ? '‹' : '›'}
          </button>
          <AgentMemoryPanel
            fields={memoryFields}
            syncRate={
              memoryFields.some(f => f.category === 'static')
                ? Math.min(20, 2 + memoryFields.filter(f => f.category !== 'static').length * 3)
                : 0
            }
          />
        </div>

        {/* Center: AI Chat / Dispatch */}
        <div className="field-column field-column-center">
          <div className="field-chat-container">
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

                {showAssistantHome ? (
                  <>
                    {/* Assistant home replaces message history but keeps InputBar */}
                    <div
                      ref={homeContainerRef}
                      className="flex-1 overflow-y-auto pt-2 pb-28"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      <FieldAssistantHome
                        agentName={memoryFields.find((f) => f.label === '姓名')?.value || '小李'}
                        agentHobby={memoryFields.find((f) => f.label === '喜好')?.value || '跑步'}
                        onConfirmPost={handleConfirmPost}
                      />
                    </div>
                    <InputBar
                      onSend={chat.handleUserMessage}
                      onVoiceStart={speech.startListening}
                      onVoiceStop={speech.stopListening}
                      isListening={speech.isListening}
                      transcript={speech.transcript}
                      disabled={false}
                    />
                  </>
                ) : (
                  <>
                    {/* Chat messages area */}
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

                    {/* Input area */}
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
              </>
            )}

            {/* Launch Ceremony — scoped to the chat column */}
            {showLaunchCeremony && (
              <LaunchCeremony
                onComplete={() => {
                  setShowLaunchCeremony(false);
                  setExecutionStarted(true);        // execution panel slides in first
                  window.setTimeout(() => {
                    setShowAssistantHome(true);     // AI messages start after brief pause
                  }, 700);
                }}
              />
            )}
          </div>
        </div>{/* end field-column-center */}

        {/* Right: Execution Panel — invisible before ceremony, retractable after */}
        <div className={`field-column field-column-right${!executionStarted ? ' panel-invisible' : executionHidden ? ' panel-retracted' : ''}${panelExpanded ? ' panel-expanded' : ''}`}>
          {/* Execution collapse/expand button — at left inner edge */}
          {executionStarted && (
            <button
              className="field-drawer-btn field-drawer-btn-left"
              onClick={() => setExecutionHidden(v => !v)}
              title={executionHidden ? '展开执行面板' : '收起执行面板'}
            >
              {executionHidden ? '›' : '‹'}
            </button>
          )}
          <ExecutionPanel
            activeTab={executionTab}
            onSwitchTab={setExecutionTab}
            chatMessages={wechatState.chatMessages}
            screenshotHelper={wechatState.screenshotHelper}
            moments={wechatState.moments}
            calendarEntries={calendarEntries}
            isRecording={isRecording}
            recordingDuration={recordingDuration}
            transcriptItems={transcriptItems}
            notification={notification}
            onNotificationClick={(notif) => {
              setNotification(null);
              setExecutionTab(notif.targetTab);
            }}
            onDismissNotification={() => setNotification(null)}
            imeState={imeState}
            onIMEScreenshotHelp={() => {
              // 截图帮回：触发 AI 生成回复（推进到 field-reply-preview 步骤）
              chat.handleQuickReply({ label: '截图帮回', value: 'view-reply' });
            }}
            onIMESendReply={(replyText) => {
              // 1. 立即把小李的消息加入聊天（给用户即时反馈）
              setWechatState((prev) => ({
                ...prev,
                chatMessages: [
                  ...prev.chatMessages,
                  { sender: 'xiaoli' as const, content: replyText, timestamp: '10:53' },
                ],
              }));
              // 2. 关闭 IME
              setImeState(null);
              // 3. 延迟 1.5s 后推进场景 → 王哥回复出现
              window.setTimeout(() => {
                chat.handleQuickReply({ label: '点击发送', value: 'send-reply' });
              }, 1500);
            }}
          />
        </div>

        {/* Mode toggle */}
        <button
          className="field-mode-toggle"
          onClick={handleModeToggle}
          title="切换到内勤场景"
        >
          内勤
        </button>

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

  // ===== Backoffice Mode: Original sidebar layout =====
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
          {currentModules.map((mod) => (
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

        {/* Hidden mode toggle tab */}
        <button
          className="mode-toggle-tab"
          onClick={handleModeToggle}
          title="切换到外勤场景"
        >
          外勤
        </button>
      </div>

      {/* Phone Mockup - Product UI */}
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

              {/* Chat messages area */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto pt-4 pb-28"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {chat.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} onSpeak={handleSpeak} />
                ))}

                {chat.isTyping && <TypingIndicator />}

                {/* Quick replies */}
                {chat.quickReplies.length > 0 && !chat.isTyping && (
                  <QuickReplies replies={chat.quickReplies} onSelect={handleQuickReply} />
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
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

export default App;
