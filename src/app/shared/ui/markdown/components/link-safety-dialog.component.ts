import {
  ChangeDetectionStrategy,
  Component,
  signal,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'sd-link-safety-dialog',
  standalone: true,
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4 backdrop-blur-sm"
      (click)="cancel.emit()"
      (keydown.escape)="cancel.emit()"
      tabindex="0">
      <div
        class="relative flex w-full max-w-md flex-col gap-4 rounded-xl border bg-background p-6 shadow-lg"
        (click)="$event.stopPropagation()">
        <button
          type="button"
          class="absolute right-4 top-4 rounded-md border px-2 py-1 text-xs"
          (click)="cancel.emit()">
          Close
        </button>

        <div class="flex flex-col gap-1">
          <p class="font-semibold text-base">Open external link?</p>
          <p class="text-sm text-muted-foreground">
            You are about to visit an external website.
          </p>
        </div>

        <div class="max-h-40 overflow-auto break-all rounded border bg-muted/40 p-3 font-mono text-xs">
          {{ url() }}
        </div>

        <div class="flex gap-2">
          <button type="button" class="rounded border px-3 py-2 text-sm" (click)="copyUrl()">
            {{ copied() ? 'Copied' : 'Copy link' }}
          </button>
          <button type="button" class="rounded border px-3 py-2 text-sm" (click)="confirm.emit()">
            Open link
          </button>
          <button type="button" class="rounded border px-3 py-2 text-sm" (click)="cancel.emit()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkSafetyDialogComponent {
  readonly url = input.required<string>();
  readonly confirm = output<void>();
  readonly cancel = output<void>();
  readonly copied = signal(false);

  async copyUrl(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(this.url());
    this.copied.set(true);

    setTimeout(() => {
      this.copied.set(false);
    }, 2000);
  }
}
