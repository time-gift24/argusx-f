import { describe, expect, it } from 'vitest';
import {
  SESSION_COLOR_PRESETS,
  SESSION_STATUS_VALUES,
  type SessionColor,
} from './llm-chat.types';
import {
  addSession,
  appendUserAndEchoMessages,
  applySessionStatus,
  closeSession,
  createSession,
  renameSession,
  recolorSession,
} from './llm-chat.state';

describe('llm-chat types and state', () => {
  it('exposes exactly 8 session color presets', () => {
    expect(SESSION_COLOR_PRESETS).toHaveLength(8);
  });

  it('exposes required status values', () => {
    expect(SESSION_STATUS_VALUES).toEqual(['idle', 'streaming', 'error', 'ended']);
  });

  it('creates default idle session with empty messages', () => {
    const session = createSession({
      id: 's1',
      title: '开发会话',
      color: 'violet',
      now: 10,
    });

    expect(session.status).toBe('idle');
    expect(session.messages).toEqual([]);
  });

  it('caps session count at 5', () => {
    const colors: SessionColor[] = ['violet', 'amber', 'sky', 'emerald', 'rose'];
    const sessions = colors.map((color, idx) =>
      createSession({
        id: `s${idx + 1}`,
        title: `S${idx + 1}`,
        color,
        now: idx,
      })
    );

    const next = addSession(
      sessions,
      createSession({
        id: 's6',
        title: 'S6',
        color: 'slate',
        now: 99,
      })
    );

    expect(next).toHaveLength(5);
  });

  it('selects adjacent session when closing active session', () => {
    const sessions = ['a', 'b', 'c'].map((id, idx) =>
      createSession({
        id,
        title: id,
        color: 'sky',
        now: idx,
      })
    );

    const result = closeSession(sessions, 'b', 'b');

    expect(result.sessions.map((item) => item.id)).toEqual(['a', 'c']);
    expect(result.nextActiveId).toBe('c');
  });

  it('keeps status when applying older timestamp update', () => {
    const base = createSession({
      id: 'status-1',
      title: '状态',
      color: 'cyan',
      now: 100,
    });

    const streaming = applySessionStatus(base, 'streaming', 120);
    const olderError = applySessionStatus(streaming, 'error', 110);

    expect(olderError.status).toBe('streaming');

    const newerEnded = applySessionStatus(streaming, 'ended', 130);
    expect(newerEnded.status).toBe('ended');
  });

  it('appends user message and richer assistant echo', () => {
    const session = createSession({
      id: 'echo-1',
      title: 'Echo',
      color: 'lime',
      now: 1,
    });

    const next = appendUserAndEchoMessages(session, {
      userText: '帮我设计 session tabs',
      now: 200,
      idFactory: () => 'message-id',
    });

    expect(next.messages).toHaveLength(2);
    expect(next.messages[0]?.role).toBe('user');
    expect(next.messages[1]?.role).toBe('assistant');
    expect(next.messages[1]?.contentMarkdown).toContain('我已经收到你的输入');
    expect(next.messages[1]?.contentMarkdown).toContain('下一步建议');
  });

  it('renames and recolors a session', () => {
    const sessions = [
      createSession({ id: 'one', title: 'One', color: 'violet', now: 1 }),
      createSession({ id: 'two', title: 'Two', color: 'amber', now: 2 }),
    ];

    const renamed = renameSession(sessions, 'two', '二号会话');
    const recolored = recolorSession(renamed, 'two', 'emerald');

    expect(recolored[1]?.title).toBe('二号会话');
    expect(recolored[1]?.color).toBe('emerald');
  });
});
