import type {
  ChatMessage,
  ChatSession,
  SessionColor,
  SessionStatus,
} from './llm-chat.types';

export const MAX_SESSIONS = 5;

export function createSession(input: {
  id: string;
  title: string;
  color: SessionColor;
  now: number;
}): ChatSession {
  return {
    id: input.id,
    title: input.title,
    color: input.color,
    status: 'idle',
    statusUpdatedAt: input.now,
    messages: [],
  };
}

export function addSession(sessions: ChatSession[], session: ChatSession): ChatSession[] {
  if (sessions.length >= MAX_SESSIONS) {
    return sessions;
  }

  return [...sessions, session];
}

export function closeSession(
  sessions: ChatSession[],
  sessionId: string,
  activeSessionId: string
): { sessions: ChatSession[]; nextActiveId: string } {
  if (sessions.length <= 1) {
    return { sessions, nextActiveId: activeSessionId };
  }

  const closeIndex = sessions.findIndex((session) => session.id === sessionId);
  if (closeIndex < 0) {
    return { sessions, nextActiveId: activeSessionId };
  }

  const nextSessions = sessions.filter((session) => session.id !== sessionId);

  if (activeSessionId !== sessionId) {
    return { sessions: nextSessions, nextActiveId: activeSessionId };
  }

  const fallback =
    nextSessions[closeIndex] ?? nextSessions[closeIndex - 1] ?? nextSessions[0];

  return {
    sessions: nextSessions,
    nextActiveId: fallback.id,
  };
}

export function applySessionStatus(
  session: ChatSession,
  nextStatus: SessionStatus,
  at: number
): ChatSession {
  if (at < session.statusUpdatedAt) {
    return session;
  }

  return {
    ...session,
    status: nextStatus,
    statusUpdatedAt: at,
  };
}

export function renameSession(
  sessions: ChatSession[],
  sessionId: string,
  nextTitle: string
): ChatSession[] {
  const trimmed = nextTitle.trim();
  if (!trimmed) {
    return sessions;
  }

  return sessions.map((session) =>
    session.id === sessionId ? { ...session, title: trimmed } : session
  );
}

export function recolorSession(
  sessions: ChatSession[],
  sessionId: string,
  nextColor: SessionColor
): ChatSession[] {
  return sessions.map((session) =>
    session.id === sessionId ? { ...session, color: nextColor } : session
  );
}

function buildEchoMarkdown(userText: string): string {
  return [
    '我已经收到你的输入，并在当前 preview 中完成本地回声。',
    '',
    `- 你刚刚输入：${userText}`,
    '- 结构化复述：本次消息将保存在当前 session 的 messages[] 中。',
    '- 下一步建议：可继续发送，验证多轮对话与会话隔离。',
  ].join('\n');
}

export function appendUserAndEchoMessages(
  session: ChatSession,
  input: {
    userText: string;
    now: number;
    idFactory: () => string;
  }
): ChatSession {
  const trimmed = input.userText.trim();
  if (!trimmed) {
    return session;
  }

  const userMessage: ChatMessage = {
    id: `${input.idFactory()}-user`,
    role: 'user',
    contentMarkdown: trimmed,
    createdAt: input.now,
    status: 'complete',
  };

  const assistantMessage: ChatMessage = {
    id: `${input.idFactory()}-assistant`,
    role: 'assistant',
    contentMarkdown: buildEchoMarkdown(trimmed),
    createdAt: input.now + 1,
    status: 'complete',
  };

  return {
    ...session,
    messages: [...session.messages, userMessage, assistantMessage],
  };
}

export function appendMessage(session: ChatSession, message: ChatMessage): ChatSession {
  return {
    ...session,
    messages: [...session.messages, message],
  };
}

export function createMessage(input: {
  id: string;
  role: ChatMessage['role'];
  contentMarkdown: string;
  createdAt: number;
  status?: ChatMessage['status'];
}): ChatMessage {
  return {
    id: input.id,
    role: input.role,
    contentMarkdown: input.contentMarkdown,
    createdAt: input.createdAt,
    status: input.status,
  };
}

export function buildAssistantEcho(userText: string): string {
  return buildEchoMarkdown(userText.trim());
}

export function updateSessionById(
  sessions: ChatSession[],
  sessionId: string,
  updater: (session: ChatSession) => ChatSession
): ChatSession[] {
  return sessions.map((session) =>
    session.id === sessionId ? updater(session) : session
  );
}
