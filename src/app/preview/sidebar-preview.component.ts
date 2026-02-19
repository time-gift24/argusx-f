import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponents } from '@app/shared/ui/sidebar/sidebar.component';

@Component({
  selector: 'app-sidebar-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ...SidebarComponents],
  template: `
    <div class="mx-auto max-w-4xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Sidebar</h1>
      <p class="mb-8 text-muted-foreground">
        A sidebar component with collapsible functionality and menu structure.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Basic Usage</h2>
        </div>
        <div class="relative h-96 rounded-lg border border-dashed border-border overflow-hidden">
          <argusx-sidebar-provider>
            <argusx-sidebar>
              <argusx-sidebar-header>
                <div class="text-sm font-medium">Application</div>
              </argusx-sidebar-header>
              <argusx-sidebar-content>
                <argusx-sidebar-group>
                  <argusx-sidebar-group-label>Navigation</argusx-sidebar-group-label>
                  <argusx-sidebar-menu>
                    @for (item of menuItems; track item.title) {
                      <argusx-sidebar-menu-item>
                        <argusx-sidebar-menu-button [isActive]="item.active">
                          <span>{{ item.title }}</span>
                        </argusx-sidebar-menu-button>
                      </argusx-sidebar-menu-item>
                    }
                  </argusx-sidebar-menu>
                </argusx-sidebar-group>
              </argusx-sidebar-content>
              <argusx-sidebar-footer>
                <div class="text-xs text-muted-foreground">v1.0.0</div>
              </argusx-sidebar-footer>
            </argusx-sidebar>
            <argusx-sidebar-inset>
              <header class="flex h-12 items-center justify-between border-b px-4">
                <argusx-sidebar-trigger />
                <span class="text-sm">Content Area</span>
              </header>
              <div class="p-4">
                <p class="text-muted-foreground">Main content goes here.</p>
              </div>
            </argusx-sidebar-inset>
          </argusx-sidebar-provider>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">With Separator</h2>
        </div>
        <div class="relative h-64 rounded-lg border border-dashed border-border overflow-hidden">
          <argusx-sidebar-provider>
            <argusx-sidebar>
              <argusx-sidebar-content>
                <argusx-sidebar-menu>
                  @for (item of menuItems.slice(0, 2); track item.title) {
                    <argusx-sidebar-menu-item>
                      <argusx-sidebar-menu-button>
                        <span>{{ item.title }}</span>
                      </argusx-sidebar-menu-button>
                    </argusx-sidebar-menu-item>
                  }
                </argusx-sidebar-menu>
                <argusx-sidebar-separator />
                <argusx-sidebar-menu>
                  @for (item of menuItems.slice(2); track item.title) {
                    <argusx-sidebar-menu-item>
                      <argusx-sidebar-menu-button>
                        <span>{{ item.title }}</span>
                      </argusx-sidebar-menu-button>
                    </argusx-sidebar-menu-item>
                  }
                </argusx-sidebar-menu>
              </argusx-sidebar-content>
            </argusx-sidebar>
            <argusx-sidebar-inset>
              <div class="p-4">
                <p class="text-muted-foreground">Sidebar with separator example.</p>
              </div>
            </argusx-sidebar-inset>
          </argusx-sidebar-provider>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">With Input</h2>
        </div>
        <div class="relative h-64 rounded-lg border border-dashed border-border overflow-hidden">
          <argusx-sidebar-provider>
            <argusx-sidebar>
              <argusx-sidebar-content>
                <div class="p-2">
                  <argusx-sidebar-input placeholder="Search..." />
                </div>
                <argusx-sidebar-menu>
                  @for (item of menuItems; track item.title) {
                    <argusx-sidebar-menu-item>
                      <argusx-sidebar-menu-button>
                        <span>{{ item.title }}</span>
                      </argusx-sidebar-menu-button>
                    </argusx-sidebar-menu-item>
                  }
                </argusx-sidebar-menu>
              </argusx-sidebar-content>
            </argusx-sidebar>
            <argusx-sidebar-inset>
              <div class="p-4">
                <p class="text-muted-foreground">Sidebar with search input example.</p>
              </div>
            </argusx-sidebar-inset>
          </argusx-sidebar-provider>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Collapsed (offcanvas)</h2>
        </div>
        <div class="relative h-96 rounded-lg border border-dashed border-border overflow-hidden">
          <argusx-sidebar-provider [defaultOpen]="false">
            <argusx-sidebar [collapsible]="'offcanvas'">
              <argusx-sidebar-header>
                <div class="text-sm font-medium">App</div>
              </argusx-sidebar-header>
              <argusx-sidebar-content>
                <argusx-sidebar-menu>
                  @for (item of menuItems; track item.title) {
                    <argusx-sidebar-menu-item>
                      <argusx-sidebar-menu-button>
                        <span>{{ item.title }}</span>
                      </argusx-sidebar-menu-button>
                    </argusx-sidebar-menu-item>
                  }
                </argusx-sidebar-menu>
              </argusx-sidebar-content>
            </argusx-sidebar>
            <argusx-sidebar-inset>
              <header class="flex h-12 items-center border-b px-4">
                <argusx-sidebar-trigger />
                <span class="ml-2 text-sm">Collapsed Example</span>
              </header>
              <div class="p-4">
                <p class="text-muted-foreground">Click the trigger to expand/collapse the sidebar.</p>
              </div>
            </argusx-sidebar-inset>
          </argusx-sidebar-provider>
        </div>
      </section>
    </div>
  `,
})
export class SidebarPreviewComponent {
  readonly menuItems = [
    { title: 'Home', active: true },
    { title: 'Inbox', active: false },
    { title: 'Calendar', active: false },
    { title: 'Search', active: false },
    { title: 'Settings', active: false },
  ] as const;
}
