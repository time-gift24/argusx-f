import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@app/shared/ui/button';
import { DrawerComponents } from '@app/shared/ui/drawer';

@Component({
  selector: 'app-drawer-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DrawerComponents, ButtonComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Drawer</h1>
      <p class="mb-8 text-muted-foreground">
        A panel that slides from screen edges to show contextual content.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Right Drawer</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-drawer [(open)]="rightOpen" direction="right">
            <button argus-button variant="outline" appDrawerTrigger>
              Open Right Drawer
            </button>
            <app-drawer-content>
              <app-drawer-header>
                <app-drawer-title>Edit profile</app-drawer-title>
                <app-drawer-description>
                  Make changes to your profile and close when you are done.
                </app-drawer-description>
              </app-drawer-header>
              <div class="p-4 space-y-3 text-xs text-muted-foreground">
                <p>Drawer content supports any custom layout.</p>
                <p>This follows the shadcn slide-out interaction pattern.</p>
              </div>
              <app-drawer-footer>
                <button argus-button variant="outline" appDrawerClose>Cancel</button>
                <button argus-button appDrawerClose>Save changes</button>
              </app-drawer-footer>
            </app-drawer-content>
          </app-drawer>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Bottom Drawer</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-drawer [(open)]="bottomOpen" direction="bottom" size="sm">
            <button argus-button variant="outline" appDrawerTrigger>
              Open Bottom Drawer
            </button>
            <app-drawer-content>
              <app-drawer-header>
                <app-drawer-title>Share link</app-drawer-title>
                <app-drawer-description>
                  Copy and share this invite link with your team.
                </app-drawer-description>
              </app-drawer-header>
              <div class="px-4 pb-2">
                <div class="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-foreground">
                  https://argusx.app/invite/team-alpha
                </div>
              </div>
              <app-drawer-footer>
                <button argus-button variant="outline" appDrawerClose>Close</button>
              </app-drawer-footer>
            </app-drawer-content>
          </app-drawer>
        </div>
      </section>
    </div>
  `,
})
export class DrawerPreviewComponent {
  readonly rightOpen = signal(false);
  readonly bottomOpen = signal(false);
}
