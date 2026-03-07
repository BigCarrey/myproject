import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MessageBubble } from './components/MessageBubble';
import { InputBar } from './components/InputBar';
import { QuickReplies } from './components/QuickReplies';
import { TypingIndicator } from './components/TypingIndicator';
import { OverviewPage } from './components/OverviewPage';
import { WeChatSimulator } from './components/WeChatSimulator';
import { AgentMemoryPanel } from './components/AgentMemoryPanel';
import { PhoneHomeScreen } from './components/PhoneHomeScreen';
import { CeremonyTransition } from './components/CeremonyTransition';
import { useChat } from './hooks/useChat';
import { useSpeech } from './hooks/useSpeech';
import { scenarios as backofficeScenarioData } from './data/scenarios';
import { fieldScenarios, memoryCollectionScenario } from './data/fieldScenarios';
import type {
  WeChatState, WeChatEvent, WeChatChatMessage, WeChatMoment,
  FollowUpReminder, FieldPhase, AgentMemory, MemoryItem,
  ExecutionPanelState, ClientMemory, CalendarEvent, PhoneNotification,
} from './types';

const backofficeModules = [
  { id: 'backoffice-progress-tracking', name: '进度自动追踪', timing: '进度追踪', icon: '📊', color: '#3B82F6', narration: '郑晓您好，本月代理人业绩追踪已自动更新，让我们来看看各位代理人的进度。', category: 'backoffice' },
  { id: 'backoffice-problem-diagnosis', name: '问题预警诊断', timing: '问题预警', icon: '🔍', color: '#DC2626', narration: '系统正在为您从多个数据源自动抓取代理人经营数据，进行问题预警诊断。', category: 'backoffice' },
  { id: 'backoffice-meeting-strategy', name: '面谈策略指引', timing: '面谈策略', icon: '💡', color: '#7C3AED', narration: '根据代理人的问题诊断结果，系统已为您生成面谈策略指引。', category: 'backoffice' },
  { id: 'backoffice-meeting-assist', name: '面谈全程辅助', timing: '面谈辅助', icon: '🎙️', color: '#059669', narration: '面谈全程辅助已准备就绪，系统将为您实时录音、转写并生成面谈总结。', category: 'backoffice' },
  { id: 'backoffice-report-generation', name: '报告一键制作', timing: '智能报告', icon: '📋', color: '#6366F1', narration: '报告一键制作功能已就绪，请上传素材或授权数据，AI将自动生成专业报告。', category: 'backoffice' },
  { id: 'backoffice-material-generation', name: '营销素材生成', timing: '营销素材', icon: '🎨', color: '#9333EA', narration: '营销素材生成功能已就绪，30秒内为您生成全套营销素材并支持跨平台分发。', category: 'backoffice' },
  { id: 'backoffice-case-mining', name: '典范案例挖掘', timing: '案例挖掘', icon: '🏆', color: '#047857', narration: '典范案例挖掘功能已就绪，系统将根据您设定的标签自动匹配最佳案例。', category: 'backoffice' },
  { id: 'backoffice-case-summary', name: '案例智能归纳', timing: '案例归纳', icon: '🎬', color: '#0369A1', narration: 'AI数字人访谈功能已就绪，将自动归纳典范事迹并生成宣导视频。', category: 'backoffice' },
];

const initialAgentMemory: AgentMemory = {
  name: '小李',
  gender: '男',
  age: 32,
  location: '深圳',
  education: '本科',
  performance: '月均FYC 1.2万',
  joinDate: '2023年3月',
  understandingLevel: 2,
  interests: [],
  socialCircle: '',
  goals: '',
  challenges: '',
  memories: [],
  clients: [],
};

const initialExecutionPanel: ExecutionPanelState = {
  currentApp: 'home',
  wechatState: { currentView: 'chat', chatMessages: [], moments: [], screenshotHelper: null },
  calendarEvents: [],
  isRecording: false,
  recordingDuration: 0,
  notification: null,
};

