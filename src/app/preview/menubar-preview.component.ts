import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArgusxMenubarComponents } from '@app/shared/ui/menubar';

@Component({
  selector: 'app-menubar-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxMenubarComponents],
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
          <argusx-menubar>
            <argusx-menubar-menu value="file">
              <span argusxMenubarTrigger>File</span>
              <argusx-menubar-content [sideOffset]="8" [alignOffset]="-4">
                <argusx-menubar-item>
                  New Tab
                  <argusx-menubar-shortcut>⌘T</argusx-menubar-shortcut>
                </argusx-menubar-item>
                <argusx-menubar-item>
                  New Window
                  <argusx-menubar-shortcut>⌘N</argusx-menubar-shortcut>
                </argusx-menubar-item>
                <argusx-menubar-item [disabled]="true">
                  Open Recent
                  <argusx-menubar-shortcut>⌘R</argusx-menubar-shortcut>
                </argusx-menubar-item>
                <argusx-menubar-separator />
                <argusx-menubar-sub>
                  <argusx-menubar-sub-trigger [inset]="true">Share</argusx-menubar-sub-trigger>
                  <argusx-menubar-sub-content>
                    <argusx-menubar-item>Email link</argusx-menubar-item>
                    <argusx-menubar-item>Copy link</argusx-menubar-item>
                  </argusx-menubar-sub-content>
                </argusx-menubar-sub>
              </argusx-menubar-content>
            </argusx-menubar-menu>

            <argusx-menubar-menu value="edit">
              <argusx-menubar-trigger>Edit</argusx-menubar-trigger>
              <argusx-menubar-content>
                <argusx-menubar-item>
                  Undo
                  <argusx-menubar-shortcut>⌘Z</argusx-menubar-shortcut>
                </argusx-menubar-item>
                <argusx-menubar-item>
                  Redo
                  <argusx-menubar-shortcut>⇧⌘Z</argusx-menubar-shortcut>
                </argusx-menubar-item>
                <argusx-menubar-separator />
                <argusx-menubar-item [inset]="true">Find</argusx-menubar-item>
              </argusx-menubar-content>
            </argusx-menubar-menu>

            <argusx-menubar-menu value="view">
              <span argusxMenubarTrigger>View</span>
              <argusx-menubar-content class="w-52">
                <argusx-menubar-label [inset]="true">Panels</argusx-menubar-label>
                <argusx-menubar-checkbox-item
                  [inset]="true"
                  [checked]="showSidebar()"
                  (checkedChange)="showSidebar.set($event)"
                >
                  Show Sidebar
                </argusx-menubar-checkbox-item>
                <argusx-menubar-checkbox-item
                  [inset]="true"
                  [checked]="showStatusBar()"
                  (checkedChange)="showStatusBar.set($event)"
                >
                  Show Status Bar
                </argusx-menubar-checkbox-item>
                <argusx-menubar-separator />
                <argusx-menubar-label [inset]="true">Density</argusx-menubar-label>
                <argusx-menubar-radio-group [(value)]="density">
                  <argusx-menubar-radio-item [inset]="true" value="compact">Compact</argusx-menubar-radio-item>
                  <argusx-menubar-radio-item [inset]="true" value="cozy">Cozy</argusx-menubar-radio-item>
                </argusx-menubar-radio-group>
              </argusx-menubar-content>
            </argusx-menubar-menu>

            <argusx-menubar-menu value="danger">
              <span argusxMenubarTrigger>Danger</span>
              <argusx-menubar-content>
                <argusx-menubar-item variant="destructive">
                  Delete Workspace
                </argusx-menubar-item>
              </argusx-menubar-content>
            </argusx-menubar-menu>
          </argusx-menubar>

          <div class="space-y-1 text-xs text-muted-foreground">
            <p>Sidebar: <span class="font-medium text-foreground">{{ showSidebar() ? 'Visible' : 'Hidden' }}</span></p>
            <p>Status Bar: <span class="font-medium text-foreground">{{ showStatusBar() ? 'Visible' : 'Hidden' }}</span></p>
            <p>Density: <span class="font-medium text-foreground">{{ density() ?? 'compact' }}</span></p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class MenubarPreviewComponent {
  readonly showSidebar = signal(true);
  readonly showStatusBar = signal(false);
  readonly density = signal<string | undefined>('compact');
}
