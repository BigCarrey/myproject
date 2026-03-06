import { useState, useCallback, useRef } from 'react';
import type { Message, ChatState, QuickReply, StoryLine } from '../types';
import { scenariosByStoryLine, CUSTOMER_STORY_FLOW } from '../data';

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
    storyLine: 'timeline',
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

  const storyLineRef = useRef<StoryLine>('timeline');

  const playScenarioStep = useCallback(
    (scenarioId: string, stepIndex: number) => {
      const scenarios = scenariosByStoryLine[storyLineRef.current];
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
          const isUser = msg.role === 'user';
          setState((prev) => ({
            ...prev,
            isTyping: index < messageCallbacks.length - 1,
            messages: [
              ...prev.messages,
              {
                id: generateId(),
                role: isUser ? ('user' as const) : ('ai' as const),
                type: isUser ? ('text' as const) : msg.type,
                content: msg.content,
                speechText: isUser ? undefined : msg.speechText,
                data: isUser ? undefined : msg.data,
                timestamp: Date.now(),
              },
            ],
          }));

          // Enqueue speech per message (no cancel) so each component's
          // voice plays exactly when that component appears on screen.
          if (!isUser && msg.speechText && enqueueSpeakFnRef.current) {
            enqueueSpeakFnRef.current(msg.speechText);
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
      // Add user message
      addMessage({ role: 'user', type: 'text', content: reply.label });
      setQuickReplies([]);

      if (reply.value === 'pre-visit-from-image') {
        startScenario('pre-visit');
        return;
      }

      if (reply.value === 'confirm-today') {
        addMessage({
          role: 'ai',
          type: 'text',
          content: '好的，已确认今日安排。如需查看具体场景，请选择下方模块。',
          speechText: '已确认，如需查看具体场景请选择。',
        });
        setQuickReplies(
          scenariosByStoryLine[storyLineRef.current].map((s) => ({
            label: `${s.icon} ${s.name}`,
            value: s.id,
          }))
        );
        return;
      }

      if (reply.value === 'adjust-plan') {
        startScenario('weekly-plan');
        return;
      }

      if (reply.value === 'cta-experience' || reply.value === 'cta-contact') {
        addMessage({
          role: 'ai',
          type: 'text',
          content:
            reply.value === 'cta-experience'
              ? '感谢您的关注！万能营销助手即将上线，敬请期待。'
              : '感谢您的关注！我们的团队将尽快与您联系，共同探讨合作可能。',
          speechText: '感谢您的关注，我们将尽快与您联系。',
        });
        setQuickReplies(
          scenariosByStoryLine[storyLineRef.current].map((s) => ({
            label: `${s.icon} ${s.name}`,
            value: s.id,
          }))
        );
        return;
      }

      if (reply.value === 'customer-story-end') {
        setState((prev) => ({
          ...prev,
          currentScenario: null,
          currentStep: 0,
        }));
        const closingMsg = {
          role: 'ai' as const,
          type: 'text' as const,
          content: '小李与王哥的完整经营流程已演示完毕。从人设到朋友圈、私信回复、洞察、话术、缺口诊断、方案匹配、素材发送，每一步都有AI助力。感谢体验。',
          speechText: '完整经营流程已演示完毕，感谢体验。传统代理人靠人力堆砌，AI 代理人靠智能赋能，这就是代际鸿沟。',
        };
        const t = window.setTimeout(() => {
          addMessage(closingMsg);
          setQuickReplies([
            { label: '立即体验', value: 'cta-experience' },
            { label: '联系我们', value: 'cta-contact' },
          ]);
        }, 500);
        timeoutRefs.current.push(t);
        return;
      }

      if (reply.value === 'story-next') {
        const { currentScenario } = state;
        if (storyLineRef.current === 'customer' && currentScenario) {
          const flow = CUSTOMER_STORY_FLOW as readonly string[];
          const idx = flow.indexOf(currentScenario);
          const nextId = idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
          if (nextId) {
            playScenarioStep(nextId, 0);
            return;
          }
        }
      }

      if (reply.value === 'back-to-menu') {
        // 月度复盘结束：展示收束旁白与 CTA
        if (state.currentScenario === 'monthly-retrospective') {
          setState((prev) => ({
            ...prev,
            currentScenario: null,
            currentStep: 0,
          }));
          const closingMsg = {
            role: 'ai' as const,
            type: 'text' as const,
            content:
              '从月初盘点，到每日拜访，再到周末复盘，AI贯穿全流程。\n\n传统代理人靠人力堆砌，AI代理人靠智能赋能。\n\n**这就是代际鸿沟。**',
            speechText: '从月初盘点到每日拜访，再到周末复盘，AI贯穿全流程。传统代理人靠人力堆砌，AI代理人靠智能赋能。这就是代际鸿沟。',
          };
          const t = window.setTimeout(() => {
            addMessage(closingMsg);
            setQuickReplies([
              { label: '立即体验', value: 'cta-experience' },
              { label: '联系我们', value: 'cta-contact' },
            ]);
          }, 500);
          timeoutRefs.current.push(t);
          return;
        }

        setState((prev) => ({
          ...prev,
          currentScenario: null,
          currentStep: 0,
        }));
        // Show welcome quick replies
        const t = window.setTimeout(() => {
          setQuickReplies(
            scenariosByStoryLine[storyLineRef.current].map((s) => ({
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
        const scenarios = scenariosByStoryLine[storyLineRef.current];
        const scenario = scenarios.find((s) => s.id === currentScenario);
        if (scenario) {
          let nextStep = currentStep + 1;
          if (currentScenario === 'persona-setup' && currentStep === 0) {
            nextStep = reply.value === 'persona-detail-alt' ? 2 : 1;
          }
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
                scenariosByStoryLine[storyLineRef.current].map((s) => ({
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
        const scenarios = scenariosByStoryLine[storyLineRef.current];
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
      const scenarios = scenariosByStoryLine[storyLineRef.current];
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
            '好的，我理解您的需求。请选择以下场景，我可以为您提供更专业的服务：',
          speechText: '好的，请选择场景，我来帮您。',
        });
        setTyping(false);
        setQuickReplies(
          scenariosByStoryLine[storyLineRef.current].map((s) => ({
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
    (scenarioId: string, storyLine?: StoryLine) => {
      if (storyLine) {
        storyLineRef.current = storyLine;
      }
      clearTimeouts();
      // Cancel any ongoing speech immediately so switching modules
      // doesn't cause overlapping audio during the 100ms state-reset gap.
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      sessionRef.current += 1;
      setState((prev) => ({
        ...prev,
        ...(storyLine && { storyLine }),
        messages: [],
        isTyping: false,
        currentScenario: null,
        currentStep: 0,
        quickReplies: [],
      }));
      // Use setTimeout to ensure state is reset before starting
      const t = window.setTimeout(() => {
        playScenarioStep(scenarioId, 0);
      }, 100);
      timeoutRefs.current.push(t);
    },
    [clearTimeouts, playScenarioStep]
  );

  const initChat = useCallback((storyLine: StoryLine = 'timeline') => {
    storyLineRef.current = storyLine;
    const scenarios = scenariosByStoryLine[storyLine];

    const welcomeMsg: Message = storyLine === 'timeline'
      ? {
          id: generateId(),
          role: 'ai',
          type: 'text',
          content:
            '您好，张经理！我是您的AI智能助理\n\n今天是2025年2月14日，**我已为您准备好**今天的工作安排。\n\n📌 今日待办：\n• 10:00 拜访王建国（教育金方案）\n• 14:00 团队周例会\n• 16:00 电话跟进李美琳\n\n请确认或调整：',
          speechText: '张经理您好！今天有三项待办，我已为您准备好，请确认或调整。',
          timestamp: Date.now(),
        }
      : {
          id: generateId(),
          role: 'ai',
          type: 'text',
          content:
            '小李，欢迎使用万能营销助手。建议先完成人设打造，再体验从朋友圈到方案的全链路 AI 赋能。选择下方模块开始：',
          speechText: '小李，欢迎使用万能营销助手。建议先完成人设打造，再体验全链路 AI 赋能。',
          timestamp: Date.now(),
        };

    setState((prev) => ({
      ...prev,
      storyLine,
      messages: [welcomeMsg],
      quickReplies: storyLine === 'timeline'
        ? [
            { label: '✓ 确认今日安排', value: 'confirm-today' },
            { label: '调整计划', value: 'adjust-plan' },
            ...scenarios.map((s) => ({ label: `${s.icon} ${s.name}`, value: s.id })),
          ]
        : scenarios.map((s) => ({ label: `${s.icon} ${s.name}`, value: s.id })),
    }));
    if (welcomeMsg.speechText && speakFnRef.current) {
      speakFnRef.current(welcomeMsg.speechText);
    }
  }, []);

  const handleUserImage = useCallback(
    (imageUrl: string, text?: string) => {
      addMessage({
        role: 'user',
        type: 'text',
        content: text || '[已上传保单/身份证照片]',
        imageUrl,
      });
      setQuickReplies([]);
      storyLineRef.current = 'timeline'; // 拍照识别属于展业全流程
      startScenario('image-recognition');
    },
    [addMessage, startScenario]
  );

  const setStoryLine = useCallback((line: StoryLine) => {
    storyLineRef.current = line;
    setState((prev) => ({ ...prev, storyLine: line }));
  }, []);

  const clearChat = useCallback(() => {
    clearTimeouts();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setState((prev) => ({
      ...prev,
      messages: [],
      isTyping: false,
      currentScenario: null,
      currentStep: 0,
      quickReplies: [],
    }));
  }, [clearTimeouts]);

  return {
    ...state,
    addMessage,
    handleQuickReply,
    handleUserMessage,
    handleUserImage,
    startScenario,
    resetAndStartScenario,
    initChat,
    setStoryLine,
    clearChat,
    registerSpeak,
  };
}
