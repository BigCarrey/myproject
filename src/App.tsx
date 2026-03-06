import { useEffect, useRef, useCallback, useState } from 'react';
import { Header } from './components/Header';
import { MessageBubble } from './components/MessageBubble';
import { InputBar } from './components/InputBar';
import { QuickReplies } from './components/QuickReplies';
import { TypingIndicator } from './components/TypingIndicator';
import { OverviewPage } from './components/OverviewPage';
import { useChat } from './hooks/useChat';
import { useSpeech } from './hooks/useSpeech';
import { scenarios } from './data/scenarios';

const SCENE_NUMS = ['一', '二', '三', '四', '五', '六', '七'];

interface ModuleMeta {
  id: string;
  scenarioId: string;
  name: string;
  timing: string;
  icon: string;
  color: string;
  narration: string;
}

const modulesMeta: ModuleMeta[] = [
  {
    id: 'monthly-review',
    scenarioId: 'monthly-review',
    name: '每月初，提醒代理人盘点客户',
    timing: '每月初',
    icon: '📋',
    color: '#4F6BF6',
    narration: '场景一，每月初，AI主动提醒代理人盘点客户并生成经营计划。',
  },
  {
    id: 'weekly-plan',
    scenarioId: 'weekly-plan',
    name: '每周初，提醒本周经营计划',
    timing: '每周初',
    icon: '📅',
    color: '#6366F1',
    narration: '场景二，每周初，AI推送本周拜访计划与客户跟进策略。',
  },
  {
    id: 'pre-visit',
    scenarioId: 'pre-visit',
    name: '某天，客户拜访前',
    timing: '拜访前',
    icon: '💼',
    color: '#818CF8',
    narration: '场景三，拜访前，AI自动生成保障检视与专属产品方案。',
  },
  {
    id: 'post-visit',
    scenarioId: 'post-visit',
    name: '某天，客户拜访后',
    timing: '拜访后',
    icon: '📝',
    color: '#7C3AED',
    narration: '场景四，拜访后，AI语音记录拜访并生成总结与跟进计划。',
  },
  {
    id: 'team-coaching',
    scenarioId: 'team-coaching',
    name: '某天晚上：辅导下属',
    timing: '晚上',
    icon: '👥',
    color: '#A78BFA',
    narration: '场景五，当天晚上，AI辅助主管精准辅导下属。',
  },
  {
    id: 'weekly-summary',
    scenarioId: 'weekly-summary',
    name: '每周末，形成周工作总结',
    timing: '周末',
    icon: '📊',
    color: '#0EA5E9',
    narration: '场景六，每周末，AI自动生成本周工作周报。',
  },
  {
    id: 'monthly-retrospective',
    scenarioId: 'monthly-retrospective',
    name: '每月末，形成月度工作复盘',
    timing: '月末',
    icon: '📈',
    color: '#10B981',
    narration: '场景七，每月末，AI生成月度复盘报告，闭环全月经营。',
  },
];

const modulesMetaV2: ModuleMeta[] = [
  {
    id: 'v2-target-customers',
    scenarioId: 'monthly-review',
    name: '目标客群推荐',
    timing: '客群筛选',
    icon: '🎯',
    color: '#4F6BF6',
    narration: '模块一，目标客群推荐，AI智能筛选高潜力客户并推荐经营优先级。',
  },
  {
    id: 'v2-plan-schedule',
    scenarioId: 'weekly-plan',
    name: '经营计划排程',
    timing: '计划排程',
    icon: '📅',
    color: '#6366F1',
    narration: '模块二，经营计划排程，AI自动生成本周拜访计划与时间安排。',
  },
  {
    id: 'v2-visit-materials',
    scenarioId: 'pre-visit',
    name: '触访素材匹配',
    timing: '素材匹配',
    icon: '📂',
    color: '#818CF8',
    narration: '模块三，触访素材匹配，AI根据客户画像自动匹配产品方案与沟通策略。',
  },
  {
    id: 'v2-action-reminder',
    scenarioId: 'post-visit',
    name: '经营动作提醒',
    timing: '动作提醒',
    icon: '🔔',
    color: '#7C3AED',
    narration: '模块四，经营动作提醒，AI记录拜访情况并提醒跟进动作。',
  },
  {
    id: 'v2-visit-review',
    scenarioId: 'weekly-summary',
    name: '拜访复盘分析',
    timing: '复盘分析',
    icon: '📊',
    color: '#0EA5E9',
    narration: '模块五，拜访复盘分析，AI自动分析本周拜访数据与薄弱环节。',
  },
  {
    id: 'v2-archive-summary',
    scenarioId: 'monthly-retrospective',
    name: '经营档案总结',
    timing: '档案总结',
    icon: '📈',
    color: '#10B981',
    narration: '模块六，经营档案总结，AI生成月度经营档案与提升计划。',
  },
];

