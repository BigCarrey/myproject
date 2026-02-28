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

const SCENE_NUMS = ['一', '二', '三', '四', '五'];

const modulesMeta = [
  {
    id: 'monthly-review',
    name: '每月初，盘点客户',
    timing: '每月初',
    icon: '📋',
    color: '#4F6BF6',
    narration: '场景一，每月初，AI自动盘点客户，推荐经营名单并提醒生日与生存金。',
  },
  {
    id: 'weekly-plan',
    name: '每周初，经营计划',
    timing: '每周初',
    icon: '📅',
    color: '#6366F1',
    narration: '场景二，每周初，AI推送分层经营计划与行事历。',
  },
  {
    id: 'daily-engagement',
    name: '每天，当日经营',
    timing: '每天',
    icon: '📲',
    color: '#818CF8',
    narration: '场景三，每天，AI推送当日经营提醒，支持一键问候与转发资讯。',
  },
  {
    id: 'weekly-summary',
    name: '每周末，周工作总结',
    timing: '每周末',
    icon: '📊',
    color: '#0EA5E9',
    narration: '场景四，每周末，AI生成周报，标出薄弱环节与需加强经营的客户。',
  },
  {
    id: 'monthly-retrospective',
    name: '每月末，月度复盘',
    timing: '每月末',
    icon: '📈',
    color: '#10B981',
    narration: '场景五，每月末，AI生成月度复盘报告，标出亮点与需提升技能。',
  },
];

function App() {
  const chat = useChat();
  const speech = useSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
   const lastTranscriptRef = useRef<string>('');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showOverview, setShowOverview] = useState(true);
  const [transition, setTransition] = useState<{ icon: string; label: string } | null>(null);

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

  // Handle voice transcript submission（防止同一段识别结果重复发送）
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
      const idx = modulesMeta.findIndex((m) => m.id === moduleId);
      const mod = modulesMeta[idx];
      if (!mod) return;

      setActiveModule(moduleId);
      const label = `场景${SCENE_NUMS[idx]}：${mod.name}`;

      if (autoSpeak && mod.narration) {
        setTransition({ icon: mod.icon, label });
        speech.narrate(mod.narration, () => {
          setTransition(null);
          chat.resetAndStartScenario(moduleId);
        });
      } else {
        chat.resetAndStartScenario(moduleId);
      }
    },
    [chat, speech, autoSpeak]
  );

  const handleStartDemo = useCallback(() => {
    setShowOverview(false);
    startModuleWithNarration(modulesMeta[0].id);
  }, [startModuleWithNarration]);

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
            <p className="sidebar-subtitle">绩优代理人客户经营引导</p>
          </div>
        </div>

        <div className="sidebar-label">业务场景模块</div>

        <nav className="sidebar-nav">
          {modulesMeta.map((mod) => (
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
          <p>Demo 演示模式</p>
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
