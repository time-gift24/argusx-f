import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '../shared/ui/button';

@Component({
  selector: 'app-button-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `
    <div class="mx-auto max-w-6xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Button</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a button or a component that appears like a button.
      </p>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Variants -->
      <section>
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
      <section>
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
            <button argus-button [loading]="true">Loading</button>
          </div>
        </div>
      </section>

      <!-- Shape -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Shape</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <button argus-button shape="default">Default</button>
            <button argus-button shape="circle">
              <span class="i-lucide-circle"></span>
            </button>
            <button argus-button shape="square">Square</button>
          </div>
        </div>
      </section>

      <!-- With Icons -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Icons</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <button argus-button>
              <span class="i-lucide-square-and-arrow-up mr-1"></span>
              Submit
            </button>
            <button argus-button variant="outline">
              <span class="i-lucide-plus mr-1"></span>
              Add Item
            </button>
            <button argus-button variant="secondary">
              <span class="i-lucide-download mr-1"></span>
              Download
            </button>
          </div>
        </div>
      </section>

      <!-- All Sizes with Icons -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Icon Sizes</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap items-center gap-2">
            <button argus-button size="icon-xs">
              <span class="i-lucide-bell"></span>
            </button>
            <button argus-button size="icon-sm">
              <span class="i-lucide-bell"></span>
            </button>
            <button argus-button size="icon">
              <span class="i-lucide-bell"></span>
            </button>
            <button argus-button size="icon-lg">
              <span class="i-lucide-bell"></span>
            </button>
          </div>
        </div>
      </section>

      <!-- asChild Mode -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">asChild Mode</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <p class="text-sm text-muted-foreground mb-4">
            Use asChild to get button classes for manual application to other elements.
            Useful for composing with other components.
          </p>
          <div class="flex flex-wrap gap-2">
            <!-- Example: Using asChild to apply styles to a div -->
            <div class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs/relaxed font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/80 h-7 px-2 gap-1">
              asChild via getClasses()
            </div>
            <a href="#" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs/relaxed font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-border bg-background hover:bg-accent hover:text-accent-foreground h-7 px-2 gap-1">
              Link with button styles
            </a>
          </div>
        </div>
      </section>
      </div>
    </div>
  `,
})
export class ButtonPreviewComponent {}
