import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  ArgusxContextMenuComponent,
  ArgusxContextMenuContentComponent,
  ArgusxContextMenuItemComponent,
  ArgusxContextMenuSeparatorComponent,
  ArgusxContextMenuSubComponent,
  ArgusxContextMenuSubContentComponent,
  ArgusxContextMenuSubTriggerComponent,
  ArgusxContextMenuTriggerDirective,
} from '../../shared/ui/context-menu';
import {
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
} from '../../shared/ui/tabs';
import {
  SESSION_COLOR_PRESETS,
  type ChatSession,
  type SessionColor,
} from './llm-chat.types';

interface SessionPalette {
  dot: string;
}

const SESSION_PALETTES: Record<SessionColor, SessionPalette> = {
  violet: { dot: '#a78bfa' },
  amber: { dot: '#fbbf24' },
  sky: { dot: '#38bdf8' },
  emerald: { dot: '#34d399' },
  rose: { dot: '#fb7185' },
  slate: { dot: '#94a3b8' },
  cyan: { dot: '#22d3ee' },
  lime: { dot: '#a3e635' },
};

const SESSION_COLOR_LABELS: Record<SessionColor, string> = {
  violet: '紫色',
  amber: '琥珀',
  sky: '天蓝',
  emerald: '翠绿',
  rose: '玫红',
  slate: '石板',
  cyan: '青色',
  lime: '黄绿',
};

@Component({
  selector: 'app-llm-chat-session-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    ArgusxContextMenuComponent,
    ArgusxContextMenuTriggerDirective,
    ArgusxContextMenuContentComponent,
    ArgusxContextMenuItemComponent,
    ArgusxContextMenuSeparatorComponent,
    ArgusxContextMenuSubComponent,
    ArgusxContextMenuSubTriggerComponent,
    ArgusxContextMenuSubContentComponent,
  ],
  template: `
    <div class="flex min-w-0 items-center gap-1.5">
      <button
        type="button"
        class="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-base leading-none text-foreground/65 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35"
        data-testid="session-add"
        [disabled]="!canCreateSession()"
        (click)="createSession.emit()"
        aria-label="新增会话"
        title="新增会话"
      >
        +
      </button>

      <div class="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <app-tabs
          [value]="activeSessionId()"
          (valueChange)="sessionSelect.emit($event)"
          class="w-max min-w-full"
        >
          <app-tabs-list
            variant="line"
            class="w-max min-w-full justify-start gap-0.5 bg-transparent p-0"
          >
            @for (session of sessions(); track session.id) {
              <argusx-context-menu>
                <app-tabs-trigger
                  [value]="session.id"
                  argusxContextMenuTrigger
                  class="h-6 gap-1 rounded-md border-0 bg-transparent px-1.5 text-[10px] text-foreground/70 transition-colors data-active:bg-foreground/10 data-active:text-foreground hover:bg-foreground/[0.07] after:hidden"
                >
                  <span
                    class="size-1 shrink-0 rounded-full"
                    [style.background]="paletteFor(session.color).dot"
                  ></span>

                  <span class="max-w-[86px] truncate text-[10px]">
                    {{ session.title }}
                  </span>

                  @if (session.status === 'streaming') {
                    <span
                      class="ml-0.5 inline-flex size-1 shrink-0 animate-pulse rounded-full bg-foreground/75"
                      data-testid="status-streaming-icon"
                    ></span>
                  }

                  @if (session.status === 'ended') {
                    <span
                      class="ml-0.5 text-[10px] text-foreground/50"
                      data-testid="status-ended-badge"
                    >
                      结束
                    </span>
                  }

                  @if (session.status === 'error') {
                    <span class="ml-0.5 text-[10px] font-semibold text-rose-500">异常</span>
                  }

                  <button
                    type="button"
                    class="ml-0.5 inline-flex size-3 items-center justify-center rounded-full text-[8px] text-foreground/55 transition-colors hover:bg-foreground/10 hover:text-foreground"
                    [disabled]="sessions().length <= 1"
                    (click)="onCloseClick($event, session.id)"
                    aria-label="关闭会话"
                    title="关闭会话"
                  >
                    ×
                  </button>
                </app-tabs-trigger>

                <argusx-context-menu-content>
                  <argusx-context-menu-item (select)="onRename(session)">
                    重命名
                  </argusx-context-menu-item>

                  <argusx-context-menu-sub>
                    <argusx-context-menu-sub-trigger>更换颜色</argusx-context-menu-sub-trigger>
                    <argusx-context-menu-sub-content>
                      @for (color of colorOptions; track color) {
                        <argusx-context-menu-item (select)="recolorSession.emit({ sessionId: session.id, color })">
                          <span
                            class="mr-1 inline-flex size-2 rounded-full border border-black/10"
                            [style.background]="paletteFor(color).dot"
                          ></span>
                          {{ colorLabel(color) }}
                        </argusx-context-menu-item>
                      }
                    </argusx-context-menu-sub-content>
                  </argusx-context-menu-sub>

                  <argusx-context-menu-separator />

                  <argusx-context-menu-item
                    [disabled]="sessions().length <= 1"
                    (select)="closeSession.emit(session.id)"
                  >
                    关闭会话
                  </argusx-context-menu-item>
                </argusx-context-menu-content>
              </argusx-context-menu>
            }
          </app-tabs-list>
        </app-tabs>
      </div>
    </div>
  `,
})
export class LlmChatSessionTabsComponent {
  readonly sessions = input.required<ChatSession[]>();
  readonly activeSessionId = input.required<string>();
  readonly canCreateSession = input<boolean>(true);

  readonly sessionSelect = output<string>();
  readonly createSession = output<void>();
  readonly closeSession = output<string>();
  readonly renameSession = output<{ sessionId: string; title: string }>();
  readonly recolorSession = output<{ sessionId: string; color: SessionColor }>();

  protected readonly colorOptions = SESSION_COLOR_PRESETS;

  protected paletteFor(color: SessionColor): SessionPalette {
    return SESSION_PALETTES[color];
  }

  protected colorLabel(color: SessionColor): string {
    return SESSION_COLOR_LABELS[color];
  }

  protected onCloseClick(event: MouseEvent, sessionId: string): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.sessions().length <= 1) {
      return;
    }

    this.closeSession.emit(sessionId);
  }

  protected onRename(session: ChatSession): void {
    const promptValue =
      typeof window !== 'undefined'
        ? window.prompt('重命名会话', session.title)
        : session.title;

    if (promptValue === null || promptValue === undefined) {
      return;
    }

    this.renameSession.emit({
      sessionId: session.id,
      title: promptValue,
    });
  }
}
