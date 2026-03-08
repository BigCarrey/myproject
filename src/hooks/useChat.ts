import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, ChatState, QuickReply, Scenario, WeChatEvent } from '../types';

let messageIdCounter = 0;
function generateId() {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

export function useChat(activeScenarios: Scenario[]) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    currentScenario: null,
    currentStep: 0,
    quickReplies: [],
    isListening: false,
    isSpeaking: false,
  });

  const timeoutRefs = useRef<number[]>([]);
  const sessionRef = useRef(0);
  const speakFnRef = useRef<((text: string) => void) | null>(null);
  const enqueueSpeakFnRef = useRef<((text: string) => void) | null>(null);
  const scenariosRef = useRef<Scenario[]>(activeScenarios);
  const wechatEventFnRef = useRef<((events: WeChatEvent[]) => void) | null>(null);

  useEffect(() => {
    scenariosRef.current = activeScenarios;
  }, [activeScenarios]);

  const registerSpeak = useCallback(
    (fn: (text: string) => void, enqueueFn: (text: string) => void) => {
      speakFnRef.current = fn;
      enqueueSpeakFnRef.current = enqueueFn;
    },
    []
  );

  const registerWeChatEvent = useCallback(
    (fn: (events: WeChatEvent[]) => void) => {
      wechatEventFnRef.current = fn;
    },
    []
  );

  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((t) => window.clearTimeout(t));
    timeoutRefs.current = [];
  }, []);

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMsg: Message = {
      ...msg,
      id: generateId(),
      timestamp: Date.now(),
    };
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));
    if (msg.speechText && speakFnRef.current) {
      speakFnRef.current(msg.speechText);
    }
    return newMsg;
  }, []);

  const setTyping = useCallback((typing: boolean) => {
    setState((prev) => ({ ...prev, isTyping: typing }));
  }, []);

  const setQuickReplies = useCallback((replies: QuickReply[]) => {
    setState((prev) => ({ ...prev, quickReplies: replies }));
  }, []);

  const playScenarioStep = useCallback(
    (scenarioId: string, stepIndex: number) => {
      const scenario = scenariosRef.current.find((s) => s.id === scenarioId);
      if (!scenario || stepIndex >= scenario.steps.length) return;

      const step = scenario.steps[stepIndex];
      clearTimeouts();
      setQuickReplies([]);
      setTyping(true);

      // Cancel leftover speech from the previous step so it doesn't
      // overlap with this step's per-message enqueued speech.
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      const currentSession = sessionRef.current;

      let totalDelay = 600;
      const messageCallbacks: Array<{ delay: number; msg: typeof step.aiMessages[0] }> = [];

      step.aiMessages.forEach((msg) => {
        const msgDelay = totalDelay;
        messageCallbacks.push({ delay: msgDelay, msg });
        totalDelay += (msg.delay || 400) + 600;
      });

      messageCallbacks.forEach(({ delay, msg }, index) => {
        const t = window.setTimeout(() => {
          if (sessionRef.current !== currentSession) return;
          if (msg.content !== '') {
            setState((prev) => ({
              ...prev,
              isTyping: index < messageCallbacks.length - 1,
              messages: [
                ...prev.messages,
                {
                  id: generateId(),
                  role: 'ai' as const,
                  type: msg.type,
                  content: msg.content,
                  speechText: msg.speechText,
                  data: msg.data,
                  timestamp: Date.now(),
                },
              ],
            }));
          } else {
            setState((prev) => ({ ...prev, isTyping: index < messageCallbacks.length - 1 }));
          }

          // Enqueue speech per message (no cancel) so each component's
          // voice plays exactly when that component appears on screen.
          if (msg.speechText && enqueueSpeakFnRef.current) {
            enqueueSpeakFnRef.current(msg.speechText);
          }

          // Fire WeChat events if present on this message
          if (msg.wechatEvents && msg.wechatEvents.length > 0 && wechatEventFnRef.current) {
            wechatEventFnRef.current(msg.wechatEvents);
          }

          if (index === messageCallbacks.length - 1 && step.quickReplies) {
            const qrTimeout = window.setTimeout(() => {
              if (sessionRef.current !== currentSession) return;
              setQuickReplies(step.quickReplies || []);
            }, step.quickReplyDelay ?? 300);
            timeoutRefs.current.push(qrTimeout);
          }
        }, delay);
        timeoutRefs.current.push(t);
      });

      setState((prev) => ({
        ...prev,
        currentScenario: scenarioId,
        currentStep: stepIndex,
      }));
    },
    [clearTimeouts, setQuickReplies, setTyping]
  );

  const startScenario = useCallback(
    (scenarioId: string) => {
      playScenarioStep(scenarioId, 0);
    },
    [playScenarioStep]
  );

  const handleQuickReply = useCallback(
    (reply: QuickReply) => {
      // Add user message (skip if label is empty — silent trigger)
      if (reply.label) addMessage({ role: 'user', type: 'text', content: reply.label });
      setQuickReplies([]);

      if (reply.value === 'back-to-menu') {
        setState((prev) => ({
          ...prev,
          currentScenario: null,
          currentStep: 0,
        }));
        // Show welcome quick replies
        const t = window.setTimeout(() => {
          setQuickReplies(
            scenariosRef.current.map((s) => ({
              label: `${s.icon} ${s.name}`,
              value: s.id,
            }))
          );
        }, 300);
        timeoutRefs.current.push(t);
        return;
      }

      const { currentScenario, currentStep } = state;
      if (currentScenario) {
        const scenario = scenariosRef.current.find((s) => s.id === currentScenario);
        if (scenario) {
          const nextStep = currentStep + 1;
          if (nextStep < scenario.steps.length) {
            playScenarioStep(currentScenario, nextStep);
          } else {
            // Scenario complete, show menu
            const t = window.setTimeout(() => {
              addMessage({
                role: 'ai',
                type: 'text',
                content: '还有什么我可以帮您的吗？请选择以下场景：',
                speechText: '还需要什么帮助吗？请选择场景。',
              });
              setState((prev) => ({
                ...prev,
                currentScenario: null,
                currentStep: 0,
              }));
              setQuickReplies(
                scenariosRef.current.map((s) => ({
                  label: `${s.icon} ${s.name}`,
                  value: s.id,
                }))
              );
            }, 500);
            timeoutRefs.current.push(t);
          }
        }
      }
    },
    [state, addMessage, setQuickReplies, playScenarioStep]
  );

  const handleUserMessage = useCallback(
    (text: string) => {
      addMessage({ role: 'user', type: 'text', content: text });
      setQuickReplies([]);

      // If already inside a scenario, advance to the next step.
      // Do this BEFORE any scenario-matching so that words like "拜访" typed
      // during post-visit don't accidentally restart the pre-visit scenario.
      if (state.currentScenario) {
        const scenario = scenariosRef.current.find((s) => s.id === state.currentScenario);
        if (scenario) {
          const nextStep = state.currentStep + 1;
          if (nextStep < scenario.steps.length) {
            playScenarioStep(state.currentScenario, nextStep);
            return;
          }
        }
      }

      // Not in a scenario – check if user text explicitly names one.
      const matchedScenario = scenariosRef.current.find(
        (s) => text.includes(s.name) || text.includes(s.description)
      );

      if (matchedScenario) {
        startScenario(matchedScenario.id);
        return;
      }

      // Default response
      setTyping(true);
      const t = window.setTimeout(() => {
        addMessage({
          role: 'ai',
          type: 'text',
          content:
            '好的，我理解您的需求。请选择以下场景，我可以为您提供更专业的服务：',
          speechText: '好的，请选择场景，我来帮您。',
        });
        setTyping(false);
        setQuickReplies(
          scenariosRef.current.map((s) => ({
            label: `${s.icon} ${s.name}`,
            value: s.id,
          }))
        );
      }, 800);
      timeoutRefs.current.push(t);
    },
    [state, addMessage, setQuickReplies, setTyping, startScenario, playScenarioStep]
  );

  // Jump to a specific step in a scenario, clearing message history first
  const jumpToStep = useCallback(
    (scenarioId: string, stepIndex: number) => {
      clearTimeouts();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      sessionRef.current += 1;
      setState({
        messages: [],
        isTyping: false,
        currentScenario: scenarioId,
        currentStep: stepIndex - 1,
        quickReplies: [],
        isListening: false,
        isSpeaking: false,
      });
      const t = window.setTimeout(() => {
        playScenarioStep(scenarioId, stepIndex);
      }, 100);
      timeoutRefs.current.push(t);
    },
    [clearTimeouts, playScenarioStep]
  );

  const resetAndStartScenario = useCallback(
    (scenarioId: string) => {
      clearTimeouts();
      // Cancel any ongoing speech immediately so switching modules
      // doesn't cause overlapping audio during the 100ms state-reset gap.
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      sessionRef.current += 1;
      setState({
        messages: [],
        isTyping: false,
        currentScenario: null,
        currentStep: 0,
        quickReplies: [],
        isListening: false,
        isSpeaking: false,
      });
      // Use setTimeout to ensure state is reset before starting
      const t = window.setTimeout(() => {
        playScenarioStep(scenarioId, 0);
      }, 100);
      timeoutRefs.current.push(t);
    },
    [clearTimeouts, playScenarioStep]
  );

  const initChat = useCallback((welcomeContent?: string, welcomeSpeech?: string) => {
    clearTimeouts();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    sessionRef.current += 1;

    const content = welcomeContent ?? '郑晓您好！我是您的AI智能助理\n\n本月代理人业绩追踪已自动更新，以下是您管辖的代理人概览。\n\n📌 重点关注：\n• 李平安 FYC达成率持续下滑（38%）\n• 王丽华 活动量偏低需关注\n\n请选择您需要的服务：';
    const speech = welcomeSpeech ?? '郑晓您好！本月代理人业绩已更新，李平安达成率持续下滑，建议重点关注。';

    const welcomeMsg: Message = {
      id: generateId(),
      role: 'ai',
      type: 'text',
      content,
      speechText: speech,
      timestamp: Date.now(),
    };

    setState({
      messages: [welcomeMsg],
      isTyping: false,
      currentScenario: null,
      currentStep: 0,
      quickReplies: scenariosRef.current.map((s) => ({
        label: `${s.icon} ${s.name}`,
        value: s.id,
      })),
      isListening: false,
      isSpeaking: false,
    });
    if (welcomeMsg.speechText && speakFnRef.current) {
      speakFnRef.current(welcomeMsg.speechText);
    }
  }, [clearTimeouts]);

  // Field mode: start a continuous scenario directly (no menu)
  const initFieldContinuous = useCallback((scenarioId: string) => {
    clearTimeouts();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    sessionRef.current += 1;

    setState({
      messages: [],
      isTyping: false,
      currentScenario: null,
      currentStep: 0,
      quickReplies: [],
      isListening: false,
      isSpeaking: false,
    });

    const t = window.setTimeout(() => {
      playScenarioStep(scenarioId, 0);
    }, 100);
    timeoutRefs.current.push(t);
  }, [clearTimeouts, playScenarioStep]);

  const clearMessages = useCallback(() => {
    clearTimeouts();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    sessionRef.current += 1;
    setState((prev) => ({ ...prev, messages: [], isTyping: false, quickReplies: [] }));
  }, [clearTimeouts]);

  return {
    ...state,
    addMessage,
    handleQuickReply,
    handleUserMessage,
    startScenario,
    resetAndStartScenario,
    jumpToStep,
    clearMessages,
    initChat,
    initFieldContinuous,
    registerSpeak,
    registerWeChatEvent,
  };
}
