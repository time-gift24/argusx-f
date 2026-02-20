import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  InputGroupAddonComponent,
  InputGroupButtonComponent,
  InputGroupComponent,
  InputGroupInputComponent,
  InputGroupTextComponent,
  InputGroupTextareaComponent,
} from '@app/shared/ui/input-group';
import { ArgusxKbdDirective, ArgusxKbdGroupDirective } from '@app/shared/ui/kbd';
import { SpinnerComponent } from '@app/shared/ui/spinner';

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
    ArgusxKbdDirective,
    ArgusxKbdGroupDirective,
    SpinnerComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Input Group</h1>
      <p class="mb-8 text-muted-foreground">
        shadcn radix-mira baseline plus ArgusX plain extensions (size / disabled / loading).
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">shadcn Baseline: Inline Addons</h2>
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
          <h2 class="text-sm font-medium text-muted-foreground">shadcn Baseline: Addon + Button</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-input-group>
            <argusx-input-group-addon align="inline-start">
              <argusx-input-group-text>🔍</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-input [(value)]="keyword" placeholder="Search..." />
            <argusx-input-group-addon align="inline-end">
              <button argusxInputGroupButton variant="ghost" size="xs">Go</button>
            </argusx-input-group-addon>
          </argusx-input-group>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">shadcn Baseline: Block Align + Textarea</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-2">
          <argusx-input-group class="h-auto">
            <argusx-input-group-addon class="border-b">
              <argusx-input-group-text>notes.md</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-textarea
              [(value)]="message"
              [rows]="4"
              placeholder="Type your message..."
            />
            <argusx-input-group-addon class="border-t">
              <argusx-input-group-text>Line 1, Col 1</argusx-input-group-text>
              <button argusxInputGroupButton variant="secondary" size="sm" class="ml-auto">
                Run
              </button>
            </argusx-input-group-addon>
          </argusx-input-group>
          <p class="text-xs text-muted-foreground">Length: {{ message().length }}</p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">
            shadcn Preview Parity: With Kbd (item=kbd-example)
          </h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <argusx-input-group>
            <argusx-input-group-input id="input-kbd-22" placeholder="Search..." />
            <argusx-input-group-addon align="inline-end">
              <kbd argusx-kbd>⌘K</kbd>
            </argusx-input-group-addon>
          </argusx-input-group>

          <argusx-input-group>
            <argusx-input-group-input id="input-kbd-23" placeholder="Search..." />
            <argusx-input-group-addon align="inline-end">
              <kbd argusx-kbd>⌘K</kbd>
            </argusx-input-group-addon>
          </argusx-input-group>

          <argusx-input-group>
            <argusx-input-group-input id="input-search-apps-24" placeholder="Search for Apps..." />
            <argusx-input-group-addon align="inline-end">
              <argusx-input-group-text>Ask AI</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-addon align="inline-end">
              <kbd argusx-kbd>Tab</kbd>
            </argusx-input-group-addon>
          </argusx-input-group>

          <argusx-input-group>
            <argusx-input-group-input id="input-search-type-25" placeholder="Type to search..." />
            <argusx-input-group-addon align="inline-start">
              <argusx-input-group-text>✨</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-addon align="inline-end">
              <kbd argusx-kbd-group>
                <kbd argusx-kbd>Ctrl</kbd>
                <kbd argusx-kbd>C</kbd>
              </kbd>
            </argusx-input-group-addon>
          </argusx-input-group>

          <div class="space-y-1">
            <argusx-input-group>
              <argusx-input-group-input id="input-username-26" [(value)]="usernameValue" />
              <argusx-input-group-addon align="inline-end">
                <span class="flex size-4 items-center justify-center rounded-full bg-green-500 dark:bg-green-800 text-[10px] text-white">
                  ✓
                </span>
              </argusx-input-group-addon>
            </argusx-input-group>
            <p class="text-xs text-green-700">This username is available.</p>
          </div>

          <argusx-input-group>
            <argusx-input-group-input id="input-search-docs-27" placeholder="Search documentation..." />
            <argusx-input-group-addon>
              <argusx-input-group-text>🔍</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-addon align="inline-end">
              <argusx-input-group-text>12 results</argusx-input-group-text>
            </argusx-input-group-addon>
          </argusx-input-group>

          <argusx-input-group [disabled]="true">
            <argusx-input-group-input id="input-search-disabled-28" placeholder="Search documentation..." />
            <argusx-input-group-addon>
              <argusx-input-group-text>🔍</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-addon align="inline-end">
              <argusx-input-group-text>Disabled</argusx-input-group-text>
            </argusx-input-group-addon>
          </argusx-input-group>

          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <argusx-input-group>
              <argusx-input-group-input id="input-group-11" placeholder="First Name" />
              <argusx-input-group-addon align="inline-end">
                <argusx-input-group-text>ⓘ</argusx-input-group-text>
              </argusx-input-group-addon>
            </argusx-input-group>
            <argusx-input-group>
              <argusx-input-group-input id="input-group-12" placeholder="Last Name" />
              <argusx-input-group-addon align="inline-end">
                <argusx-input-group-text>ⓘ</argusx-input-group-text>
              </argusx-input-group-addon>
            </argusx-input-group>
          </div>

          <div class="space-y-1">
            <argusx-input-group [loading]="true">
              <argusx-input-group-input id="input-group-29" [(value)]="loadingKbdValue" />
              <argusx-input-group-addon align="inline-end">
                <app-spinner class="size-3.5" />
              </argusx-input-group-addon>
            </argusx-input-group>
            <p class="text-xs text-muted-foreground">Loading ("data-disabled=&quot;true&quot;")</p>
          </div>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">ArgusX Extension: Size</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <argusx-input-group size="sm">
            <argusx-input-group-addon align="inline-start">
              <argusx-input-group-text>SM</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-input [(value)]="smallValue" placeholder="Small size" />
          </argusx-input-group>

          <argusx-input-group size="default">
            <argusx-input-group-addon align="inline-start">
              <argusx-input-group-text>MD</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-input [(value)]="defaultValue" placeholder="Default size" />
          </argusx-input-group>

          <argusx-input-group size="lg">
            <argusx-input-group-addon align="inline-start">
              <argusx-input-group-text>LG</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-input [(value)]="largeValue" placeholder="Large size" />
          </argusx-input-group>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">ArgusX Extension: Disabled + Loading</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <argusx-input-group [disabled]="true">
            <argusx-input-group-addon align="inline-start">
              <argusx-input-group-text>🔒</argusx-input-group-text>
            </argusx-input-group-addon>
            <argusx-input-group-input [(value)]="disabledValue" placeholder="Disabled group" />
            <argusx-input-group-addon align="inline-end">
              <button argusxInputGroupButton variant="ghost" size="xs">Edit</button>
            </argusx-input-group-addon>
          </argusx-input-group>

          <argusx-input-group [loading]="true">
            <argusx-input-group-input [(value)]="loadingValue" placeholder="Loading state..." />
            <argusx-input-group-addon align="inline-end">
              <app-spinner class="size-3.5" />
            </argusx-input-group-addon>
          </argusx-input-group>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Complex Combination</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <argusx-input-group size="lg" [loading]="true" class="h-auto">
            <argusx-input-group-addon class="border-b">
              <argusx-input-group-text>Prompt</argusx-input-group-text>
              <button argusxInputGroupButton size="icon-xs" variant="ghost" class="ml-auto">
                +
              </button>
            </argusx-input-group-addon>
            <argusx-input-group-textarea
              [(value)]="complexPrompt"
              [rows]="3"
              placeholder="Ask anything..."
            />
            <argusx-input-group-addon class="border-t">
              <argusx-input-group-text>Auto-saving...</argusx-input-group-text>
              <button argusxInputGroupButton size="sm" variant="default" class="ml-auto">
                Send
              </button>
            </argusx-input-group-addon>
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
  readonly usernameValue = signal('shadcn');
  readonly smallValue = signal('');
  readonly defaultValue = signal('');
  readonly largeValue = signal('');
  readonly disabledValue = signal('readonly@argusx.dev');
  readonly loadingKbdValue = signal('shadcn');
  readonly loadingValue = signal('Searching component API...');
  readonly complexPrompt = signal('');
}
