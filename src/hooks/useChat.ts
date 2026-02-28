import { useState, useCallback, useRef } from 'react';
import type { Message, ChatState, QuickReply } from '../types';
import { scenarios } from '../data/scenarios';

let messageIdCounter = 0;
function generateId() {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

export function useChat() {
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

  const registerSpeak = useCallback(
    (fn: (text: string) => void, enqueueFn: (text: string) => void) => {
      speakFnRef.current = fn;
      enqueueSpeakFnRef.current = enqueueFn;
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
      const scenario = scenarios.find((s) => s.id === scenarioId);
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

      let totalDelay = 300;
      const messageCallbacks: Array<{ delay: number; msg: typeof step.aiMessages[0] }> = [];

      step.aiMessages.forEach((msg) => {
        const msgDelay = totalDelay;
        messageCallbacks.push({ delay: msgDelay, msg });
        totalDelay += (msg.delay ?? 200) + 300;
      });

      messageCallbacks.forEach(({ delay, msg }, index) => {
        const t = window.setTimeout(() => {
          if (sessionRef.current !== currentSession) return;
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

          // Enqueue speech per message (no cancel) so each component's
          // voice plays exactly when that component appears on screen.
          if (msg.speechText && enqueueSpeakFnRef.current) {
            enqueueSpeakFnRef.current(msg.speechText);
          }

          if (index === messageCallbacks.length - 1 && step.quickReplies) {
            const qrTimeout = window.setTimeout(() => {
              if (sessionRef.current !== currentSession) return;
              setQuickReplies(step.quickReplies || []);
            }, step.quickReplyDelay ?? 150);
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
      // Add user message
      addMessage({ role: 'user', type: 'text', content: reply.label });
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
            scenarios.map((s) => ({
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
        const scenario = scenarios.find((s) => s.id === currentScenario);
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
                content: '小张，还有什么我可以帮您的吗？请选择以下场景：',
                speechText: '小张，还需要什么帮助吗？请选择场景。',
              });
              setState((prev) => ({
                ...prev,
                currentScenario: null,
                currentStep: 0,
              }));
              setQuickReplies(
                scenarios.map((s) => ({
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
      if (state.currentScenario) {
        const scenario = scenarios.find((s) => s.id === state.currentScenario);
        if (scenario) {
          const nextStep = state.currentStep + 1;
          if (nextStep < scenario.steps.length) {
            playScenarioStep(state.currentScenario, nextStep);
            return;
          }
        }
      }

      // Not in a scenario – check if user text explicitly names one.
      // Only match when the user's text contains the full scenario name or
      // description; drop the reverse check (s.name.includes(text)) which
      // was too broad and caused short words to hijack the active scenario.
      const matchedScenario = scenarios.find(
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
            '小张，请选择以下场景，我来为您服务：',
          speechText: '小张，请选择场景，我来帮您。',
        });
        setTyping(false);
        setQuickReplies(
          scenarios.map((s) => ({
            label: `${s.icon} ${s.name}`,
            value: s.id,
          }))
        );
      }, 800);
      timeoutRefs.current.push(t);
    },
    [state, addMessage, setQuickReplies, setTyping, startScenario, playScenarioStep]
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

  const initChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
      quickReplies: scenarios.map((s) => ({
        label: `${s.icon} ${s.name}`,
        value: s.id,
      })),
    }));
  }, []);

  return {
    ...state,
    addMessage,
    handleQuickReply,
    handleUserMessage,
    startScenario,
    resetAndStartScenario,
    initChat,
    registerSpeak,
  };
}