let memoryIdCounter = 0;
function genMemId() { return `mem-${Date.now()}-${++memoryIdCounter}`; }

function App() {
  const [mode, setMode] = useState<'backoffice' | 'field'>('field');
  const [fieldPhase, setFieldPhase] = useState<FieldPhase>('memory-collection');
  const [agentMemory, setAgentMemory] = useState<AgentMemory>(initialAgentMemory);
  const [executionPanel, setExecutionPanel] = useState<ExecutionPanelState>(initialExecutionPanel);

  const currentScenarios = useMemo(() => {
    if (mode === 'backoffice') return backofficeScenarioData;
    if (fieldPhase === 'memory-collection') return [memoryCollectionScenario];
    return fieldScenarios;
  }, [mode, fieldPhase]);

  const currentModules = mode === 'backoffice' ? backofficeModules : [];

  const chat = useChat(currentScenarios);
  const speech = useSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastTranscriptRef = useRef<string>('');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showOverview, setShowOverview] = useState(false);
  const [transition, setTransition] = useState<{ icon: string; label: string } | null>(null);

  // Backoffice WeChat state (kept for potential backoffice scenarios using wechatEvents)
  const [, setWechatState] = useState<WeChatState>({
    currentView: 'chat', chatMessages: [], moments: [], screenshotHelper: null,
  });
  const [followUpReminder, setFollowUpReminder] = useState<FollowUpReminder | null>(null);
  const [collapseLeft, setCollapseLeft] = useState(false);
  const [collapseRight, setCollapseRight] = useState(false);

  // Recording timer
  const recordingTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (executionPanel.isRecording) {
      recordingTimerRef.current = window.setInterval(() => {
        setExecutionPanel(prev => ({ ...prev, recordingDuration: prev.recordingDuration + 1 }));
      }, 1000);
    } else if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    return () => { if (recordingTimerRef.current) clearInterval(recordingTimerRef.current); };
  }, [executionPanel.isRecording]);

  // Memory update handlers
  const handleMemoryUpdate = useCallback((data: Record<string, unknown>) => {
    setAgentMemory(prev => {
      const updated = { ...prev };
      if (typeof data.understandingLevel === 'number') updated.understandingLevel = data.understandingLevel;
      if (Array.isArray(data.interests)) updated.interests = data.interests as string[];
      if (typeof data.socialCircle === 'string') updated.socialCircle = data.socialCircle;
      if (typeof data.goals === 'string') updated.goals = data.goals;
      if (typeof data.challenges === 'string') updated.challenges = data.challenges;
      if (data.newMemory) {
        const nm = data.newMemory as { category: string; content: string };
        const newItem: MemoryItem = {
          id: genMemId(), category: nm.category as MemoryItem['category'],
          content: nm.content, timestamp: Date.now(), isNew: true,
        };
        updated.memories = [newItem, ...updated.memories];
        setTimeout(() => {
          setAgentMemory(p => ({
            ...p, memories: p.memories.map(m => m.id === newItem.id ? { ...m, isNew: false } : m),
          }));
        }, 3000);
      }
      return updated;
    });
  }, []);

  const handleAddClient = useCallback((data: Record<string, unknown>) => {
    const client: ClientMemory = {
      name: data.name as string, avatar: (data.avatar as string) || '👤',
      status: (data.status as ClientMemory['status']) || 'potential',
      addedReason: (data.addedReason as string) || '',
      profile: (data.profile as Record<string, string>) || {},
      memories: (data.memories as MemoryItem[]) || [],
    };
    setAgentMemory(prev => ({ ...prev, clients: [...prev.clients.filter(c => c.name !== client.name), client] }));
  }, []);

  const handleUpdateClient = useCallback((data: Record<string, unknown>) => {
    setAgentMemory(prev => {
      const clients = prev.clients.map(c => {
        if (c.name !== data.name) return c;
        const updated = { ...c };
        if (data.status) updated.status = data.status as ClientMemory['status'];
        if (data.profile) updated.profile = data.profile as Record<string, string>;
        if (data.newMemory) {
          const nm = data.newMemory as { category: string; content: string };
          updated.memories = [{ id: genMemId(), category: nm.category as MemoryItem['category'], content: nm.content, timestamp: Date.now() }, ...updated.memories];
        }
        return updated;
      });
      return { ...prev, clients };
    });
  }, []);

  // Unified event handler
  const handleWeChatEvents = useCallback((events: WeChatEvent[]) => {
    events.forEach((evt) => {
      if (evt.type === 'update-memory') { handleMemoryUpdate(evt.data as Record<string, unknown>); return; }
      if (evt.type === 'add-client') { handleAddClient(evt.data as Record<string, unknown>); return; }
      if (evt.type === 'update-client') { handleUpdateClient(evt.data as Record<string, unknown>); return; }
      if (evt.type === 'swap-panels' || evt.type === 'unswap-panels') { return; }
      if (evt.type === 'switch-app') { setExecutionPanel(prev => ({ ...prev, currentApp: evt.data as ExecutionPanelState['currentApp'] })); return; }
      if (evt.type === 'add-calendar-event') { setExecutionPanel(prev => ({ ...prev, calendarEvents: [...prev.calendarEvents, evt.data as CalendarEvent] })); return; }
      if (evt.type === 'start-recording') { setExecutionPanel(prev => ({ ...prev, isRecording: true, recordingDuration: 0 })); return; }
      if (evt.type === 'stop-recording') { setExecutionPanel(prev => ({ ...prev, isRecording: false })); return; }
      if (evt.type === 'set-notification') { setExecutionPanel(prev => ({ ...prev, notification: evt.data as PhoneNotification })); return; }
      if (evt.type === 'show-followup-reminder') { setFollowUpReminder(evt.data as FollowUpReminder); return; }

      // WeChat state events → execution panel's wechat state
      if (mode === 'field') {
        setExecutionPanel(prev => {
          const ws = { ...prev.wechatState };
          switch (evt.type) {
            case 'add-chat': ws.chatMessages = [...ws.chatMessages, evt.data as WeChatChatMessage]; break;
            case 'add-moment': ws.moments = [evt.data as WeChatMoment, ...ws.moments]; break;
            case 'set-chat-messages': ws.chatMessages = evt.data as WeChatChatMessage[]; break;
            case 'set-moments': ws.moments = evt.data as WeChatMoment[]; break;
            case 'switch-view': ws.currentView = evt.data as 'chat' | 'moments'; break;
            case 'show-screenshot-helper': ws.screenshotHelper = evt.data as WeChatState['screenshotHelper']; break;
            case 'hide-screenshot-helper': ws.screenshotHelper = null; break;
          }
          return { ...prev, wechatState: ws };
        });
      } else {
        setWechatState(prev => {
          switch (evt.type) {
            case 'add-chat': return { ...prev, chatMessages: [...prev.chatMessages, evt.data as WeChatChatMessage] };
            case 'add-moment': return { ...prev, moments: [evt.data as WeChatMoment, ...prev.moments] };
            case 'set-chat-messages': return { ...prev, chatMessages: evt.data as WeChatChatMessage[] };
            case 'set-moments': return { ...prev, moments: evt.data as WeChatMoment[] };
            case 'switch-view': return { ...prev, currentView: evt.data as 'chat' | 'moments' };
            case 'show-screenshot-helper': return { ...prev, screenshotHelper: evt.data as WeChatState['screenshotHelper'] };
            case 'hide-screenshot-helper': return { ...prev, screenshotHelper: null };
            default: return prev;
          }
        });
      }
    });
  }, [mode, handleMemoryUpdate, handleAddClient, handleUpdateClient]);

  useEffect(() => {
    if (mode === 'field') {
      chat.resetAndStartScenario('field-memory-collection');
    } else {
      chat.initChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const noop = () => {};
    chat.registerSpeak(autoSpeak ? speech.speak : noop, autoSpeak ? speech.enqueueSpeak : noop);
  }, [autoSpeak, speech.speak, speech.enqueueSpeak, chat.registerSpeak]);

  useEffect(() => {
    chat.registerWeChatEvent(handleWeChatEvents);
  }, [chat.registerWeChatEvent, handleWeChatEvents]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages, chat.isTyping, chat.quickReplies]);

  useEffect(() => {
    if (speech.isListening) return;
    if (!speech.transcript) return;
    const text = speech.transcript.trim();
    if (!text || text === lastTranscriptRef.current) return;
    lastTranscriptRef.current = text;
    chat.handleUserMessage(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.isListening, speech.transcript]);

  const startModuleWithNarration = useCallback((moduleId: string) => {
    const mod = currentModules.find((m) => m.id === moduleId);
    if (!mod) return;
    setActiveModule(moduleId);
    if (autoSpeak && mod.narration) {
      setTransition({ icon: mod.icon, label: mod.name });
      speech.narrate(mod.narration, () => { setTransition(null); chat.resetAndStartScenario(moduleId); });
    } else {
      chat.resetAndStartScenario(moduleId);
    }
  }, [chat, speech, autoSpeak, currentModules]);

  const handleStartDemo = useCallback(() => {
    setShowOverview(false);
    if (mode === 'backoffice') startModuleWithNarration(currentModules[0].id);
  }, [startModuleWithNarration, currentModules, mode]);

  const handleModuleClick = useCallback((moduleId: string) => { startModuleWithNarration(moduleId); }, [startModuleWithNarration]);

  const handleCeremonyComplete = useCallback(() => {
    setFieldPhase('main');
    setTimeout(() => { chat.resetAndStartScenario('field-main-flow'); }, 100);
  }, [chat]);

  const handleQuickReply = useCallback((reply: { label: string; value: string }) => {
    if (reply.value === 'start-ceremony') {
      chat.addMessage({ role: 'user', type: 'text', content: reply.label });
      setFieldPhase('ceremony');
      return;
    }
    if (mode === 'backoffice') {
      const mod = currentModules.find((m) => m.id === reply.value);
      if (mod) {
        chat.addMessage({ role: 'user', type: 'text', content: reply.label });
        chat.startScenario(mod.id);
        setActiveModule(mod.id);
        return;
      }
    }
    chat.handleQuickReply(reply);
  }, [chat, currentModules, mode]);

  const handleSpeak = useCallback((text: string) => {
    if (speech.isSpeaking) speech.stopSpeaking(); else speech.speak(text);
  }, [speech]);

  const handleModeToggle = useCallback(() => {
    const newMode = mode === 'backoffice' ? 'field' : 'backoffice';
    setMode(newMode);
    setActiveModule(null);
    speech.stopSpeaking();
    setTransition(null);
    setFollowUpReminder(null);
    setWechatState({ currentView: 'chat', chatMessages: [], moments: [], screenshotHelper: null });
    setExecutionPanel(initialExecutionPanel);
    setTimeout(() => {
      if (newMode === 'backoffice') {
        chat.initChat();
      } else {
        setFieldPhase('memory-collection');
        setAgentMemory(initialAgentMemory);
        setTimeout(() => { chat.resetAndStartScenario('field-memory-collection'); }, 50);
      }
    }, 50);
  }, [mode, chat, speech]);

  const handleOpenApp = useCallback((appId: string) => {
    setExecutionPanel(prev => ({
      ...prev, currentApp: appId as ExecutionPanelState['currentApp'],
      notification: appId.startsWith('wechat') ? null : prev.notification,
    }));
  }, []);

  if (showOverview) {
    return <OverviewPage onStart={handleStartDemo} narrate={autoSpeak ? speech.narrate : () => {}} />;
  }

  // Shared chat phone renderer
  const renderChatPhone = () => (
    <>
      {transition ? (
        <div className="scene-transition">
          <div className="scene-transition-icon">{transition.icon}</div>
          <div className="scene-transition-label">{transition.label}</div>
        </div>
      ) : (
        <>
          <Header isSpeaking={speech.isSpeaking} onStopSpeaking={speech.stopSpeaking} autoSpeak={autoSpeak}
            onToggleAutoSpeak={() => { setAutoSpeak((v) => { if (v) speech.stopSpeaking(); return !v; }); }} />
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto pt-4 pb-28" style={{ WebkitOverflowScrolling: 'touch' }}>
            {chat.messages.map((msg) => (<MessageBubble key={msg.id} message={msg} onSpeak={handleSpeak} />))}
            {chat.isTyping && <TypingIndicator />}
            {chat.quickReplies.length > 0 && !chat.isTyping && (<QuickReplies replies={chat.quickReplies} onSelect={handleQuickReply} />)}
            <div ref={messagesEndRef} />
          </div>
          <InputBar onSend={chat.handleUserMessage} onVoiceStart={speech.startListening} onVoiceStop={speech.stopListening}
            isListening={speech.isListening} transcript={speech.transcript} disabled={chat.isTyping} />
        </>
      )}
    </>
  );

  // Execution panel renderer
  const renderExecutionPanel = () => {
    const ep = executionPanel;
    if (ep.currentApp === 'wechat-chat' || ep.currentApp === 'wechat-moments') {
      return (
        <WeChatSimulator
          currentView={ep.currentApp === 'wechat-chat' ? 'chat' : 'moments'}
          chatMessages={ep.wechatState.chatMessages} moments={ep.wechatState.moments}
          screenshotHelper={ep.wechatState.screenshotHelper}
          onSwitchView={(v) => { setExecutionPanel(prev => ({ ...prev, currentApp: v === 'chat' ? 'wechat-chat' : 'wechat-moments', wechatState: { ...prev.wechatState, currentView: v } })); }}
        />
      );
    }
    if (ep.currentApp === 'calendar') {
      return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
          <div className="wechat-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <button style={{ fontSize: 16, color: '#000', opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleOpenApp('home')}>‹</button>
              <div style={{ fontSize: 15, fontWeight: 600 }}>日历</div>
              <span style={{ width: 16 }} />
            </div>
          </div>
          <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
            {ep.calendarEvents.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', marginTop: 40, fontSize: 13 }}>暂无日程</div>
            ) : ep.calendarEvents.map((evt, i) => (
              <div key={i} style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: 12, marginBottom: 8, borderLeft: `3px solid ${evt.color || '#3B82F6'}` }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{evt.title}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{evt.date} {evt.time}</div>
                {evt.location && <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>📍 {evt.location}</div>}
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (ep.currentApp === 'recorder') {
      return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1a1a2e', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <button style={{ position: 'absolute', top: 16, left: 16, fontSize: 14, color: '#fff', opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleOpenApp('home')}>‹ 返回</button>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: ep.isRecording ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 48 }}>🎙️</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 300, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
            {Math.floor(ep.recordingDuration / 60).toString().padStart(2, '0')}:{(ep.recordingDuration % 60).toString().padStart(2, '0')}
          </div>
          <div style={{ fontSize: 13, color: ep.isRecording ? '#EF4444' : '#94A3B8', marginTop: 8 }}>
            {ep.isRecording ? '● 录音中' : '录音已停止'}
          </div>
        </div>
      );
    }
    // Default: home screen
    return (
      <PhoneHomeScreen notification={ep.notification} calendarEvents={ep.calendarEvents}
        isRecording={ep.isRecording} recordingDuration={ep.recordingDuration}
        onOpenApp={handleOpenApp}
        onDismissNotification={() => { handleOpenApp('wechat-chat'); setExecutionPanel(prev => ({ ...prev, notification: null })); }} />
    );
  };

  // Followup popup (shared)
  const renderFollowupPopup = () => followUpReminder && (
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
        {followUpReminder.summary && <div className="followup-popup-summary">{followUpReminder.summary}</div>}
        <button className="followup-popup-confirm" onClick={() => setFollowUpReminder(null)}>知道了</button>
      </div>
    </div>
  );

  // ========== FIELD MODE ==========
  if (mode === 'field') {
    const centerContent = fieldPhase === 'ceremony'
      ? <CeremonyTransition onComplete={handleCeremonyComplete} />
      : renderChatPhone();

    return (
      <div className="h-full flex items-center justify-center py-5 noise-overlay" style={{ background: 'linear-gradient(180deg, #EBF5FF 0%, #E0F2FE 50%, #DBEAFE 100%)' }}>
        <div className="field-layout">
          {collapseLeft ? (
            <div className="field-col-collapsed">
              <button className="field-col-expand-btn" onClick={() => setCollapseLeft(false)} title="展开">▶</button>
            </div>
          ) : (
            <div className="field-col">
              <div className="field-col-header">
                <div className="field-col-header-title">代理人记忆</div>
                <div className="field-col-header-subtitle">Agent Memory</div>
                <button className="field-col-collapse-btn" onClick={() => setCollapseLeft(true)} title="折叠">◀</button>
              </div>
              <AgentMemoryPanel memory={agentMemory} onModeToggle={handleModeToggle} mode={mode} />
            </div>
          )}
          <div className="field-col">
            <div className="field-col-header">
              <div className="field-col-header-title">AI 助理对话</div>
              <div className="field-col-header-subtitle">Dialog Control</div>
            </div>
            <div className="phone-frame">
              <div className="phone-notch" />
              <div className="phone-screen">{centerContent}</div>
            </div>
          </div>
          {collapseRight ? (
            <div className="field-col-collapsed">
              <button className="field-col-expand-btn" onClick={() => setCollapseRight(false)} title="展开">◀</button>
            </div>
          ) : (
            <div className="field-col">
              <div className="field-col-header">
                <div className="field-col-header-title">应用视窗</div>
                <div className="field-col-header-subtitle">Execution Panel</div>
                <button className="field-col-collapse-btn" onClick={() => setCollapseRight(true)} title="折叠">▶</button>
              </div>
              <div className="phone-frame">
                <div className="phone-notch" />
                <div className="phone-screen" style={{
                  background: executionPanel.currentApp === 'recorder' ? '#1a1a2e'
                    : executionPanel.currentApp === 'home' ? 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
                    : '#EDEDED'
                }}>
                  {renderExecutionPanel()}
                </div>
              </div>
            </div>
          )}
        </div>
        {renderFollowupPopup()}
      </div>
    );
  }

  // ========== BACKOFFICE MODE (unchanged) ==========
  return (
    <div className="h-full flex items-center justify-center py-5 noise-overlay" style={{ background: 'linear-gradient(180deg, #EBF5FF 0%, #E0F2FE 50%, #DBEAFE 100%)' }}>
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
            <button key={mod.id} className={`sidebar-item ${activeModule === mod.id ? 'sidebar-item-active' : ''}`} onClick={() => handleModuleClick(mod.id)}>
              <span className="sidebar-icon" style={{ background: activeModule === mod.id ? mod.color : undefined }}>{mod.icon}</span>
              <div className="sidebar-item-text">
                <span className="sidebar-item-name">{mod.name}</span>
                <span className="sidebar-item-timing">{mod.timing}</span>
              </div>
              {activeModule === mod.id && <span className="sidebar-active-dot" style={{ background: mod.color }} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer"><p>智能辅导系统</p><p>点击场景开始演示</p></div>
        <button className="mode-toggle-tab" onClick={handleModeToggle} title="切换到外勤场景">外勤</button>
      </div>
      <div className="phone-frame"><div className="phone-notch" /><div className="phone-screen">{renderChatPhone()}</div></div>
      {renderFollowupPopup()}
    </div>
  );
}

export default App;
