import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  InputGroupAddonComponent,
  InputGroupButtonComponent,
  InputGroupComponent,
  InputGroupInputComponent,
  InputGroupTextComponent,
  InputGroupTextareaComponent,
} from '@app/shared/ui/input-group';

@Component({
  selector: 'app-input-group-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputGroupComponent,
    InputGroupAddonComponent,
    InputGroupButtonComponent,
    InputGroupTextComponent,
    InputGroupInputComponent,
    InputGroupTextareaComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Input Group</h1>
      <p class="mb-8 text-muted-foreground">
        Group inputs with text, icons, and action buttons.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">URL Input</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <argusx-input-group>
            <argusx-input-group-addon align="inline-start">
              <argusx-input-group-text>https://</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-input [(value)]="website" placeholder="example" />
            <argusx-input-group-addon align="inline-end">
              <argusx-input-group-text>.com</argusx-input-group-text>
            </argusx-input-group-addon>
          </argusx-input-group>
          <p class="text-xs text-muted-foreground">Value: {{ website() }}.com</p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Search Input</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-input-group>
            <argusx-input-group-addon align="inline-start">
              <argusx-input-group-text>🔍</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-input [(value)]="keyword" placeholder="Search..." />
            <button argusxInputGroupButton variant="ghost" size="xs">Go</button>
          </argusx-input-group>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Textarea Group</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-input-group class="h-auto">
            <argusx-input-group-textarea
              [(value)]="message"
              [rows]="4"
              placeholder="Type your message..."
            />
          </argusx-input-group>
        </div>
      </section>
    </div>
  `,
})
export class InputGroupPreviewComponent {
  readonly website = signal('argusx');
  readonly keyword = signal('');
  readonly message = signal('');
}
