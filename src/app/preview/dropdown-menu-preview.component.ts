import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@app/shared/ui/button';
import { ArgusxDropdownMenuComponents } from '@app/shared/ui/dropdown-menu';

@Component({
  selector: 'app-dropdown-menu-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxDropdownMenuComponents, ButtonComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Dropdown Menu</h1>
      <p class="mb-8 text-muted-foreground">
        Contextual overlays for actions, shortcuts, and toggles.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Default Menu</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
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

          <div class="mt-4 space-y-1 text-xs text-muted-foreground">
            <p>Bookmarked: <span class="font-medium text-foreground">{{ bookmarked() ? 'Yes' : 'No' }}</span></p>
            <p>View mode: <span class="font-medium text-foreground">{{ viewMode() ?? 'compact' }}</span></p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class DropdownMenuPreviewComponent {
  readonly bookmarked = signal(true);
  readonly viewMode = signal<string | undefined>('compact');
}
