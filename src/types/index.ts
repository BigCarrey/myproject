export type MessageContentType =
  | 'text'
  | 'progress-list'
  | 'agent-report'
  | 'ai-call'
  | 'data-capture'
  | 'risk-radar'
  | 'root-cause'
  | 'meeting-target'
  | 'meeting-script'
  | 'response-strategy'
  | 'recording'
  | 'meeting-result'
  | 'plan-delivery'
  | 'report-upload'
  | 'report-preview'
  | 'material-config'
  | 'material-preview'
  | 'material-distribute'
  | 'case-search'
  | 'case-result'
  | 'case-interview'
  | 'case-video'
  | 'field-moments-post'
  | 'field-ai-analysis'
  | 'field-reply-preview'
  | 'field-customer-profile'
  | 'field-needs-analysis'
  | 'field-sales-script'
  | 'field-gap-diagnosis'
  | 'field-product-plans'
  | 'field-commission'
  | 'field-materials';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  type: MessageContentType;
  content: string;
  speechText?: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

export interface QuickReply {
  label: string;
  value: string;
  icon?: string;
  primary?: boolean;
}

export interface WeChatChatMessage {
  sender: 'wangge' | 'xiaoli';
  content: string;
  contentType?: 'text' | 'image' | 'file';
  timestamp?: string;
}

export interface WeChatMoment {
  author: string;
  avatar?: string;
  content: string;
  images?: string[];
  imageUrls?: string[];
  time: string;
  likes?: string[];
  comments?: Array<{ author: string; content: string }>;
}

export interface WeChatScreenshotHelper {
  screenshot: string;
  analysis: string;
  generatedReply: string;
  visible: boolean;
}

export type ExecutionTab = 'chat' | 'moments' | 'calendar' | 'recording';

export interface CalendarEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  type: 'meeting' | 'reminder' | 'task';
}

export interface TranscriptItem {
  speaker: string;
  text: string;
  time: string;
}

export interface AgentMemoryField {
  icon: string;
  label: string;
  value: string;
  category: 'static' | 'dynamic' | 'customer';
  narrative?: string;
}

export interface WeChatEvent {
  type:
    | 'add-chat'
    | 'add-moment'
    | 'show-screenshot-helper'
    | 'hide-screenshot-helper'
    | 'switch-view'
    | 'set-chat-messages'
    | 'set-moments'
    | 'show-followup-reminder'
    | 'update-memory'
    | 'add-calendar-entry'
    | 'switch-execution-tab'
    | 'start-recording'
    | 'stop-recording'
    | 'add-transcript-item';
  data: unknown;
}

export interface FollowUpReminder {
  title: string;
  schedule: Array<{ date: string; action: string }>;
  summary?: string;
}

export interface WeChatState {
  currentView: 'chat' | 'moments';
  chatMessages: WeChatChatMessage[];
  moments: WeChatMoment[];
  screenshotHelper: WeChatScreenshotHelper | null;
}

export interface ScenarioStep {
  aiMessages: Array<{
    type: MessageContentType;
    content: string;
    speechText?: string;
    data?: Record<string, unknown>;
    delay?: number;
    wechatEvents?: WeChatEvent[];
  }>;
  quickReplies?: QuickReply[];
  quickReplyDelay?: number;
}

export interface Scenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  steps: ScenarioStep[];
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  currentScenario: string | null;
  currentStep: number;
  quickReplies: QuickReply[];
  isListening: boolean;
  isSpeaking: boolean;
}
