import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  ArrowUpIcon,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'app-llm-chat-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  styles: [`
    :host {
      display: block;
    }
  `],
  template: `
    <div class="relative px-3.5 pt-2.5 pb-8 md:px-4 md:pt-3 md:pb-8">
      <textarea
        [value]="value()"
        rows="1"
        placeholder="Ask for follow-up changes"
        class="relative z-10 min-h-[38px] w-full resize-none bg-transparent pr-11 text-[12.5px]/[1.45] text-foreground/80 caret-primary/85 outline-none placeholder:text-foreground/40"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
      ></textarea>

      <button
        type="button"
        [disabled]="sendDisabled()"
        data-testid="composer-send"
        class="absolute right-2.5 bottom-1.5 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground/24 text-foreground transition-colors hover:bg-foreground/35 disabled:cursor-not-allowed disabled:opacity-40"
        (click)="send.emit()"
        aria-label="发送"
      >
        <lucide-icon [img]="arrowUpIcon" class="size-3.5" />
      </button>
    </div>
  `,
})
export class LlmChatComposerComponent {
  readonly value = input<string>('');
  readonly sendDisabled = input<boolean>(false);

  readonly valueChange = output<string>();
  readonly send = output<void>();
  protected readonly arrowUpIcon = ArrowUpIcon;

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.valueChange.emit(target.value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (this.sendDisabled()) {
      return;
    }

    this.send.emit();
  }
}
