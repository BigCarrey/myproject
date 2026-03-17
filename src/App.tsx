import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MessageBubble } from './components/MessageBubble';
import { InputBar } from './components/InputBar';
import { QuickReplies } from './components/QuickReplies';
import { TypingIndicator } from './components/TypingIndicator';
import { WeChatSimulator } from './components/WeChatSimulator';
import { WelcomePage } from './components/WelcomePage';
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
    narration: '陈先生主动发来资产配置咨询，AI助手实时分析客户意图，并帮您生成专属活动邀请函。',
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
  const [showWelcome, setShowWelcome] = useState(true);

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
    contactName: undefined,
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

    if (!showWelcome && !startedRef.current) {
      startedRef.current = true;
      const step = DEMO_STEPS[0];
      // Start scenario immediately — no blank screen wait
      chat.resetAndStartScenario(step.id);
      // Narration plays in parallel
      if (autoSpeak && step.narration) {
        speech.narrate(step.narration, () => {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showWelcome]);

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

  const wechatSendTimersRef = useRef<number[]>([]);
  const fromMonthlyPlanRef = useRef(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const { contactName, script } = (e as CustomEvent).detail as { contactName: string; script: string };

      // Clear any pending timers from a previous send
      wechatSendTimersRef.current.forEach(clearTimeout);
      wechatSendTimersRef.current = [];

      const now = new Date();
      const sentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // 1. Immediately: switch to WeChat, show the sent message
      fromMonthlyPlanRef.current = true;
      setWeChatState(prev => ({
        ...prev,
        currentView: 'chat',
        contactName,
        chatMessages: [{
          sender: 'self',
          content: script,
          timestamp: sentTime,
        }],
        smartKeyboard: null,
        showFloatBtn: true,
      }));
      setPhoneView('wechat');

      // 2. After 1.5 s: add the contact's reply
      const t1 = window.setTimeout(() => {
        const replyMin = (now.getMinutes() + 3) % 60;
        const replyTime = `${now.getHours().toString().padStart(2, '0')}:${replyMin.toString().padStart(2, '0')}`;
        setWeChatState(prev => ({
          ...prev,
          chatMessages: [...prev.chatMessages, {
            sender: 'contact',
            senderName: contactName,
            content: '好的，正好最近也在想这些，你什么时候方便详细聊聊？',
            timestamp: replyTime,
          }],
        }));
      }, 1500);

      // 3. After 2.8 s: show AI smart keyboard panel (keyboard state first)
      const t2 = window.setTimeout(() => {
        setWeChatState(prev => ({
          ...prev,
          smartKeyboard: {
            analysis: '客户主动咨询，意向明确，适合趁热打铁推进面谈',
            recommendedScript: `${contactName}，我这周四下午或周六上午都有时间，您看哪个方便？另外我们本月有个财富管理讲座，专家阵容很强，也可以一起参加！`,
          },
        }));
      }, 2800);

      wechatSendTimersRef.current = [t1, t2];
    };

    window.addEventListener('monthly-plan-send-wechat', handler);
    return () => window.removeEventListener('monthly-plan-send-wechat', handler);
  }, []);

  const advanceToNextStep = useCallback(
    (nextIndex: number) => {
      if (nextIndex >= DEMO_STEPS.length) return;
      const step = DEMO_STEPS[nextIndex];
      setActiveStepIndex(nextIndex);
      setPhoneView('assistant');

      // Start scenario immediately — no blank screen wait
      chat.resetAndStartScenario(step.id);
      // Narration plays in parallel
      if (autoSpeak && step.narration) {
        speech.narrate(step.narration, () => {});
      }
    },
    [autoSpeak, speech, chat]
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
    const wasMonthlyPlanFlow = fromMonthlyPlanRef.current;
    fromMonthlyPlanRef.current = false;
    setPhoneView('assistant');
    setWeChatState(prev => ({ ...prev, showFloatBtn: false, smartKeyboard: null, contactName: undefined }));

    if (wasMonthlyPlanFlow) {
      setActiveStepIndex(1);
      chat.resetAndStartScenario('field-customer-engagement', 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = useCallback(() => {
    setShowWelcome(false);
  }, []);

  return (
    <div
      className="demo-root noise-overlay"
      style={{ background: 'linear-gradient(180deg, #EBF5FF 0%, #E0F2FE 50%, #DBEAFE 100%)' }}
    >
      {/* Brand bar */}
      {!showWelcome && (
        <div className="demo-brand">
          <span className="demo-brand-name">万能营销</span>
          <span className="demo-brand-pro">PRO</span>
          <div style={{ flex: 1 }} />
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
      )}

      {/* Step indicator */}
      {!showWelcome && <StepIndicator current={activeStepIndex} />}

      {/* Phone frame */}
      <div className="demo-phone-frame">
        <div className="phone-notch" />
        {showWelcome ? (
          <WelcomePage onStart={handleStart} />
        ) : (
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
              contactName={wechatState.contactName}
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
                // Delay advancing the scenario so user sees the sent bubble first
                window.setTimeout(() => {
                  chat.handleQuickReply({ label: '发送话术', value: 'send-script' });
                }, 2000);
              }}
            />
          </div>
        </div>
        )}
      </div>
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
