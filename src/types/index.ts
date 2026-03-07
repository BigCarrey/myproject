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
    | 'add-client'
    | 'update-client'
    | 'switch-app'
    | 'swap-panels'
    | 'unswap-panels'
    | 'add-calendar-event'
    | 'start-recording'
    | 'stop-recording'
    | 'set-notification';
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

// ===== Agent Memory Types (Field Mode) =====

export interface MemoryItem {
  id: string;
  category: 'thought' | 'preference' | 'habit' | 'recent' | 'client-update';
  content: string;
  timestamp: number;
  isNew?: boolean;
}

export interface ClientMemory {
  name: string;
  avatar: string;
  status: 'potential' | 'active' | 'closed';
  addedReason: string;
  profile: Record<string, string>;
  memories: MemoryItem[];
}

export interface AgentMemory {
  name: string;
  gender: string;
  age: number;
  location: string;
  education: string;
  performance: string;
  joinDate: string;
  understandingLevel: number; // 0-100

  // Dynamic fields
  interests: string[];
  socialCircle: string;
  goals: string;
  challenges: string;
  memories: MemoryItem[];
  clients: ClientMemory[];
}

// ===== Execution Panel Types =====

export type PhoneApp = 'home' | 'wechat-chat' | 'wechat-moments' | 'calendar' | 'recorder' | 'memo' | 'camera' | 'photos' | 'phone' | 'sms';

export interface CalendarEvent {
  title: string;
  date: string;
  time: string;
  location?: string;
  color?: string;
}

export interface PhoneNotification {
  app: string;
  title: string;
  body: string;
  icon: string;
  timestamp: string;
}

export interface ExecutionPanelState {
  currentApp: PhoneApp;
  wechatState: WeChatState;
  calendarEvents: CalendarEvent[];
  isRecording: boolean;
  recordingDuration: number;
  notification: PhoneNotification | null;
}

// ===== Field Mode Phase =====

export type FieldPhase = 'memory-collection' | 'ceremony' | 'main';