function App() {
  const chat = useChat();
  const speech = useSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showOverview, setShowOverview] = useState(true);
  const [transition, setTransition] = useState<{ icon: string; label: string } | null>(null);
  const [demoMode, setDemoMode] = useState<'v1' | 'v2'>('v1');

  const currentModules = demoMode === 'v1' ? modulesMeta : modulesMetaV2;

  useEffect(() => {
    chat.initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Register speak callbacks so useChat triggers speech synchronously with messages
  useEffect(() => {
    const noop = () => {};
    chat.registerSpeak(
      autoSpeak ? speech.speak : noop,
      autoSpeak ? speech.enqueueSpeak : noop
    );
  }, [autoSpeak, speech.speak, speech.enqueueSpeak, chat.registerSpeak]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat.messages, chat.isTyping, chat.quickReplies]);

  // Handle voice transcript submission
  useEffect(() => {
    if (speech.transcript && !speech.isListening) {
      const text = speech.transcript.trim();
      if (text) {
        chat.handleUserMessage(text);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.isListening]);

  const startModuleWithNarration = useCallback(
    (moduleId: string) => {
      const idx = currentModules.findIndex((m) => m.id === moduleId);
      const mod = currentModules[idx];
      if (!mod) return;

      setActiveModule(moduleId);
      const prefix = demoMode === 'v1' ? '场景' : '模块';
      const label = `${prefix}${SCENE_NUMS[idx]}：${mod.name}`;

      if (autoSpeak && mod.narration) {
        setTransition({ icon: mod.icon, label });
        speech.narrate(mod.narration, () => {
          setTransition(null);
          chat.resetAndStartScenario(mod.scenarioId);
        });
      } else {
        chat.resetAndStartScenario(mod.scenarioId);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chat, speech, autoSpeak, currentModules, demoMode]
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
      const scenario = scenarios.find((s) => s.id === reply.value);
      if (scenario) {
        chat.addMessage({ role: 'user', type: 'text', content: reply.label });
        chat.startScenario(scenario.id);
        setActiveModule(scenario.id);
      } else {
        chat.handleQuickReply(reply);
      }
    },
    [chat]
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

  if (showOverview) {
    return (
      <OverviewPage
        onStart={handleStartDemo}
        narrate={autoSpeak ? speech.narrate : () => {}}
      />
    );
  }

  return (
    <div className="h-full flex items-center justify-center py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
      {/* Left Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">AI</div>
          <div>
            <h2 className="sidebar-title">万能营销助手</h2>
            <p className="sidebar-subtitle">智能保险销售平台</p>
          </div>
        </div>

        <div className="sidebar-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{demoMode === 'v1' ? '业务场景模块' : '客户经营智能体'}</span>
          <button
            onClick={() => {
              const next = demoMode === 'v1' ? 'v2' : 'v1';
              setDemoMode(next);
              setActiveModule(null);
              speech.stopSpeaking();
              setTransition(null);
              chat.initChat();
            }}
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              background: '#f3f4f6',
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            {demoMode === 'v1' ? '切换V2' : '切换V1'}
          </button>
        </div>

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
          <p>{demoMode === 'v1' ? 'Demo 演示模式' : '客户经营智能体演示'}</p>
          <p>点击左侧模块切换场景</p>
        </div>
      </div>

      {/* Phone Mockup - Centered */}
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
                className="flex-1 overflow-y-auto pt-4 pb-4"
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
    </div>
  );
}

export default App;
