import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArgusxButtonDirective } from '@app/shared/ui/button';
import { ArgusxButtonGroupComponents } from '@app/shared/ui/button-group';
import { ArgusxDropdownMenuComponents } from '@app/shared/ui/dropdown-menu';
import { ArgusxInputDirective } from '@app/shared/ui/input';
import { LabelDirective } from '@app/shared/ui/label';
import {
  SelectComponent,
  SelectGroupComponent,
  SelectItemComponent,
  SelectValueComponent,
} from '@app/shared/ui/select';

@Component({
  selector: 'app-button-group-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArgusxButtonGroupComponents,
    ArgusxButtonDirective,
    ArgusxDropdownMenuComponents,
    ArgusxInputDirective,
    LabelDirective,
    SelectComponent,
    SelectGroupComponent,
    SelectItemComponent,
    SelectValueComponent,
  ],
  template: `
    <div class="mx-auto max-w-5xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Button Group</h1>
      <p class="mb-8 text-muted-foreground">
        Shadcn parity check for
        <span class="font-medium">radix / mira / button-group-example</span>
        plus ArgusX plain extension coverage.
      </p>

      <div class="space-y-8">
        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">Basic (shadcn)</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <argusx-button-group>
              <button argusx-button variant="outline">Button</button>
              <button argusx-button variant="outline">Another Button</button>
            </argusx-button-group>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">With Input (shadcn)</h2>
          </div>
          <div class="grid gap-4 rounded-lg border border-dashed border-border p-6 md:grid-cols-2">
            <div class="space-y-2">
              <p class="text-[11px] text-muted-foreground">button + input</p>
              <argusx-button-group>
                <button argusx-button variant="outline">Button</button>
                <input argusxInput placeholder="Type something here..." />
              </argusx-button-group>
            </div>
            <div class="space-y-2">
              <p class="text-[11px] text-muted-foreground">input + button</p>
              <argusx-button-group>
                <input argusxInput placeholder="Type something here..." />
                <button argusx-button variant="outline">Button</button>
              </argusx-button-group>
            </div>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">With Text + asChild (shadcn)</h2>
          </div>
          <div class="grid gap-4 rounded-lg border border-dashed border-border p-6 md:grid-cols-2">
            <div class="space-y-2">
              <p class="text-[11px] text-muted-foreground">plain text slot</p>
              <argusx-button-group>
                <argusx-button-group-text>Text</argusx-button-group-text>
                <button argusx-button variant="outline">Another Button</button>
              </argusx-button-group>
            </div>
            <div class="space-y-2">
              <p class="text-[11px] text-muted-foreground">asChild + label</p>
              <argusx-button-group>
                <argusx-button-group-text asChild>
                  <label appLabel for="gpu-size" class="m-0">GPU Size</label>
                </argusx-button-group-text>
                <input id="gpu-size" argusxInput placeholder="Type something here..." />
              </argusx-button-group>
            </div>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">With Dropdown (shadcn)</h2>
          </div>
          <div class="grid gap-4 rounded-lg border border-dashed border-border p-6 md:grid-cols-2">
            <argusx-button-group>
              <button argusx-button variant="outline">Update</button>
              <argusx-dropdown-menu>
                <button argusx-button variant="outline" size="icon" argusxDropdownMenuTrigger>
                  v
                </button>
                <argusx-dropdown-menu-content align="end">
                  <argusx-dropdown-menu-item>Disable</argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-item variant="destructive">
                    Uninstall
                  </argusx-dropdown-menu-item>
                </argusx-dropdown-menu-content>
              </argusx-dropdown-menu>
            </argusx-button-group>

            <argusx-button-group>
              <button argusx-button variant="outline">Follow</button>
              <argusx-dropdown-menu>
                <button argusx-button variant="outline" size="icon" argusxDropdownMenuTrigger>
                  ...
                </button>
                <argusx-dropdown-menu-content align="end">
                  <argusx-dropdown-menu-item>Mute conversation</argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-item>Mark as read</argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-separator />
                  <argusx-dropdown-menu-item variant="destructive">
                    Delete conversation
                  </argusx-dropdown-menu-item>
                </argusx-dropdown-menu-content>
              </argusx-dropdown-menu>
            </argusx-button-group>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">With Separator (shadcn)</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <argusx-button-group>
              <button argusx-button variant="secondary" size="sm">Copy</button>
              <argusx-button-group-separator />
              <button argusx-button variant="secondary" size="sm">Paste</button>
            </argusx-button-group>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">With Select + Input (shadcn)</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <argusx-button-group>
              <app-select [(value)]="durationUnit">
                <app-select-value>{{ selectLabel(durationOptions, durationUnit(), 'Unit') }}</app-select-value>
                <app-select-group>
                  @for (option of durationOptions; track option.value) {
                    <app-select-item [value]="option.value">{{ option.label }}</app-select-item>
                  }
                </app-select-group>
              </app-select>
              <input argusxInput placeholder="Enter duration" />
            </argusx-button-group>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">Nested + Pagination (shadcn)</h2>
          </div>
          <div class="space-y-4 rounded-lg border border-dashed border-border p-6">
            <argusx-button-group>
              <argusx-button-group>
                <button argusx-button variant="outline" size="icon">+</button>
              </argusx-button-group>
              <argusx-button-group>
                <input argusxInput placeholder="Send a message..." class="w-[220px]" />
                <button argusx-button variant="outline" size="icon">Mic</button>
              </argusx-button-group>
            </argusx-button-group>

            <argusx-button-group>
              <button argusx-button variant="outline" size="sm">Previous</button>
              <button argusx-button variant="outline" size="sm">1</button>
              <button argusx-button variant="outline" size="sm">2</button>
              <button argusx-button variant="outline" size="sm">3</button>
              <button argusx-button variant="outline" size="sm">Next</button>
            </argusx-button-group>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">Vertical + Vertical Nested (shadcn)</h2>
          </div>
          <div class="grid gap-6 rounded-lg border border-dashed border-border p-6 md:grid-cols-2">
            <argusx-button-group orientation="vertical" aria-label="Media controls" class="h-fit">
              <button argusx-button variant="outline" size="icon">+</button>
              <button argusx-button variant="outline" size="icon">-</button>
            </argusx-button-group>

            <argusx-button-group orientation="vertical" aria-label="Design tools palette">
              <argusx-button-group orientation="vertical">
                <button argusx-button variant="outline">Search</button>
                <button argusx-button variant="outline">Copy</button>
                <button argusx-button variant="outline">Share</button>
              </argusx-button-group>
              <argusx-button-group orientation="vertical">
                <button argusx-button variant="outline">Flip H</button>
                <button argusx-button variant="outline">Flip V</button>
                <button argusx-button variant="outline">Rotate</button>
              </argusx-button-group>
              <argusx-button-group>
                <button argusx-button variant="outline">Delete</button>
              </argusx-button-group>
            </argusx-button-group>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">
              ArgusX Plain Extension Check (non-conflict)
            </h2>
          </div>
          <div class="grid items-start gap-4 rounded-lg border border-dashed border-border p-6 md:grid-cols-2">
            <argusx-button-group>
              <span argusxButtonGroupText>Status</span>
              <button argusx-button variant="outline">Draft</button>
              <button argusx-button variant="outline">Published</button>
            </argusx-button-group>
            <argusx-button-group orientation="vertical" class="h-fit">
              <button argusx-button variant="outline" size="icon">+</button>
              <argusx-button-group-separator autoOrientation />
              <button argusx-button variant="outline" size="icon">-</button>
            </argusx-button-group>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class ButtonGroupPreviewComponent {
  readonly durationOptions = [
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
  ] as const;

  readonly durationUnit = signal<string | undefined>('hours');

  selectLabel(
    options: readonly { value: string; label: string }[],
    value: string | undefined,
    fallback: string
  ): string {
    const option = options.find((item) => item.value === value);
    return option?.label ?? fallback;
  }
}
