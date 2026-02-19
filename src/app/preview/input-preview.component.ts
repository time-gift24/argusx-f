import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgusxInputDirective } from '../shared/ui/input';

@Component({
  selector: 'app-input-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxInputDirective],
  template: `
    <div class="mx-auto max-w-6xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Input</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a form input field that allows users to enter text.
      </p>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
          </div>
          <div class="space-y-4 rounded-lg border border-dashed border-border p-6">
            <input argusxInput type="email" placeholder="Email" />
            <input argusxInput type="password" placeholder="Password" />
            <input argusxInput type="url" placeholder="https://example.com" />
          </div>
        </section>

        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">States</h2>
          </div>
          <div class="space-y-4 rounded-lg border border-dashed border-border p-6">
            <input argusxInput disabled type="email" placeholder="Disabled email" />
            <input argusxInput readonly type="text" value="Readonly value" />
            <input argusxInput aria-invalid="true" type="email" placeholder="Invalid email" />
          </div>
        </section>

        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">With Label</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="grid max-w-sm gap-3">
              <label class="text-sm font-medium" for="preview-email">Email</label>
              <input argusxInput id="preview-email" type="email" placeholder="name@example.com" />
            </div>
          </div>
        </section>

        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">File Input</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="grid max-w-sm gap-3">
              <label class="text-sm font-medium" for="preview-picture">Picture</label>
              <input argusxInput id="preview-picture" type="file" />
            </div>
          </div>
        </section>

        <section class="lg:col-span-2">
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Complex Form Combination</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <form class="grid gap-4 md:grid-cols-2" novalidate>
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="complex-username">Username</label>
                <input argusxInput id="complex-username" type="text" placeholder="peduarte" />
                <p class="text-xs text-muted-foreground">This is your public identifier.</p>
              </div>

              <div class="grid gap-2">
                <label class="text-sm font-medium" for="complex-email">Email</label>
                <input
                  argusxInput
                  id="complex-email"
                  type="email"
                  aria-invalid="true"
                  placeholder="account@example.com"
                  aria-describedby="complex-email-error"
                />
                <p id="complex-email-error" class="text-xs text-destructive">
                  Email already exists.
                </p>
              </div>

              <div class="grid gap-2">
                <label class="text-sm font-medium" for="complex-id">Workspace ID</label>
                <input argusxInput id="complex-id" type="text" value="ax-prod-001" readonly />
              </div>

              <div class="grid gap-2">
                <label class="text-sm font-medium" for="complex-api-key">API Key</label>
                <input argusxInput id="complex-api-key" type="text" disabled value="••••••••••••••••" />
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class InputPreviewComponent {}
