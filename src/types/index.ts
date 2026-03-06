export type MessageContentType =
  | 'text'
  | 'customer-card'
  | 'plan-card'
  | 'product-card'
  | 'coverage-gap'
  | 'team-dashboard'
  | 'member-card'
  | 'visit-summary'
  | 'work-summary'
  | 'schedule-card'
  | 'income-card'
  | 'nearby-customers'
  | 'monthly-plan'
  | 'customer-grid'
  | 'customer-list'
  | 'auto-step-progress'
  | 'customer-profile-grid'
  | 'coverage-analysis'
  | 'product-plans'
  | 'collapsible-step'
  | 'objection-handling'
  | 'visit-strategy'
  | 'ability-analysis'
  | 'coaching-plan'
  | 'learning-plan';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  type: MessageContentType;
  content: string;
  speechText?: string;
  data?: Record<string, unknown>;
  timestamp: number;
  /** 用户消息中的图片（base64 或 URL） */
  imageUrl?: string;
}

export interface QuickReply {
  label: string;
  value: string;
  icon?: string;
}

export interface ScenarioStep {
  aiMessages: Array<{
    type: MessageContentType;
    content: string;
    speechText?: string;
    data?: Record<string, unknown>;
    delay?: number;
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

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: '男' | '女';
  phone: string;
  occupation: string;
  annualIncome: string;
  familyStatus: string;
  existingPolicies: Policy[];
  tags: string[];
  lastContact: string;
  priority: 'high' | 'medium' | 'low';
  address: string;
  notes: string;
}

export interface Policy {
  name: string;
  type: string;
  premium: string;
  coverage: string;
  insured: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  features: string[];
  premium: string;
  coverage: string;
  suitableFor: string;
  sellingPoints: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  level: string;
  monthlyTarget: number;
  monthlyAchieved: number;
  weeklyVisits: number;
  weeklyTarget: number;
  newCustomers: number;
  conversionRate: number;
  status: 'excellent' | 'good' | 'needs-attention';
  issues?: string[];
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
