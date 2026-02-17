import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MenubarComponents } from '@app/shared/ui/menubar';

@Component({
  selector: 'app-menubar-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenubarComponents],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Menubar</h1>
      <p class="mb-8 text-muted-foreground">
        Application-style top menu with nested items, toggles, and shortcuts.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Desktop Menubar</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <app-menubar>
            <app-menubar-menu value="file">
              <span appMenubarTrigger>File</span>
              <app-menubar-content>
                <app-menubar-item>
                  New Tab
                  <app-menubar-shortcut>⌘T</app-menubar-shortcut>
                </app-menubar-item>
                <app-menubar-item>
                  New Window
                  <app-menubar-shortcut>⌘N</app-menubar-shortcut>
                </app-menubar-item>
                <app-menubar-separator />
                <app-menubar-sub>
                  <app-menubar-sub-trigger>Share</app-menubar-sub-trigger>
                  <app-menubar-sub-content>
                    <app-menubar-item>Email link</app-menubar-item>
                    <app-menubar-item>Copy link</app-menubar-item>
                  </app-menubar-sub-content>
                </app-menubar-sub>
              </app-menubar-content>
            </app-menubar-menu>

            <app-menubar-menu value="view">
              <span appMenubarTrigger>View</span>
              <app-menubar-content>
                <app-menubar-checkbox-item
                  [checked]="showSidebar()"
                  (checkedChange)="showSidebar.set($event)"
                >
                  Show Sidebar
                </app-menubar-checkbox-item>
                <app-menubar-separator />
                <app-menubar-radio-group [(value)]="density">
                  <app-menubar-radio-item value="compact">Compact</app-menubar-radio-item>
                  <app-menubar-radio-item value="cozy">Cozy</app-menubar-radio-item>
                </app-menubar-radio-group>
              </app-menubar-content>
            </app-menubar-menu>
          </app-menubar>

          <div class="space-y-1 text-xs text-muted-foreground">
            <p>Sidebar: <span class="font-medium text-foreground">{{ showSidebar() ? 'Visible' : 'Hidden' }}</span></p>
            <p>Density: <span class="font-medium text-foreground">{{ density() ?? 'compact' }}</span></p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class MenubarPreviewComponent {
  readonly showSidebar = signal(true);
  readonly density = signal<string | undefined>('compact');
}
