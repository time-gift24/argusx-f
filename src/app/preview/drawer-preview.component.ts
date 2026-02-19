import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArgusxButtonDirective } from '@app/shared/ui/button';
import {
  ArgusxDrawerComponents,
  type ArgusxDrawerDirection,
  type ArgusxDrawerSize,
} from '@app/shared/ui/drawer';

@Component({
  selector: 'app-drawer-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxDrawerComponents, ArgusxButtonDirective],
  template: `
    <div class="mx-auto max-w-3xl space-y-8 p-8">
      <h1 class="mb-2 text-2xl font-semibold">Drawer</h1>
      <p class="mb-8 text-muted-foreground">
        shadcn-aligned drawer primitives with ArgusX plain extensions.
      </p>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">shadcn Baseline</h2>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-drawer>
            <button argusx-button variant="outline" argusxDrawerTrigger>
              Open Drawer
            </button>
            <argusx-drawer-content>
              <div class="mx-auto w-full max-w-sm">
                <argusx-drawer-header>
                  <argusx-drawer-title>Move Goal</argusx-drawer-title>
                  <argusx-drawer-description>
                    Set your daily activity goal.
                  </argusx-drawer-description>
                </argusx-drawer-header>
                <div class="space-y-2 px-4 pb-2 text-sm text-muted-foreground">
                  <p>Default usage keeps the same slot structure as shadcn drawer.</p>
                  <p>Close behavior is explicit through <code>argusxDrawerClose</code>.</p>
                </div>
                <argusx-drawer-footer>
                  <button argusx-button>Submit</button>
                  <button argusx-button variant="outline" argusxDrawerClose>Cancel</button>
                </argusx-drawer-footer>
              </div>
            </argusx-drawer-content>
          </argusx-drawer>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">Direction (shadcn API)</h2>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="flex flex-wrap gap-2">
            @for (dir of directions; track dir) {
              <button
                argusx-button
                variant="outline"
                size="sm"
                [class.bg-muted]="direction() === dir"
                (click)="direction.set(dir)"
              >
                {{ dir }}
              </button>
            }
          </div>
          <argusx-drawer [direction]="direction()">
            <button argusx-button variant="outline" argusxDrawerTrigger>
              Open {{ direction() }} Drawer
            </button>
            <argusx-drawer-content>
              <argusx-drawer-header>
                <argusx-drawer-title>Drawer Direction</argusx-drawer-title>
                <argusx-drawer-description>
                  The current direction is <strong>{{ direction() }}</strong>.
                </argusx-drawer-description>
              </argusx-drawer-header>
              <argusx-drawer-footer>
                <button argusx-button variant="outline" argusxDrawerClose>Close</button>
              </argusx-drawer-footer>
            </argusx-drawer-content>
          </argusx-drawer>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">ArgusX Plain Extension: size + close button</h2>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="flex flex-wrap gap-2">
            @for (size of sizes; track size) {
              <button
                argusx-button
                variant="outline"
                size="sm"
                [class.bg-muted]="extensionSize() === size"
                (click)="extensionSize.set(size)"
              >
                {{ size }}
              </button>
            }
          </div>
          <argusx-drawer direction="right" [size]="extensionSize()">
            <button argusx-button variant="outline" argusxDrawerTrigger>
              Open Sized Drawer
            </button>
            <argusx-drawer-content [showCloseButton]="true">
              <argusx-drawer-header>
                <argusx-drawer-title>Plain Extension</argusx-drawer-title>
                <argusx-drawer-description>
                  Current size extension: <strong>{{ extensionSize() }}</strong>
                </argusx-drawer-description>
              </argusx-drawer-header>
              <div class="space-y-2 px-4 text-sm text-muted-foreground">
                <p>ArgusX keeps shadcn default behavior and extends with optional sizing.</p>
                <p>The top-right close button is also optional and defaults to hidden.</p>
              </div>
              <argusx-drawer-footer>
                <button argusx-button variant="outline" argusxDrawerClose>Done</button>
              </argusx-drawer-footer>
            </argusx-drawer-content>
          </argusx-drawer>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">Complex Combination</h2>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="flex flex-wrap gap-2">
            <button argusx-button variant="outline" size="sm" (click)="complexOpen.set(true)">
              Programmatic Open
            </button>
            <button
              argusx-button
              variant="outline"
              size="sm"
              (click)="complexOpen.set(false)"
              [disabled]="!complexOpen()"
            >
              Programmatic Close
            </button>
          </div>
          <argusx-drawer
            [open]="complexOpen()"
            (openChange)="complexOpen.set($event)"
            [direction]="direction()"
            [size]="extensionSize()"
            [dismissible]="false"
            [shouldScaleBackground]="true"
          >
            <button argusx-button argusxDrawerTrigger>Open Combined Drawer</button>
            <argusx-drawer-content [showCloseButton]="true">
              <argusx-drawer-header>
                <argusx-drawer-title>Controlled Drawer</argusx-drawer-title>
                <argusx-drawer-description>
                  Controlled open state + direction + size + non-dismissible backdrop.
                </argusx-drawer-description>
              </argusx-drawer-header>
              <div class="space-y-2 px-4 text-sm text-muted-foreground">
                <p>Backdrop and Escape are disabled in this state.</p>
                <p>Use explicit close actions to dismiss.</p>
              </div>
              <argusx-drawer-footer>
                <button argusx-button variant="outline" (click)="complexOpen.set(false)">
                  Close via Signal
                </button>
                <button argusx-button argusxDrawerClose>Close via Directive</button>
              </argusx-drawer-footer>
            </argusx-drawer-content>
          </argusx-drawer>
        </div>
      </section>
    </div>
  `,
})
export class DrawerPreviewComponent {
  readonly directions = ['top', 'right', 'bottom', 'left'] as const;
  readonly sizes = ['sm', 'default', 'lg', 'full'] as const;

  readonly direction = signal<ArgusxDrawerDirection>('right');
  readonly extensionSize = signal<ArgusxDrawerSize>('default');
  readonly complexOpen = signal(false);
}
