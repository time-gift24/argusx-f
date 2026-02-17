import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LlmChatSessionTabsComponent } from './llm-chat/llm-chat-session-tabs.component';
import { LlmChatMessageListComponent } from './llm-chat/llm-chat-message-list.component';
import { LlmChatComposerComponent } from './llm-chat/llm-chat-composer.component';
import {
  MAX_SESSIONS,
  addSession,
  applySessionStatus,
  appendMessage,
  buildAssistantEcho,
  closeSession,
  createMessage,
  createSession,
  recolorSession,
  renameSession,
  updateSessionById,
} from './llm-chat/llm-chat.state';
import {
  SESSION_COLOR_PRESETS,
  type ChatSession,
  type SessionColor,
  type SessionStatus,
} from './llm-chat/llm-chat.types';
import {
  LiquidGlassComponent,
  type LiquidGlassConfig,
  type LiquidMode,
} from '../shared/ui/liquid-glass';

const GLASS_MODES: LiquidMode[] = ['standard', 'polar', 'prominent', 'shader'];
type GlassRangeKey =
  | 'displacementScale'
  | 'blurAmount'
  | 'saturation'
  | 'aberrationIntensity'
  | 'cornerRadius';

@Component({
  selector: 'app-llm-chat-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LlmChatSessionTabsComponent,
    LlmChatMessageListComponent,
    LlmChatComposerComponent,
    LiquidGlassComponent,
  ],
  template: `
    <div class="mx-auto flex h-[100vh] w-full max-w-6xl flex-col px-4 pt-4 pb-4 md:px-8 md:pt-8 md:pb-6">
      <header class="mb-3 md:mb-4">
        <h1 class="text-2xl font-semibold">LLM Chat Preview</h1>
        <p class="mt-1 text-xs text-muted-foreground">
          Floating composer with compact liquid-glass controls.
        </p>
      </header>

      <div class="relative min-h-0 flex-1">
        <app-llm-chat-message-list [messages]="activeMessages()" />

        <aside class="pointer-events-none absolute top-2 right-0 z-30 hidden md:block">
          <section class="pointer-events-auto w-52 rounded-xl border border-border/45 bg-background/70 p-2.5 shadow-lg backdrop-blur-sm">
            <p class="mb-2 text-[10px] font-semibold tracking-wide text-foreground/70">LIQUID</p>

            <div class="space-y-2">
              <label class="block">
                <div class="mb-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Displace</span>
                  <span>{{ floatingGlassState().displacementScale }}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="1"
                  class="h-1 w-full accent-primary"
                  [value]="floatingGlassState().displacementScale"
                  (input)="onGlassRangeChange('displacementScale', $event)"
                />
              </label>

              <label class="block">
                <div class="mb-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Blur</span>
                  <span>{{ floatingGlassState().blurAmount.toFixed(2) }}</span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.50"
                  step="0.01"
                  class="h-1 w-full accent-primary"
                  [value]="floatingGlassState().blurAmount"
                  (input)="onGlassRangeChange('blurAmount', $event)"
                />
              </label>

              <label class="block">
                <div class="mb-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Saturation</span>
                  <span>{{ floatingGlassState().saturation }}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="220"
                  step="1"
                  class="h-1 w-full accent-primary"
                  [value]="floatingGlassState().saturation"
                  (input)="onGlassRangeChange('saturation', $event)"
                />
              </label>

              <label class="block">
                <div class="mb-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Aberration</span>
                  <span>{{ floatingGlassState().aberrationIntensity.toFixed(1) }}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.1"
                  class="h-1 w-full accent-primary"
                  [value]="floatingGlassState().aberrationIntensity"
                  (input)="onGlassRangeChange('aberrationIntensity', $event)"
                />
              </label>

              <label class="block">
                <div class="mb-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Radius</span>
                  <span>{{ floatingGlassState().cornerRadius }}</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="40"
                  step="1"
                  class="h-1 w-full accent-primary"
                  [value]="floatingGlassState().cornerRadius"
                  (input)="onGlassRangeChange('cornerRadius', $event)"
                />
              </label>
            </div>

            <div class="mt-2 grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1.5 text-[10px]">
              <span class="text-muted-foreground">Mode</span>
              <select
                class="h-6 rounded-md border border-border/60 bg-background/85 px-1.5 text-[10px] text-foreground outline-none"
                [value]="floatingGlassState().mode"
                (change)="onGlassModeChange($event)"
              >
                @for (mode of glassModes; track mode) {
                  <option [value]="mode">{{ mode }}</option>
                }
              </select>

              <span class="text-muted-foreground">OverLight</span>
              <input
                type="checkbox"
                class="size-3.5 accent-primary"
                [checked]="floatingGlassState().overLight"
                (change)="onGlassOverLightChange($event)"
              />

              <span class="text-muted-foreground">Elasticity</span>
              <span class="text-right text-foreground/70">0 (fixed)</span>
            </div>
          </section>
        </aside>

        <div class="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-1 pb-1 md:px-2 md:pb-2">
          <app-liquid-glass
            class="pointer-events-auto mx-auto block w-full max-w-[48rem]"
            [config]="floatingGlassConfig()"
            [solidBorder]="true"
            [solidBorderWidth]="1.5"
            solidBorderColor="color-mix(in srgb, var(--primary) 70%, transparent)"
            solidBorderHighlightColor="color-mix(in srgb, var(--primary) 78%, transparent)"
            solidBorderGlowColor="rgba(0, 0, 0, 0)"
          >
            <div
              class="relative bg-background/30 shadow-[0_14px_36px_rgba(0,0,0,0.24)]"
              [style.border-radius.px]="floatingGlassState().cornerRadius"
            >
              <app-llm-chat-composer
                [value]="composerValue()"
                [sendDisabled]="sendDisabled()"
                (valueChange)="composerValue.set($event)"
                (send)="onSend()"
              />

              <div class="absolute inset-x-0 bottom-1.5 px-3 pr-12 md:px-4 md:pr-14">
                <app-llm-chat-session-tabs
                  [sessions]="sessions()"
                  [activeSessionId]="activeSessionId()"
                  [canCreateSession]="canCreateSession()"
                  (sessionSelect)="onSelectSession($event)"
                  (createSession)="onCreateSession()"
                  (closeSession)="onCloseSession($event)"
                  (renameSession)="onRenameSession($event.sessionId, $event.title)"
                  (recolorSession)="onRecolorSession($event.sessionId, $event.color)"
                />
              </div>
            </div>
          </app-liquid-glass>
        </div>
      </div>
    </div>
  `,
})
export class LlmChatPreviewComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly responseTimers = new Set<number>();
  private sessionCounter = 2;
  private messageCounter = 0;

  readonly sessions = signal<ChatSession[]>(this.buildInitialSessions());
  readonly activeSessionId = signal(this.sessions()[0]?.id ?? 'session-1');
  readonly composerValue = signal('');
  readonly statusNotice = signal('');
  readonly glassModes = GLASS_MODES;
  readonly floatingGlassState = signal({
    displacementScale: 128,
    blurAmount: 0.24,
    saturation: 176,
    aberrationIntensity: 2.2,
    cornerRadius: 24,
    overLight: false,
    mode: 'standard' as LiquidMode,
  });

  readonly activeSession = computed(() =>
    this.sessions().find((session) => session.id === this.activeSessionId())
  );

  readonly activeMessages = computed(() => this.activeSession()?.messages ?? []);
  readonly floatingGlassConfig = computed<LiquidGlassConfig>(() => ({
    ...this.floatingGlassState(),
    elasticity: 0,
  }));

  readonly canCreateSession = computed(() => this.sessions().length < MAX_SESSIONS);

  readonly sendDisabled = computed(() => {
    if (!this.activeSession()) {
      return true;
    }

    return this.composerValue().trim().length === 0;
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.responseTimers.forEach((timerId) => {
        clearTimeout(timerId);
      });
      this.responseTimers.clear();
    });
  }

  protected onSelectSession(sessionId: string): void {
    this.activeSessionId.set(sessionId);
    this.statusNotice.set('');
  }

  protected onCreateSession(): void {
    if (!this.canCreateSession()) {
      this.statusNotice.set('最多可创建 5 个会话。');
      return;
    }

    const now = Date.now();
    this.sessionCounter += 1;

    const nextSession = createSession({
      id: `session-${this.sessionCounter}`,
      title: `会话 ${this.sessionCounter}`,
      color: this.nextSessionColor(),
      now,
    });

    this.sessions.update((current) => addSession(current, nextSession));
    this.activeSessionId.set(nextSession.id);
    this.statusNotice.set('');
  }

  protected onCloseSession(sessionId: string): void {
    const result = closeSession(
      this.sessions(),
      sessionId,
      this.activeSessionId()
    );

    this.sessions.set(result.sessions);
    this.activeSessionId.set(result.nextActiveId);
    this.statusNotice.set('');
  }

  protected onRenameSession(sessionId: string, nextTitle: string): void {
    this.sessions.update((current) => renameSession(current, sessionId, nextTitle));
  }

  protected onRecolorSession(sessionId: string, nextColor: SessionColor): void {
    this.sessions.update((current) => recolorSession(current, sessionId, nextColor));
  }

  protected onSend(): void {
    const text = this.composerValue().trim();
    if (!text) {
      return;
    }

    const sessionId = this.activeSessionId();
    const now = Date.now();
    const userMessageId = this.nextMessageId();

    this.sessions.update((current) =>
      updateSessionById(current, sessionId, (session) => {
        const withUser = appendMessage(
          session,
          createMessage({
            id: userMessageId,
            role: 'user',
            contentMarkdown: text,
            createdAt: now,
            status: 'complete',
          })
        );

        return applySessionStatus(withUser, 'streaming', now);
      })
    );

    this.composerValue.set('');

    const timerId = window.setTimeout(() => {
      this.responseTimers.delete(timerId);
      this.completeAssistantResponse(sessionId, text);
    }, 520);

    this.responseTimers.add(timerId);
  }

  protected onGlassRangeChange(key: GlassRangeKey, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    if (!Number.isFinite(value)) {
      return;
    }

    this.floatingGlassState.update((current) => ({
      ...current,
      [key]: value,
    }));
  }

  protected onGlassModeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const nextMode = target.value as LiquidMode;
    if (!GLASS_MODES.includes(nextMode)) {
      return;
    }

    this.floatingGlassState.update((current) => ({
      ...current,
      mode: nextMode,
    }));
  }

  protected onGlassOverLightChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.floatingGlassState.update((current) => ({
      ...current,
      overLight: target.checked,
    }));
  }

  private completeAssistantResponse(sessionId: string, text: string): void {
    const now = Date.now();
    const isError = this.shouldMockError(text);
    const assistantMessage = isError
      ? '本次会话出现异常：模拟请求失败，请稍后重试。'
      : buildAssistantEcho(text);
    const sessionStatus: SessionStatus = isError ? 'error' : 'ended';

    this.sessions.update((current) =>
      updateSessionById(current, sessionId, (session) => {
        const withAssistant = appendMessage(
          session,
          createMessage({
            id: this.nextMessageId(),
            role: 'assistant',
            contentMarkdown: assistantMessage,
            createdAt: now,
            status: isError ? 'error' : 'complete',
          })
        );

        return applySessionStatus(withAssistant, sessionStatus, now);
      })
    );

    this.statusNotice.set(
      isError
        ? '检测到异常关键字，已将当前会话标记为异常状态。'
        : '本轮回复已结束，当前会话标记为已结束通知。'
    );
  }

  private shouldMockError(text: string): boolean {
    return /(^\/error\b|\berror\b|异常)/i.test(text);
  }

  private nextSessionColor(): SessionColor {
    const nextIndex = this.sessions().length % SESSION_COLOR_PRESETS.length;
    return SESSION_COLOR_PRESETS[nextIndex];
  }

  private nextMessageId(): string {
    this.messageCounter += 1;
    return `message-${this.messageCounter}`;
  }

  private buildInitialSessions(): ChatSession[] {
    const now = Date.now();

    return [
      createSession({
        id: 'session-1',
        title: '开发会话',
        color: 'violet',
        now,
      }),
      createSession({
        id: 'session-2',
        title: '测试会话',
        color: 'amber',
        now: now + 1,
      }),
    ];
  }
}
