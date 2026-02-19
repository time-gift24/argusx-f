import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ChevronDown, ChevronRight, File, Folder, LucideAngularModule, Maximize, Minimize } from 'lucide-angular';

import { ArgusxButtonDirective } from '@app/shared/ui/button';
import {
  ArgusxCollapsibleComponent,
  ArgusxCollapsibleContentComponent,
  ArgusxCollapsibleTriggerDirective,
} from '@app/shared/ui/collapsible';
import { ArgusxInputDirective } from '@app/shared/ui/input';

@Component({
  selector: 'app-collapsible-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArgusxCollapsibleComponent,
    ArgusxCollapsibleTriggerDirective,
    ArgusxCollapsibleContentComponent,
    ArgusxButtonDirective,
    ArgusxInputDirective,
    LucideAngularModule,
  ],
  template: `
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-8 p-8">
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold">Collapsible</h1>
        <p class="text-sm text-muted-foreground">
          Shadcn-aligned root/trigger/content API with a plain-first ArgusX extension.
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">Shadcn Main Path: Controlled + asChild</h2>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-collapsible [(open)]="controlledOpen" (onOpenChange)="lastEmittedOpen.set($event)" class="w-full max-w-[360px]">
            <div class="flex items-center justify-between gap-4 px-1">
              <h4 class="text-sm font-semibold">@peduarte starred 3 repositories</h4>
              <button
                argusx-button
                argusxCollapsibleTrigger
                [argusxCollapsibleTriggerAsChild]="true"
                type="button"
                variant="ghost"
                size="icon"
                class="size-7"
              >
                <lucide-icon
                  [img]="chevronDownIcon"
                  class="inline-flex size-3.5 shrink-0 transition-transform duration-200"
                  [class.rotate-180]="controlledOpen()"
                ></lucide-icon>
                <span class="sr-only">Toggle</span>
              </button>
            </div>

            <div class="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>

            <argusx-collapsible-content class="flex flex-col gap-2 pt-1">
              <div class="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/colors</div>
              <div class="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>
            </argusx-collapsible-content>
          </argusx-collapsible>

          <p class="mt-4 text-xs text-muted-foreground">
            <code>onOpenChange</code> last value:
            {{ lastEmittedOpen() === null ? 'not emitted yet' : lastEmittedOpen() }}
          </p>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">Key States: defaultOpen + disabled</h2>
        <div class="grid gap-4 rounded-lg border border-dashed border-border p-6 md:grid-cols-2">
          <argusx-collapsible [defaultOpen]="true" class="w-full">
            <button
              argusxCollapsibleTrigger
              type="button"
              class="flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1.5 text-left text-sm font-medium hover:bg-muted/50"
            >
              <span>Default open section</span>
              <span>{{ 'open' }}</span>
            </button>
            <argusx-collapsible-content class="px-2 pb-2 text-sm text-muted-foreground">
              This section starts open via <code>defaultOpen</code> and can still be toggled.
            </argusx-collapsible-content>
          </argusx-collapsible>

          <argusx-collapsible [open]="true" [disabled]="true" class="w-full">
            <button
              argusxCollapsibleTrigger
              type="button"
              class="flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1.5 text-left text-sm font-medium"
            >
              <span>Disabled root (locked open)</span>
              <span>{{ 'locked' }}</span>
            </button>
            <argusx-collapsible-content class="px-2 pb-2 text-sm text-muted-foreground">
              Root-level <code>disabled</code> prevents all trigger toggles.
            </argusx-collapsible-content>
          </argusx-collapsible>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">ArgusX Plain Extension: argusxVariant</h2>
        <div class="grid gap-4 rounded-lg border border-dashed border-border p-6 md:grid-cols-2">
          <argusx-collapsible [defaultOpen]="true" argusxVariant="plain" class="w-full">
            <button
              argusxCollapsibleTrigger
              type="button"
              class="flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1.5 text-left text-sm font-medium hover:bg-muted/50"
            >
              <span>plain (default)</span>
              <span>{{ 'minimal' }}</span>
            </button>
            <argusx-collapsible-content class="px-2 pb-2 text-sm text-muted-foreground">
              Plain keeps the content visually neutral.
            </argusx-collapsible-content>
          </argusx-collapsible>

          <argusx-collapsible [defaultOpen]="true" argusxVariant="muted" class="w-full">
            <button
              argusxCollapsibleTrigger
              type="button"
              class="flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1.5 text-left text-sm font-medium hover:bg-muted/50"
            >
              <span>muted extension</span>
              <span>{{ 'plain + subtle shell' }}</span>
            </button>
            <argusx-collapsible-content class="pb-2 text-sm text-muted-foreground">
              Muted adds a light surface while keeping plain motion and spacing behavior.
            </argusx-collapsible-content>
          </argusx-collapsible>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">Mira Demo: File Tree</h2>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="mx-auto w-full max-w-sm rounded-lg border bg-card p-2.5">
            <div class="mb-2 inline-flex w-full rounded-md bg-muted p-0.5">
              <span class="flex-1 rounded-sm bg-background px-2 py-1 text-xs font-medium">Explorer</span>
              <span class="flex-1 px-2 py-1 text-xs text-muted-foreground">Outline</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <argusx-collapsible [(open)]="fileTreeComponentsOpen" class="gap-0.5">
                <button
                  argusx-button
                  argusxCollapsibleTrigger
                  [argusxCollapsibleTriggerAsChild]="true"
                  variant="ghost"
                  size="sm"
                  class="group w-full justify-start gap-1.5 px-1.5"
                >
                  <lucide-icon
                    [img]="chevronRightIcon"
                    class="inline-flex size-3 shrink-0 transition-transform"
                    [class.rotate-90]="fileTreeComponentsOpen()"
                  ></lucide-icon>
                  <lucide-icon [img]="folderIcon" class="inline-flex size-3.5 shrink-0"></lucide-icon>
                  <span>components</span>
                </button>
                <argusx-collapsible-content class="ml-4 flex flex-col gap-0.5">
                  <argusx-collapsible [(open)]="fileTreeUiOpen" class="gap-0.5">
                    <button
                      argusx-button
                      argusxCollapsibleTrigger
                      [argusxCollapsibleTriggerAsChild]="true"
                      variant="ghost"
                      size="sm"
                      class="w-full justify-start gap-1.5 px-1.5"
                    >
                      <lucide-icon
                        [img]="chevronRightIcon"
                        class="inline-flex size-3 shrink-0 transition-transform"
                        [class.rotate-90]="fileTreeUiOpen()"
                      ></lucide-icon>
                      <lucide-icon [img]="folderIcon" class="inline-flex size-3.5 shrink-0"></lucide-icon>
                      <span>ui</span>
                    </button>
                    <argusx-collapsible-content class="ml-4 flex flex-col gap-0.5">
                      @for (name of uiFiles; track name) {
                        <button
                          argusx-button
                          variant="link"
                          size="sm"
                          class="w-full justify-start gap-1.5 px-1.5"
                        >
                          <lucide-icon [img]="fileIcon" class="inline-flex size-3.5 shrink-0"></lucide-icon>
                          <span>{{ name }}</span>
                        </button>
                      }
                    </argusx-collapsible-content>
                  </argusx-collapsible>

                  <button argusx-button variant="link" size="sm" class="w-full justify-start gap-1.5 px-1.5">
                    <lucide-icon [img]="fileIcon" class="inline-flex size-3.5 shrink-0"></lucide-icon>
                    <span>login-form.tsx</span>
                  </button>
                  <button
                    argusx-button
                    variant="link"
                    size="sm"
                    class="w-full justify-start gap-1.5 px-1.5"
                  >
                    <lucide-icon [img]="fileIcon" class="inline-flex size-3.5 shrink-0"></lucide-icon>
                    <span>register-form.tsx</span>
                  </button>
                </argusx-collapsible-content>
              </argusx-collapsible>

              <argusx-collapsible [(open)]="fileTreeLibOpen" class="gap-0.5">
                <button
                  argusx-button
                  argusxCollapsibleTrigger
                  [argusxCollapsibleTriggerAsChild]="true"
                  variant="ghost"
                  size="sm"
                  class="w-full justify-start gap-1.5 px-1.5"
                >
                  <lucide-icon
                    [img]="chevronRightIcon"
                    class="inline-flex size-3 shrink-0 transition-transform"
                    [class.rotate-90]="fileTreeLibOpen()"
                  ></lucide-icon>
                  <lucide-icon [img]="folderIcon" class="inline-flex size-3.5 shrink-0"></lucide-icon>
                  <span>lib</span>
                </button>
                <argusx-collapsible-content class="ml-4 flex flex-col gap-0.5">
                  @for (name of libFiles; track name) {
                    <button
                      argusx-button
                      variant="link"
                      size="sm"
                      class="w-full justify-start gap-1.5 px-1.5"
                    >
                      <lucide-icon [img]="fileIcon" class="inline-flex size-3.5 shrink-0"></lucide-icon>
                      <span>{{ name }}</span>
                    </button>
                  }
                </argusx-collapsible-content>
              </argusx-collapsible>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">Mira Demo: Settings</h2>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="mx-auto w-full max-w-sm rounded-lg border bg-card p-4">
            <div class="mb-3 space-y-1">
              <h3 class="text-sm font-semibold">Radius</h3>
              <p class="text-xs text-muted-foreground">Set the corner radius of the element.</p>
            </div>

            <argusx-collapsible [(open)]="settingsOpen" class="w-full items-stretch">
              <div class="grid w-full grid-cols-2 gap-2">
                <input argusxInput placeholder="0" value="0" />
                <input argusxInput placeholder="0" value="0" />
              </div>

              <argusx-collapsible-content class="w-full self-stretch">
                <div class="grid w-full grid-cols-2 gap-2 pt-2">
                  <input argusxInput placeholder="0" value="0" />
                  <input argusxInput placeholder="0" value="0" />
                </div>
              </argusx-collapsible-content>

              <button
                argusx-button
                argusxCollapsibleTrigger
                [argusxCollapsibleTriggerAsChild]="true"
                type="button"
                variant="outline"
                size="icon"
                class="size-7 shrink-0"
              >
                @if (settingsOpen()) {
                  <lucide-icon [img]="minimizeIcon" class="inline-flex size-3.5 shrink-0"></lucide-icon>
                } @else {
                  <lucide-icon [img]="maximizeIcon" class="inline-flex size-3.5 shrink-0"></lucide-icon>
                }
                <span class="sr-only">Toggle settings</span>
              </button>
            </argusx-collapsible>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">Complex Combination</h2>
        <div class="space-y-3 rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap items-center gap-2">
            <button
              argusx-button
              type="button"
              variant="outline"
              size="sm"
              (click)="toggleComplexLock()"
            >
              {{ complexLocked() ? 'Unlock' : 'Lock' }} trigger
            </button>
            <span class="text-xs text-muted-foreground">
              disabled={{ complexLocked() }}, open={{ complexOpen() }}, events={{ complexEvents() }}
            </span>
          </div>

          <argusx-collapsible
            [(open)]="complexOpen"
            [disabled]="complexLocked()"
            argusxVariant="muted"
            (onOpenChange)="onComplexOpenChange()"
            class="w-full max-w-xl"
          >
            <button
              argusx-button
              argusxCollapsibleTrigger
              [argusxCollapsibleTriggerAsChild]="true"
              type="button"
              variant="outline"
              size="sm"
              class="w-full justify-between"
            >
              <span>Deployment summary</span>
              <lucide-icon
                [img]="chevronDownIcon"
                class="inline-flex size-3.5 shrink-0 transition-transform duration-200"
                [class.rotate-180]="complexOpen()"
              ></lucide-icon>
            </button>
            <argusx-collapsible-content class="mt-2 text-sm text-muted-foreground">
              <ul class="list-disc space-y-1 pl-5">
                <li>Controlled open state with two-way binding.</li>
                <li>Trigger rendered as child button using <code>asChild</code>.</li>
                <li>Muted variant extension + runtime disabled lock.</li>
              </ul>
            </argusx-collapsible-content>
          </argusx-collapsible>
        </div>
      </section>
    </div>
  `,
})
export class CollapsiblePreviewComponent {
  readonly chevronDownIcon = ChevronDown;
  readonly chevronRightIcon = ChevronRight;
  readonly fileIcon = File;
  readonly folderIcon = Folder;
  readonly minimizeIcon = Minimize;
  readonly maximizeIcon = Maximize;

  readonly uiFiles = ['button.tsx', 'card.tsx', 'dialog.tsx', 'input.tsx', 'select.tsx', 'table.tsx'];
  readonly libFiles = ['utils.ts', 'cn.ts', 'api.ts'];

  readonly controlledOpen = signal(false);
  readonly lastEmittedOpen = signal<boolean | null>(null);

  readonly fileTreeComponentsOpen = signal(true);
  readonly fileTreeUiOpen = signal(true);
  readonly fileTreeLibOpen = signal(false);
  readonly settingsOpen = signal(false);

  readonly complexOpen = signal(true);
  readonly complexLocked = signal(false);
  readonly complexEvents = signal(0);

  toggleComplexLock(): void {
    this.complexLocked.update((value) => !value);
  }

  onComplexOpenChange(): void {
    this.complexEvents.update((value) => value + 1);
  }
}
