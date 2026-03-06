import { useEffect, useRef, useCallback, useState } from 'react';
import { Header } from './components/Header';
import { MessageBubble } from './components/MessageBubble';
import { InputBar } from './components/InputBar';
import { QuickReplies } from './components/QuickReplies';
import { TypingIndicator } from './components/TypingIndicator';
import { OverviewPage } from './components/OverviewPage';
import { useChat } from './hooks/useChat';
import { useSpeech } from './hooks/useSpeech';
import { scenariosByStoryLine } from './data';
import type { StoryLine } from './types';

const modulesMetaTimeline = [
  {
    id: 'monthly-review',
    name: '每月初，提醒代理人盘点客户',
    timing: '每月初',
    icon: '📋',
    color: '#4F6BF6',
    narration: '场景一，每月初，AI主动提醒代理人盘点客户并生成经营计划。',
  },
  {
    id: 'weekly-plan',
    name: '每周初，提醒本周经营计划',
    timing: '每周初',
    icon: '📅',
    color: '#6366F1',
    narration: '场景二，每周初，AI推送本周拜访计划与客户跟进策略。',
  },
  {
    id: 'pre-visit',
    name: '某天，客户拜访前',
    timing: '拜访前',
    icon: '💼',
    color: '#818CF8',
    narration: '场景三，拜访前，AI自动生成保障检视与专属产品方案。',
  },
  {
    id: 'post-visit',
    name: '某天，客户拜访后',
    timing: '拜访后',
    icon: '📝',
    color: '#4F6BF6',
    narration: '场景四，拜访后，AI语音记录拜访并生成总结与跟进计划。',
  },
  {
    id: 'team-coaching',
    name: '某天晚上：辅导下属',
    timing: '晚上',
    icon: '👥',
    color: '#6366F1',
    narration: '场景五，当天晚上，AI辅助主管精准辅导下属。',
  },
  {
    id: 'weekly-summary',
    name: '每周末，形成周工作总结',
    timing: '周末',
    icon: '📊',
    color: '#0EA5E9',
    narration: '场景六，每周末，AI自动生成本周工作周报。',
  },
  {
    id: 'monthly-retrospective',
    name: '每月末，形成月度工作复盘',
    timing: '月末',
    icon: '📈',
    color: '#10B981',
    narration: '场景七，每月末，AI生成月度复盘报告，闭环全月经营。',
  },
  {
    id: 'image-recognition',
    name: '拍照识别保单/客户档案',
    timing: '拍照',
    icon: '📷',
    color: '#0EA5E9',
    narration: '场景八，拍照上传保单或身份证，AI智能识别并自动补充客户档案。',
  },
];

const modulesMetaCustomer = [
  { id: 'persona-setup', name: '人设打造', timing: '人设', icon: '👤', color: '#3B82F6', narration: '传统代理人发朋友圈，憋三小时写不出两句。小李定下人设后，30秒生成，直接可发。' },
  { id: 'moment-custom', name: '朋友圈个性定制', timing: '朋友圈', icon: '📱', color: '#07C160', narration: '传统代理人自己想半天、复制粘贴。小李：人设加热点加城市，秒级生成。' },
  { id: 'smart-reply', name: '问题智能回复', timing: '私信', icon: '💬', color: '#6366F1', narration: '传统代理人查资料、想话术、怕说错。AI 先读懂再帮回，意图、情绪、阶段三维分析，一键发送。' },
  { id: 'insight-demand', name: '兴趣洞察+需求解析', timing: '洞察', icon: '🔍', color: '#3B82F6', narration: '传统代理人翻档案、猜需求。AI 扫朋友圈，隐私合规前提下秒出完整画像与需求优先级。' },
  { id: 'script-gap', name: '话术与缺口', timing: '话术', icon: '📋', color: '#F59E0B', narration: '团险风险提示、缺口量化、窗口期紧迫性，一句话戳中痛点。自然切入、不尬聊，一键发送。' },
  { id: 'match-commission', name: '方案与收益', timing: '方案', icon: '💰', color: '#10B981', narration: '方案、策略、佣金一体化。王哥决策型人格，给两个选项比给一个更容易成交。代理人心里有数、推得有底气。' },
  { id: 'materials-send', name: '素材生成与发送', timing: '素材', icon: '📤', color: '#0EA5E9', narration: '传统代理人自己做PPT、找案例、写说明。小李：四份专业材料秒级生成，确认即可，一键全部发送。' },
];

