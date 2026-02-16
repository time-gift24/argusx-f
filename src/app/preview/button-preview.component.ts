import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '../shared/ui/button';

@Component({
  selector: 'app-button-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Button</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a button or a component that appears like a button.
      </p>

      <!-- Variants -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Variants</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <button argus-button variant="default">Default</button>
            <button argus-button variant="destructive">Destructive</button>
            <button argus-button variant="outline">Outline</button>
            <button argus-button variant="secondary">Secondary</button>
            <button argus-button variant="ghost">Ghost</button>
            <button argus-button variant="link">Link</button>
          </div>
        </div>
      </section>

      <!-- Sizes -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Sizes</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap items-center gap-2">
            <button argus-button size="xs">Extra Small</button>
            <button argus-button size="sm">Small</button>
            <button argus-button size="default">Default</button>
            <button argus-button size="lg">Large</button>
            <button argus-button size="icon">
              <span class="i-lucide-square-and-arrow-up"></span>
            </button>
            <button argus-button size="icon-xs">
              <span class="i-lucide-square-and-arrow-up"></span>
            </button>
            <button argus-button size="icon-sm">
              <span class="i-lucide-square-and-arrow-up"></span>
            </button>
            <button argus-button size="icon-lg">
              <span class="i-lucide-square-and-arrow-up"></span>
            </button>
          </div>
        </div>
      </section>

      <!-- States -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">States</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <button argus-button>Enabled</button>
            <button argus-button disabled>Disabled</button>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class ButtonPreviewComponent {}
