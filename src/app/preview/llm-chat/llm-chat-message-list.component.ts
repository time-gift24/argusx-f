import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ChatMessage } from './llm-chat.types';

@Component({
  selector: 'app-llm-chat-message-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full min-h-0 flex-col gap-5 overflow-y-auto px-1 py-1 pb-34 md:px-2 md:pb-36">
      @if (messages().length === 0) {
        <div class="rounded-2xl border border-dashed border-border/80 bg-background/35 px-4 py-6 text-center text-xs text-muted-foreground">
          当前会话还没有消息，输入内容后点击发送开始对话。
        </div>
      }

      @for (message of messages(); track message.id) {
        @if (message.role === 'user') {
          <article class="max-w-[260px] rounded-xl border border-amber-300/35 bg-amber-100/[0.06] px-3.5 py-2 text-sm/relaxed text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div class="whitespace-pre-wrap break-words">
              {{ message.contentMarkdown }}
            </div>
          </article>
        } @else if (message.role === 'assistant') {
          <article class="max-w-4xl whitespace-pre-wrap break-words text-[15px]/[1.7] text-foreground/90">
            {{ message.contentMarkdown }}
          </article>
        } @else {
          <article class="max-w-4xl whitespace-pre-wrap break-words text-sm/relaxed text-muted-foreground italic">
            {{ message.contentMarkdown }}
          </article>
        }
      }
    </div>
  `,
})
export class LlmChatMessageListComponent {
  readonly messages = input<ChatMessage[]>([]);
}
