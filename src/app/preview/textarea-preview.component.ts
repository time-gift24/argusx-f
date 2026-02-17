import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextareaComponent } from '@app/shared/ui/textarea';

@Component({
  selector: 'app-textarea-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextareaComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Textarea</h1>
      <p class="mb-8 text-muted-foreground">
        Multi-line text input with status styles for validation and feedback.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <app-textarea
            [(value)]="note"
            [rows]="4"
            class="min-h-28"
            placeholder="Type your message here."
          />
          <p class="text-xs text-muted-foreground">{{ note().length }} characters</p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Statuses</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <app-textarea [rows]="3" status="error" placeholder="Error status" />
          <app-textarea [rows]="3" status="warning" placeholder="Warning status" />
          <app-textarea [rows]="3" status="success" placeholder="Success status" />
          <app-textarea [rows]="3" [disabled]="true" [value]="disabledValue()" />
        </div>
      </section>
    </div>
  `,
})
export class TextareaPreviewComponent {
  readonly note = signal('Please review the migration checklist before shipping.');
  readonly disabledValue = signal('Readonly archived note');
}
