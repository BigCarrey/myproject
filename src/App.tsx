import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MessageBubble } from './components/MessageBubble';
import { InputBar } from './components/InputBar';
import { QuickReplies } from './components/QuickReplies';
import { TypingIndicator } from './components/TypingIndicator';
import { WeChatSimulator } from './components/WeChatSimulator';
import { useChat } from './hooks/useChat';
import { useSpeech } from './hooks/useSpeech';
import { fieldScenarios } from './data/fieldScenarios';
import type { WeChatState, WeChatEvent, WeChatChatMessage, WeChatMoment, FollowUpReminder, SmartKeyboardData } from './types';

// 3 sequential demo steps matching the document script
const DEMO_STEPS = [
  {
    id: 'field-customer-planning',
    label: '圈客',
    sublabel: '盘点客户',
    icon: '🗂️',
    color: '#1D4ED8',
    narration: '司庆季开始了！AI万能营销助手已为您智能盘点本月重点客户，推荐20位优质目标，转化率接近10%。',
  },
  {
    id: 'field-customer-engagement',
    label: '触客',
    sublabel: '微信互动',
    icon: '📲',
    color: '#059669',
    narration: '在我与客户微信沟通时，助手根据热门话题为代理人定制生产符合自身风格的触客内容，并根据对话内容实时提供开口话术，提示我如何回复陈先生的问题，很快我与客户轻松地互动起来。',
  },
  {
    id: 'field-chen-solution',
    label: '访/邀+转',
    sublabel: '产品方案',
    icon: '🏆',
    color: '#7C3AED',
    narration: '现在为陈先生定制司庆季专属保险方案，平安盛盈·居家养老，一键生成销售逻辑话术，促成本次潜在收入16880元。',
  },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="step-indicator">
      {DEMO_STEPS.map((step, i) => (
        <div key={step.id} className="step-indicator-item">
          <div
            className={`step-dot ${i === current ? 'active' : i < current ? 'done' : ''}`}
            style={
              i === current
                ? { background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)`, boxShadow: `0 0 14px ${step.color}70` }
                : i < current
                ? { background: step.color + 'a0' }
                : {}
            }
          >
            {i < current ? '✓' : step.icon}
          </div>
          <div className={`step-label-block ${i === current ? 'active' : ''}`}>
            <span className="step-label-main">{step.label}</span>
            <span className="step-label-sub">{step.sublabel}</span>
          </div>
          {i < DEMO_STEPS.length - 1 && (
            <div className={`step-connector ${i < current ? 'done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function App() {
  const currentScenarios = useMemo(() => fieldScenarios, []);
  const chat = useChat(currentScenarios);
  const speech = useSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastTranscriptRef = useRef<string>('');
  const startedRef = useRef(false);

  const [autoSpeak, setAutoSpeak] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [phoneView, setPhoneView] = useState<'assistant' | 'wechat'>('assistant');

  const [wechatState, setWeChatState] = useState<WeChatState>({
    currentView: 'chat',
    chatMessages: [],
    moments: [],
    screenshotHelper: null,
    smartKeyboard: null,    // NEW
    showFloatBtn: false,    // NEW
  });
  const [followUpReminder, setFollowUpReminder] = useState<FollowUpReminder | null>(null);

  const handleWeChatEvents = useCallback((events: WeChatEvent[]) => {
    events.forEach((evt) => {
      if (evt.type === 'show-followup-reminder') {
        setFollowUpReminder(evt.data as FollowUpReminder);
        setPhoneView('assistant');
        return;
      }
      if (evt.type === 'switch-to-assistant') {
        setPhoneView('assistant');
        setWeChatState(prev => ({ ...prev, smartKeyboard: null, showFloatBtn: false }));
        return;
      }
      if (evt.type === 'show-smart-keyboard') {
        setWeChatState(prev => ({
          ...prev,
          smartKeyboard: evt.data as SmartKeyboardData,
          screenshotHelper: null,  // clear old helper if any
        }));
        setPhoneView('wechat');
        return;
      }
      if (evt.type === 'show-float-btn') {
        setWeChatState(prev => ({ ...prev, showFloatBtn: true }));
        return;
      }
      if (evt.type === 'hide-float-btn') {
        setWeChatState(prev => ({ ...prev, showFloatBtn: false }));
        return;
      }
      // Switch to WeChat view when there are chat/moment events
      if (
        evt.type === 'switch-view' ||
        evt.type === 'set-chat-messages' ||
        evt.type === 'add-chat' ||
        evt.type === 'add-moment' ||
        evt.type === 'set-moments'
      ) {
        setPhoneView('wechat');
      }
      setWeChatState((prev) => {
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
    chat.registerSpeak(
      autoSpeak ? speech.speak : () => {},
      autoSpeak ? speech.enqueueSpeak : () => {}
    );
    chat.registerWeChatEvent(handleWeChatEvents);

    if (!startedRef.current) {
      startedRef.current = true;
      const step = DEMO_STEPS[0];
      if (autoSpeak && step.narration) {
        let scenarioStarted = false;
        const startScenario = () => {
          if (!scenarioStarted) {
            scenarioStarted = true;
            chat.resetAndStartScenario(step.id);
          }
        };
        speech.narrate(step.narration, startScenario);
        // Fallback: if speech is blocked or hangs, start after 2.5s
        setTimeout(startScenario, 2500);
      } else {
        chat.resetAndStartScenario(step.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chat.registerSpeak(
      autoSpeak ? speech.speak : () => {},
      autoSpeak ? speech.enqueueSpeak : () => {}
    );
  }, [autoSpeak, speech.speak, speech.enqueueSpeak, chat.registerSpeak]);

  useEffect(() => {
    chat.registerWeChatEvent(handleWeChatEvents);
  }, [chat.registerWeChatEvent, handleWeChatEvents]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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

  const advanceToNextStep = useCallback(
    (nextIndex: number) => {
      if (nextIndex >= DEMO_STEPS.length) return;
      const step = DEMO_STEPS[nextIndex];
      setActiveStepIndex(nextIndex);

      if (nextIndex === 1) {
        // 触客场景：旁白期间展示微信实时开口话术画面
        handleWeChatEvents([
          { type: 'switch-view', data: 'chat' },
          { type: 'add-chat', data: { sender: 'xiaoli', content: '陈先生，司庆季开始了！想起您之前提过在考虑资产配置的问题，正好我们近期有几款特别适合您情况的产品，有时间聊聊吗？', timestamp: '10:15' } },
          { type: 'add-chat', data: { sender: 'chensheng', senderName: '陈先生', content: '好的，正好最近也在想这些，你什么时候方便详细聊聊？', timestamp: '10:18' } },
        ]);
        setPhoneView('wechat');

        const launchScenario = () => {
          // 0.5s额外延迟，避免旁白与下一段衔接太紧凑
          setTimeout(() => {
            // 触客场景：发送后直接停留在微信页面
            chat.resetAndStartScenario(step.id);
          }, 500);
        };

        if (autoSpeak && step.narration) {
          let done = false;
          const startScenario = () => { if (!done) { done = true; launchScenario(); } };
          speech.narrate(step.narration, startScenario);
          setTimeout(startScenario, 3000); // fallback
        } else {
          launchScenario();
        }
        return;
      }

      setPhoneView('assistant');
      if (autoSpeak && step.narration) {
        let scenarioStarted = false;
        const startScenario = () => {
          if (!scenarioStarted) {
            scenarioStarted = true;
            chat.resetAndStartScenario(step.id);
          }
        };
        speech.narrate(step.narration, startScenario);
        setTimeout(startScenario, 2500);
      } else {
        chat.resetAndStartScenario(step.id);
      }
    },
    [autoSpeak, speech, chat, handleWeChatEvents]
  );

  const handleQuickReply = useCallback(
    (reply: { label: string; value: string }) => {
      if (reply.value === 'back-to-menu') {
        chat.addMessage({ role: 'user', type: 'text', content: reply.label });
        const nextIndex = activeStepIndex + 1;
        setTimeout(() => advanceToNextStep(nextIndex), 500);
        return;
      }
      chat.handleQuickReply(reply);
    },
    [chat, activeStepIndex, advanceToNextStep]
  );

  const handleSpeak = useCallback(
    (text: string) => {
      if (speech.isSpeaking) speech.stopSpeaking();
      else speech.speak(text);
    },
    [speech]
  );

  const handleReturnToAssistant = useCallback(() => {
    setPhoneView('assistant');
    setWeChatState(prev => ({ ...prev, showFloatBtn: false, smartKeyboard: null }));
  }, []);

  return (
    <div
      className="demo-root noise-overlay"
      style={{ background: 'linear-gradient(180deg, #EBF5FF 0%, #E0F2FE 50%, #DBEAFE 100%)' }}
    >
      {/* Brand bar */}
      <div className="demo-brand">
        <span className="demo-brand-name">万能营销</span>
        <span className="demo-brand-pro">PRO</span>
        <div style={{ flex: 1 }} />
        {/* Auto-speak toggle */}
        <button
          className="demo-speak-toggle"
          onClick={() => {
            setAutoSpeak((v) => {
              if (v) speech.stopSpeaking();
              return !v;
            });
          }}
          title={autoSpeak ? '关闭语音' : '开启语音'}
        >
          {speech.isSpeaking ? '⏸ 停止' : autoSpeak ? '🔊 语音开' : '🔇 语音关'}
        </button>
      </div>

      {/* Step indicator */}
      <StepIndicator current={activeStepIndex} />

      {/* Single phone — slides between AI and WeChat */}
      <div className="demo-phone-frame">
        <div className="phone-notch" />
        <div
          className="phone-slide-track"
          style={{ transform: phoneView === 'wechat' ? 'translateX(-50%)' : 'translateX(0)' }}
        >
          {/* Left panel: AI assistant */}
          <div className="phone-panel">
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
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onSpeak={handleSpeak}
                  onAction={() => chat.handleQuickReply({ label: '一键发送', value: 'send-content' })}
                />
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
          </div>

          {/* Right panel: WeChat */}
          <div className="phone-panel" style={{ background: '#EDEDED' }}>
            <WeChatSimulator
              currentView={wechatState.currentView}
              chatMessages={wechatState.chatMessages}
              moments={wechatState.moments}
              screenshotHelper={wechatState.screenshotHelper}
              smartKeyboard={wechatState.smartKeyboard}
              showFloatBtn={wechatState.showFloatBtn}
              onReturnToAssistant={handleReturnToAssistant}
              onSwitchView={(v) => setWeChatState((prev) => ({ ...prev, currentView: v }))}
              onSendReply={(text) => {
                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                setWeChatState(prev => ({
                  ...prev,
                  chatMessages: [...prev.chatMessages, {
                    sender: 'xiaoli',
                    content: text,
                    timestamp: timeStr,
                  }],
                  smartKeyboard: null,  // close smart keyboard after sending
                }));
                // Advance scenario - treat as quick reply
                chat.handleQuickReply({ label: text, value: 'send-script' });
              }}
            />
            {/* Quick reply overlay in WeChat panel — so demo can advance even when WeChat is visible */}
            {chat.quickReplies.length > 0 && !chat.isTyping && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 52, // above WeChat tab bar
                  left: 0,
                  right: 0,
                  zIndex: 55,
                  padding: '6px 10px 8px',
                  background: 'linear-gradient(to top, rgba(237,237,237,0.98) 60%, transparent)',
                  pointerEvents: 'auto',
                }}
              >
                <QuickReplies replies={chat.quickReplies} onSelect={handleQuickReply} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Follow-up reminder popup */}
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
            <button className="followup-popup-confirm" onClick={() => setFollowUpReminder(null)}>知道了</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
