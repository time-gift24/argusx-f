import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'sd-link-safety-dialog',
  standalone: true,
  template: `
    <div class="rounded border bg-background p-3">
      <p class="text-sm">Open external link?</p>
      <p class="text-xs">{{ url() }}</p>
      <div class="mt-2 flex gap-2">
        <button type="button" (click)="confirm.emit()">Open</button>
        <button type="button" (click)="cancel.emit()">Cancel</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkSafetyDialogComponent {
  readonly url = input.required<string>();
  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
