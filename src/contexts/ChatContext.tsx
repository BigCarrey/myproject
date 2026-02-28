import { createContext, useContext } from 'react';
import type { QuickReply } from '../types';

interface ChatContextValue {
  onQuickReply?: (reply: QuickReply) => void;
  currentScenario?: string | null;
}

export const ChatContext = createContext<ChatContextValue>({});

export function useChatContext() {
  return useContext(ChatContext);
}
