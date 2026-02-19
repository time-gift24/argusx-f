import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CheckIcon,
  CircleIcon,
  Download,
  LoaderCircle,
  LucideAngularModule,
  Plus,
  SquareArrowUp,
  Link2,
} from 'lucide-angular';
import { ArgusxButtonDirective } from '../shared/ui/button';

@Component({
  selector: 'app-button-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxButtonDirective, LucideAngularModule],
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
            <button argusx-button variant="default">Default</button>
            <button argusx-button variant="destructive">Destructive</button>
            <button argusx-button variant="outline">Outline</button>
            <button argusx-button variant="secondary">Secondary</button>
            <button argusx-button variant="ghost">Ghost</button>
            <button argusx-button variant="link">Link</button>
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
            <button argusx-button size="xs">Extra Small</button>
            <button argusx-button size="sm">Small</button>
            <button argusx-button size="default">Default</button>
            <button argusx-button size="lg">Large</button>
            <button argusx-button size="icon">
              <lucide-icon [img]="squareIcon" class="size-4"></lucide-icon>
            </button>
            <button argusx-button size="icon-xs">
              <lucide-icon [img]="squareIcon" class="size-3"></lucide-icon>
            </button>
            <button argusx-button size="icon-sm">
              <lucide-icon [img]="squareIcon" class="size-3.5"></lucide-icon>
            </button>
            <button argusx-button size="icon-lg">
              <lucide-icon [img]="squareIcon" class="size-5"></lucide-icon>
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
            <button argusx-button>Enabled</button>
            <button argusx-button disabled>Disabled</button>
            <button argusx-button [loading]="true">Loading</button>
          </div>
        </div>
      </section>

      <!-- Loading (shadcn style) -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Loading (shadcn Style)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <button argusx-button size="sm" variant="outline" disabled>
              <lucide-icon [img]="loaderIcon" class="size-4 animate-spin"></lucide-icon>
              Submit
            </button>
            <button argusx-button size="sm" variant="outline" [loading]="true">
              <lucide-icon [img]="loaderIcon" class="size-4 animate-spin"></lucide-icon>
              Syncing
            </button>
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
            <button argusx-button shape="default">Default</button>
            <button argusx-button shape="circle">
              <lucide-icon [img]="circleIcon" class="size-4"></lucide-icon>
            </button>
            <button argusx-button shape="square">Square</button>
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
            <button argusx-button>
              <lucide-icon [img]="squareIcon" class="size-4 mr-1"></lucide-icon>
              Submit
            </button>
            <button argusx-button variant="outline">
              <lucide-icon [img]="plusIcon" class="size-4 mr-1"></lucide-icon>
              Add Item
            </button>
            <button argusx-button variant="secondary">
              <lucide-icon [img]="downloadIcon" class="size-4 mr-1"></lucide-icon>
              Download
            </button>
          </div>
        </div>
      </section>

      <!-- Full Width (zard extension) -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Full Width (zard Extension)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-md gap-2">
            <button argusx-button full>Continue</button>
            <button argusx-button full variant="outline">Cancel</button>
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
            <button argusx-button size="icon-xs">
              <lucide-icon [img]="checkIcon" class="size-3"></lucide-icon>
            </button>
            <button argusx-button size="icon-sm">
              <lucide-icon [img]="checkIcon" class="size-3.5"></lucide-icon>
            </button>
            <button argusx-button size="icon">
              <lucide-icon [img]="checkIcon" class="size-4"></lucide-icon>
            </button>
            <button argusx-button size="icon-lg">
              <lucide-icon [img]="checkIcon" class="size-5"></lucide-icon>
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
            <button
              argusx-button
              asChild
              variant="outline"
              size="sm"
              #linkButton="argusxButton"
              class="hidden"
            ></button>
            <a href="#" (click)="$event.preventDefault()" [class]="linkButton.getClasses()">
              <lucide-icon [img]="linkIcon" class="size-4"></lucide-icon>
              Rendered via getClasses()
            </a>
          </div>
        </div>
      </section>
      </div>
    </div>
  `,
})
export class ButtonPreviewComponent {
  protected readonly squareIcon = SquareArrowUp;
  protected readonly plusIcon = Plus;
  protected readonly downloadIcon = Download;
  protected readonly checkIcon = CheckIcon;
  protected readonly circleIcon = CircleIcon;
  protected readonly loaderIcon = LoaderCircle;
  protected readonly linkIcon = Link2;
}