function App() {
  const chat = useChat();
  const speech = useSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasAddedDemoWelcome = useRef(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showOverview, setShowOverview] = useState(true);

  // 进入演示后：自动启动「人设打造」场景，让用户立即看到效果
  useEffect(() => {
    if (!showOverview && !hasAddedDemoWelcome.current && chat.messages.length === 0) {
      hasAddedDemoWelcome.current = true;
      setActiveModule('persona-setup');
      chat.resetAndStartScenario('persona-setup', 'customer');
    }
  }, [showOverview, chat.messages.length, chat.resetAndStartScenario]);

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

  const handleBackToStorySelect = useCallback(() => {
    setShowOverview(true);
    setActiveModule(null);
    hasAddedDemoWelcome.current = false;
    chat.clearChat();
  }, [chat]);

  const handleStartDemo = useCallback(() => {
    setShowOverview(false);
    hasAddedDemoWelcome.current = false;
  }, []);

  const getStoryLineForModule = useCallback((moduleId: string): StoryLine => {
    if (modulesMetaTimeline.some((m) => m.id === moduleId)) return 'timeline';
    return 'customer';
  }, []);

  const startModuleFromSidebar = useCallback(
    (moduleId: string) => {
      const line = getStoryLineForModule(moduleId);
      const meta = line === 'timeline' ? modulesMetaTimeline : modulesMetaCustomer;
      if (!meta.some((m) => m.id === moduleId)) return;

      setActiveModule(moduleId);
      chat.resetAndStartScenario(moduleId, line);
    },
    [chat, getStoryLineForModule]
  );

  const handleModuleClick = useCallback(
    (moduleId: string) => {
      startModuleFromSidebar(moduleId);
    },
    [startModuleFromSidebar]
  );

  const handleQuickReply = useCallback(
    (reply: { label: string; value: string }) => {
      const timelineScenario = scenariosByStoryLine.timeline.find((s) => s.id === reply.value);
      const customerScenario = scenariosByStoryLine.customer.find((s) => s.id === reply.value);
      const scenario = timelineScenario || customerScenario;
      const line = timelineScenario ? 'timeline' : customerScenario ? 'customer' : null;
      if (scenario && line) {
        chat.addMessage({ role: 'user', type: 'text', content: reply.label });
        chat.setStoryLine(line);
        chat.startScenario(scenario.id);
        setActiveModule(scenario.id);
      } else {
        chat.handleQuickReply(reply);
      }
    },
    [chat]
  );

  if (showOverview) {
    return (
      <OverviewPage onStart={handleStartDemo} />
    );
  }

  return (
    <div className="h-full flex items-center justify-center py-5 relative bg-gradient-to-b from-[#EBF5FF] via-[#E0F2FE] to-[#DBEAFE]">
      {/* 噪点纹理覆盖层 */}
      <div className="noise-overlay" aria-hidden="true" />
      {/* Left Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">AI</div>
          <div>
            <h2 className="sidebar-title">万能营销助手</h2>
            <p className="sidebar-subtitle">智能保险销售平台</p>
          </div>
        </div>

        <div className="sidebar-label">选择场景体验</div>

        <nav className="sidebar-nav">
          {/* 个性化经营 - 主推，置顶 */}
          <div className="mb-3">
            <div
              className="sidebar-section-card flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 cursor-pointer transition-all hover:shadow-md"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(29,78,216,0.06) 100%)', border: '1px solid rgba(59,130,246,0.25)' }}
            >
              <span className="text-xl">👤</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#0F172A] text-[13px]">个性化经营</div>
                <div className="text-[11px] text-[#64748B] truncate">小李×王哥 · 人设到素材</div>
              </div>
            </div>
            <div className="space-y-0.5">
              {modulesMetaCustomer.map((mod) => {
                const isActive = (chat.currentScenario ?? activeModule) === mod.id;
                return (
                <button
                  key={mod.id}
                  className={`sidebar-item w-full ${isActive ? 'sidebar-item-active' : ''}`}
                  onClick={() => handleModuleClick(mod.id)}
                >
                  <span className="sidebar-icon" style={{ background: isActive ? mod.color : undefined }}>
                    {mod.icon}
                  </span>
                  <div className="sidebar-item-text">
                    <span className="sidebar-item-name">{mod.name}</span>
                    <span className="sidebar-item-timing">{mod.timing}</span>
                  </div>
                  {isActive && <span className="sidebar-active-dot" style={{ background: mod.color }} />}
                </button>
                );
              })}
            </div>
          </div>

          {/* 展业全流程 */}
          <div>
            <div
              className="sidebar-section-card flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 cursor-pointer transition-all hover:shadow-md"
              style={{ background: 'linear-gradient(135deg, rgba(79,107,246,0.1) 0%, rgba(99,102,241,0.05) 100%)', border: '1px solid rgba(79,107,246,0.2)' }}
            >
              <span className="text-xl">📋</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#0F172A] text-[13px]">展业全流程</div>
                <div className="text-[11px] text-[#64748B] truncate">张经理 · 月初到月末</div>
              </div>
            </div>
            <div className="space-y-0.5">
              {modulesMetaTimeline.map((mod) => {
                const isActive = (chat.currentScenario ?? activeModule) === mod.id;
                return (
                <button
                  key={mod.id}
                  className={`sidebar-item w-full ${isActive ? 'sidebar-item-active' : ''}`}
                  onClick={() => handleModuleClick(mod.id)}
                >
                  <span className="sidebar-icon" style={{ background: isActive ? mod.color : undefined }}>
                    {mod.icon}
                  </span>
                  <div className="sidebar-item-text">
                    <span className="sidebar-item-name">{mod.name}</span>
                    <span className="sidebar-item-timing">{mod.timing}</span>
                  </div>
                  {isActive && <span className="sidebar-active-dot" style={{ background: mod.color }} />}
                </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <p>Demo 演示模式</p>
          <p>个性化经营：点「继续故事」连贯演示</p>
          <button
            type="button"
            onClick={handleBackToStorySelect}
            className="mt-2 w-full py-2 rounded-lg text-[13px] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors border border-[#E2E8F0]"
          >
            返回首页
          </button>
        </div>
      </div>

      {/* Phone Mockup - Centered */}
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <Header />

          {/* Chat messages area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto scrollbar-hide pt-4 pb-4"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {chat.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
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
            onSendImage={chat.handleUserImage}
            onVoiceStart={speech.startListening}
            onVoiceStop={speech.stopListening}
            isListening={speech.isListening}
            transcript={speech.transcript}
            disabled={chat.isTyping}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
