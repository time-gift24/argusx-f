import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArgusxButtonDirective } from '@app/shared/ui/button';
import { DropdownMenuComponents } from '@app/shared/ui/dropdown-menu';

@Component({
  selector: 'app-dropdown-menu-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropdownMenuComponents, ArgusxButtonDirective],
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
          <app-dropdown-menu>
            <button argusx-button variant="outline" appDropdownMenuTrigger>
              Open Menu
            </button>
            <app-dropdown-menu-content>
              <app-dropdown-menu-label>My Account</app-dropdown-menu-label>
              <app-dropdown-menu-separator />
              <app-dropdown-menu-item>Profile</app-dropdown-menu-item>
              <app-dropdown-menu-item>Billing</app-dropdown-menu-item>
              <app-dropdown-menu-item>Keyboard Shortcuts</app-dropdown-menu-item>
              <app-dropdown-menu-separator />
              <app-dropdown-menu-checkbox-item
                [checked]="bookmarked()"
                (checkedChange)="bookmarked.set($event)"
              >
                Bookmarked
              </app-dropdown-menu-checkbox-item>
              <app-dropdown-menu-separator />
              <app-dropdown-menu-label>View</app-dropdown-menu-label>
              <app-dropdown-menu-radio-group [(value)]="viewMode">
                <app-dropdown-menu-radio-item value="compact">Compact</app-dropdown-menu-radio-item>
                <app-dropdown-menu-radio-item value="comfortable">Comfortable</app-dropdown-menu-radio-item>
              </app-dropdown-menu-radio-group>
              <app-dropdown-menu-separator />
              <app-dropdown-menu-item variant="destructive">Delete</app-dropdown-menu-item>
            </app-dropdown-menu-content>
          </app-dropdown-menu>

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
