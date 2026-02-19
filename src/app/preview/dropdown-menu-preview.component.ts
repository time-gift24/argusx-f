import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@app/shared/ui/button';
import { ArgusxDropdownMenuComponents } from '@app/shared/ui/dropdown-menu';

@Component({
  selector: 'app-dropdown-menu-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxDropdownMenuComponents, ButtonComponent],
  template: `
    <div class="bg-background w-full">
      <div class="mx-auto grid w-full max-w-5xl min-w-0 content-start gap-8 p-4 sm:p-6 md:grid-cols-2 lg:p-12">
        <section class="md:col-span-2">
          <h1 class="mb-2 text-2xl font-semibold">Dropdown Menu</h1>
          <p class="text-muted-foreground text-sm">
            Contextual overlays for actions, shortcuts, nested menus, and toggles.
          </p>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Basic</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-4 border border-dashed p-4 sm:p-6">
            <argusx-dropdown-menu>
              <button argus-button variant="outline" argusxDropdownMenuTrigger>
                Open Menu
              </button>
              <argusx-dropdown-menu-content>
                <argusx-dropdown-menu-label>My Account</argusx-dropdown-menu-label>
                <argusx-dropdown-menu-separator />
                <argusx-dropdown-menu-item>Profile</argusx-dropdown-menu-item>
                <argusx-dropdown-menu-item>Billing</argusx-dropdown-menu-item>
                <argusx-dropdown-menu-item>Keyboard Shortcuts</argusx-dropdown-menu-item>
                <argusx-dropdown-menu-separator />
                <argusx-dropdown-menu-checkbox-item
                  [checked]="bookmarked()"
                  (checkedChange)="bookmarked.set($event)"
                >
                  Bookmarked
                </argusx-dropdown-menu-checkbox-item>
                <argusx-dropdown-menu-separator />
                <argusx-dropdown-menu-label>View</argusx-dropdown-menu-label>
                <argusx-dropdown-menu-radio-group [(value)]="viewMode">
                  <argusx-dropdown-menu-radio-item value="compact">Compact</argusx-dropdown-menu-radio-item>
                  <argusx-dropdown-menu-radio-item value="comfortable">Comfortable</argusx-dropdown-menu-radio-item>
                </argusx-dropdown-menu-radio-group>
                <argusx-dropdown-menu-separator />
                <argusx-dropdown-menu-item variant="destructive">Delete</argusx-dropdown-menu-item>
              </argusx-dropdown-menu-content>
            </argusx-dropdown-menu>

            <div class="space-y-1 text-xs text-muted-foreground">
              <p>Bookmarked: <span class="font-medium text-foreground">{{ bookmarked() ? 'Yes' : 'No' }}</span></p>
              <p>View mode: <span class="font-medium text-foreground">{{ viewMode() ?? 'compact' }}</span></p>
            </div>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Trigger Forms</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-4 border border-dashed p-4 sm:p-6">
            <div class="flex flex-wrap gap-3">
              <argusx-dropdown-menu>
                <button argus-button variant="outline" argusxDropdownMenuTrigger>
                  Directive Trigger
                </button>
                <argusx-dropdown-menu-content>
                  <argusx-dropdown-menu-item>Open</argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-item>Duplicate</argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-item>Archive</argusx-dropdown-menu-item>
                </argusx-dropdown-menu-content>
              </argusx-dropdown-menu>

              <argusx-dropdown-menu>
                <argusx-dropdown-menu-trigger>
                  <button argus-button variant="secondary">
                    Component Trigger
                  </button>
                </argusx-dropdown-menu-trigger>
                <argusx-dropdown-menu-content>
                  <argusx-dropdown-menu-item>Open</argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-item>Share</argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-item>Move</argusx-dropdown-menu-item>
                </argusx-dropdown-menu-content>
              </argusx-dropdown-menu>
            </div>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Align And Offset</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-4 border border-dashed p-4 sm:p-6">
            <div class="flex flex-wrap gap-3">
              <argusx-dropdown-menu>
                <button argus-button variant="outline" argusxDropdownMenuTrigger>
                  Start + 4
                </button>
                <argusx-dropdown-menu-content align="start" [sideOffset]="4">
                  <argusx-dropdown-menu-item>Profile</argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-item>Billing</argusx-dropdown-menu-item>
                </argusx-dropdown-menu-content>
              </argusx-dropdown-menu>

              <argusx-dropdown-menu>
                <button argus-button variant="outline" argusxDropdownMenuTrigger>
                  Center + 12
                </button>
                <argusx-dropdown-menu-content align="center" [sideOffset]="12">
                  <argusx-dropdown-menu-item>Profile</argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-item>Billing</argusx-dropdown-menu-item>
                </argusx-dropdown-menu-content>
              </argusx-dropdown-menu>

              <argusx-dropdown-menu>
                <button argus-button variant="outline" argusxDropdownMenuTrigger>
                  End + 4
                </button>
                <argusx-dropdown-menu-content align="end" [sideOffset]="4">
                  <argusx-dropdown-menu-item>Profile</argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-item>Billing</argusx-dropdown-menu-item>
                </argusx-dropdown-menu-content>
              </argusx-dropdown-menu>
            </div>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Shortcuts</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-4 border border-dashed p-4 sm:p-6">
            <argusx-dropdown-menu>
              <button argus-button variant="outline" argusxDropdownMenuTrigger>
                Open Menu
              </button>
              <argusx-dropdown-menu-content>
                <argusx-dropdown-menu-group>
                  <argusx-dropdown-menu-item>
                    Back
                    <argusx-dropdown-menu-shortcut>Alt+Left</argusx-dropdown-menu-shortcut>
                  </argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-item [disabled]="true">
                    Forward
                    <argusx-dropdown-menu-shortcut>Alt+Right</argusx-dropdown-menu-shortcut>
                  </argusx-dropdown-menu-item>
                  <argusx-dropdown-menu-item>
                    Reload
                    <argusx-dropdown-menu-shortcut>Ctrl+R</argusx-dropdown-menu-shortcut>
                  </argusx-dropdown-menu-item>
                </argusx-dropdown-menu-group>
                <argusx-dropdown-menu-separator />
                <argusx-dropdown-menu-group>
                  <argusx-dropdown-menu-item>
                    Search
                    <argusx-dropdown-menu-shortcut>Ctrl+K</argusx-dropdown-menu-shortcut>
                  </argusx-dropdown-menu-item>
                </argusx-dropdown-menu-group>
              </argusx-dropdown-menu-content>
            </argusx-dropdown-menu>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Submenu</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-4 border border-dashed p-4 sm:p-6">
            <argusx-dropdown-menu>
              <button argus-button variant="outline" argusxDropdownMenuTrigger>
                Open Menu
              </button>
              <argusx-dropdown-menu-content>
                <argusx-dropdown-menu-item>
                  New Tab
                  <argusx-dropdown-menu-shortcut>Ctrl+T</argusx-dropdown-menu-shortcut>
                </argusx-dropdown-menu-item>
                <argusx-dropdown-menu-item>
                  Duplicate
                  <argusx-dropdown-menu-shortcut>Ctrl+D</argusx-dropdown-menu-shortcut>
                </argusx-dropdown-menu-item>
                <argusx-dropdown-menu-separator />
                <argusx-dropdown-menu-sub>
                  <argusx-dropdown-menu-sub-trigger>More Tools</argusx-dropdown-menu-sub-trigger>
                  <argusx-dropdown-menu-sub-content>
                    <argusx-dropdown-menu-item>Save Page As...</argusx-dropdown-menu-item>
                    <argusx-dropdown-menu-item>Create Shortcut...</argusx-dropdown-menu-item>
                    <argusx-dropdown-menu-item>Task Manager</argusx-dropdown-menu-item>
                    <argusx-dropdown-menu-separator />
                    <argusx-dropdown-menu-item variant="destructive">Delete</argusx-dropdown-menu-item>
                  </argusx-dropdown-menu-sub-content>
                </argusx-dropdown-menu-sub>
              </argusx-dropdown-menu-content>
            </argusx-dropdown-menu>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Checkboxes And Radio</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-4 border border-dashed p-4 sm:p-6">
            <argusx-dropdown-menu>
              <button argus-button variant="outline" argusxDropdownMenuTrigger>
                Open Preferences
              </button>
              <argusx-dropdown-menu-content>
                <argusx-dropdown-menu-label>Options</argusx-dropdown-menu-label>
                <argusx-dropdown-menu-separator />
                <argusx-dropdown-menu-checkbox-item
                  [checked]="showLineNumbers()"
                  (checkedChange)="showLineNumbers.set($event)">
                  Show Line Numbers
                </argusx-dropdown-menu-checkbox-item>
                <argusx-dropdown-menu-checkbox-item
                  [checked]="autoSave()"
                  (checkedChange)="autoSave.set($event)">
                  Auto Save
                </argusx-dropdown-menu-checkbox-item>
                <argusx-dropdown-menu-separator />
                <argusx-dropdown-menu-label>Density</argusx-dropdown-menu-label>
                <argusx-dropdown-menu-radio-group [(value)]="density">
                  <argusx-dropdown-menu-radio-item value="compact">Compact</argusx-dropdown-menu-radio-item>
                  <argusx-dropdown-menu-radio-item value="comfortable">Comfortable</argusx-dropdown-menu-radio-item>
                </argusx-dropdown-menu-radio-group>
              </argusx-dropdown-menu-content>
            </argusx-dropdown-menu>

            <div class="space-y-1 text-xs text-muted-foreground">
              <p>
                Line numbers:
                <span class="font-medium text-foreground">{{ showLineNumbers() ? 'On' : 'Off' }}</span>
              </p>
              <p>
                Auto save:
                <span class="font-medium text-foreground">{{ autoSave() ? 'On' : 'Off' }}</span>
              </p>
              <p>Density: <span class="font-medium text-foreground">{{ density() ?? 'compact' }}</span></p>
            </div>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Disabled And Destructive</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-4 border border-dashed p-4 sm:p-6">
            <argusx-dropdown-menu>
              <button argus-button variant="outline" argusxDropdownMenuTrigger>
                Open Actions
              </button>
              <argusx-dropdown-menu-content>
                <argusx-dropdown-menu-item [disabled]="true">Rename</argusx-dropdown-menu-item>
                <argusx-dropdown-menu-item [disabled]="true">Move</argusx-dropdown-menu-item>
                <argusx-dropdown-menu-separator />
                <argusx-dropdown-menu-item>Archive</argusx-dropdown-menu-item>
                <argusx-dropdown-menu-item variant="destructive">Delete Workspace</argusx-dropdown-menu-item>
              </argusx-dropdown-menu-content>
            </argusx-dropdown-menu>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Inset</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-4 border border-dashed p-4 sm:p-6">
            <argusx-dropdown-menu>
              <button argus-button variant="outline" argusxDropdownMenuTrigger>
                Open Menu
              </button>
              <argusx-dropdown-menu-content>
                <argusx-dropdown-menu-label [inset]="true">Project</argusx-dropdown-menu-label>
                <argusx-dropdown-menu-separator />
                <argusx-dropdown-menu-item [inset]="true">General</argusx-dropdown-menu-item>
                <argusx-dropdown-menu-item [inset]="true">Members</argusx-dropdown-menu-item>
                <argusx-dropdown-menu-item [inset]="true">Integrations</argusx-dropdown-menu-item>
                <argusx-dropdown-menu-separator />
                <argusx-dropdown-menu-sub>
                  <argusx-dropdown-menu-sub-trigger [inset]="true">Advanced</argusx-dropdown-menu-sub-trigger>
                  <argusx-dropdown-menu-sub-content>
                    <argusx-dropdown-menu-item>Security</argusx-dropdown-menu-item>
                    <argusx-dropdown-menu-item>API Keys</argusx-dropdown-menu-item>
                  </argusx-dropdown-menu-sub-content>
                </argusx-dropdown-menu-sub>
              </argusx-dropdown-menu-content>
            </argusx-dropdown-menu>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class DropdownMenuPreviewComponent {
  readonly bookmarked = signal(true);
  readonly viewMode = signal<string | undefined>('compact');

  readonly showLineNumbers = signal(true);
  readonly autoSave = signal(false);
  readonly density = signal<string | undefined>('comfortable');
}
