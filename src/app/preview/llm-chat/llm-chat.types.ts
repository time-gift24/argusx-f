export const SESSION_STATUS_VALUES = ['idle', 'streaming', 'error', 'ended'] as const;
export type SessionStatus = (typeof SESSION_STATUS_VALUES)[number];

export const SESSION_COLOR_PRESETS = [
  'violet',
  'amber',
  'sky',
  'emerald',
  'rose',
  'slate',
  'cyan',
  'lime',
] as const;
export type SessionColor = (typeof SESSION_COLOR_PRESETS)[number];

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'complete' | 'streaming' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  contentMarkdown: string;
  createdAt: number;
  status?: MessageStatus;
}

export interface ChatSession {
  id: string;
  title: string;
  color: SessionColor;
  status: SessionStatus;
  statusUpdatedAt: number;
  messages: ChatMessage[];
}
