import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextareaComponent } from '../../shared/ui/textarea';

@Component({
  selector: 'app-textarea-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextareaComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Textarea</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a form textarea that allows users to enter multi-line text.
      </p>

      <!-- Basic -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Basic</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <app-textarea placeholder="Type your message here."></app-textarea>
        </div>
      </section>

      <!-- With Label -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Label</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="textarea-message">Message</label>
            <app-textarea id="textarea-message" placeholder="Type your message here."></app-textarea>
          </div>
        </div>
      </section>

      <!-- With Description -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Description</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="textarea-description">Message</label>
            <app-textarea
              id="textarea-description"
              placeholder="Type your message here."
            ></app-textarea>
            <p class="text-xs text-muted-foreground">Type your message and press enter to send.</p>
          </div>
        </div>
      </section>

      <!-- States -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">States</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="textarea-disabled">Disabled</label>
            <app-textarea
              id="textarea-disabled"
              placeholder="Disabled textarea"
              [disabled]="true"
            ></app-textarea>
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="textarea-readonly">Readonly</label>
            <app-textarea
              id="textarea-readonly"
              value="Readonly value"
              [readonly]="true"
            ></app-textarea>
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="textarea-invalid">Invalid</label>
            <app-textarea
              id="textarea-invalid"
              placeholder="Invalid textarea"
              status="error"
              aria-invalid="true"
            ></app-textarea>
          </div>
        </div>
      </section>

      <!-- Rows -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Rows</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="textarea-rows-3">3 Rows</label>
            <app-textarea id="textarea-rows-3" [rows]="3" placeholder="3 rows"></app-textarea>
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="textarea-rows-6">6 Rows</label>
            <app-textarea id="textarea-rows-6" [rows]="6" placeholder="6 rows"></app-textarea>
          </div>
        </div>
      </section>

      <!-- Two Way Binding -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Two Way Binding</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="textarea-binding">Bindable Textarea</label>
            <app-textarea
              id="textarea-binding"
              placeholder="Type something..."
              [(value)]="bindingValue"
            ></app-textarea>
            <p class="text-xs text-muted-foreground">Current value: {{ bindingValue }}</p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class TextareaPreviewComponent {
  bindingValue = '';
}
