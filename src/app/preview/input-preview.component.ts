import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputDirective } from '../shared/ui/input';

@Component({
  selector: 'app-input-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputDirective],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Input</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a form input field that allows users to enter text.
      </p>

      <!-- Types -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Types</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="input-text">Text</label>
            <input appInput type="text" id="input-text" placeholder="Enter your name" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="input-email">Email</label>
            <input appInput type="email" id="input-email" placeholder="email@example.com" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="input-password">Password</label>
            <input appInput type="password" id="input-password" placeholder="Enter your password" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="input-number">Number</label>
            <input appInput type="number" id="input-number" placeholder="123" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="input-tel">Telephone</label>
            <input appInput type="tel" id="input-tel" placeholder="+1 (555) 000-0000" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="input-url">URL</label>
            <input appInput type="url" id="input-url" placeholder="https://example.com" />
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
            <label class="text-sm font-medium" for="input-disabled">Disabled</label>
            <input
              appInput
              type="text"
              id="input-disabled"
              placeholder="Disabled input"
              disabled
            />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="input-readonly">Readonly</label>
            <input
              appInput
              type="text"
              id="input-readonly"
              value="Readonly value"
              readonly
            />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium" for="input-invalid">Invalid</label>
            <input
              appInput
              type="email"
              id="input-invalid"
              placeholder="Invalid email"
              aria-invalid="true"
            />
          </div>
        </div>
      </section>

      <!-- With Labels -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Labels</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid gap-4 max-w-sm">
            <div class="grid gap-2">
              <label class="text-sm font-medium" for="input-username">Username</label>
              <input
                appInput
                type="text"
                id="input-username"
                placeholder="Enter your username"
              />
              <p class="text-xs text-muted-foreground">This is your public display name.</p>
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium" for="input-email-labeled">Email</label>
              <input
                appInput
                type="email"
                id="input-email-labeled"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- File Input -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">File Input</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <input appInput type="file" id="input-file" />
        </div>
      </section>
    </div>
  `,
})
export class InputPreviewComponent {}
