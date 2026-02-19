import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { ArgusxButtonDirective } from '@app/shared/ui/button';
import { ArgusxBreadcrumbComponents } from '@app/shared/ui/breadcrumb';
import { DrawerComponents } from '@app/shared/ui/drawer';
import { DropdownMenuComponents } from '@app/shared/ui/dropdown-menu';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

@Component({
  selector: 'app-argusx-breadcrumb-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArgusxBreadcrumbComponents,
    DropdownMenuComponents,
    DrawerComponents,
    ArgusxButtonDirective,
    LucideAngularModule,
  ],
  template: `
    <div class="mx-auto max-w-5xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Breadcrumb</h1>
      <p class="mb-8 text-muted-foreground">
        Displays the path of navigation in a hierarchical structure.
      </p>

      <div class="space-y-8">
        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">Default (Component Selectors)</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <argusx-breadcrumb>
              <argusx-breadcrumb-list>
                <argusx-breadcrumb-item>
                  <a argusxBreadcrumbLink href="#">Home</a>
                </argusx-breadcrumb-item>
                <argusx-breadcrumb-separator />
                <argusx-breadcrumb-item>
                  <a argusxBreadcrumbLink href="#">Components</a>
                </argusx-breadcrumb-item>
                <argusx-breadcrumb-separator />
                <argusx-breadcrumb-item>
                  <argusx-breadcrumb-page>Breadcrumb</argusx-breadcrumb-page>
                </argusx-breadcrumb-item>
              </argusx-breadcrumb-list>
            </argusx-breadcrumb>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">
              Semantic Selectors + Custom Separator
            </h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <nav argusxBreadcrumb>
              <ol argusxBreadcrumbList>
                <li argusxBreadcrumbItem>
                  <a argusxBreadcrumbLink href="#">Home</a>
                </li>
                <li argusxBreadcrumbSeparator>
                  <span class="text-[0.95em] leading-none">›</span>
                </li>
                <li argusxBreadcrumbItem>
                  <a argusxBreadcrumbLink href="#">Shop</a>
                </li>
                <li argusxBreadcrumbSeparator><span>/</span></li>
                <li argusxBreadcrumbItem>
                  <span argusxBreadcrumbPage>Products</span>
                </li>
              </ol>
            </nav>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">Size Variants</h2>
          </div>
          <div class="grid gap-4 rounded-lg border border-dashed border-border p-6 md:grid-cols-3">
            <argusx-breadcrumb size="sm">
              <argusx-breadcrumb-list>
                <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">Home</a></argusx-breadcrumb-item>
                <argusx-breadcrumb-separator />
                <argusx-breadcrumb-item><argusx-breadcrumb-page>Small</argusx-breadcrumb-page></argusx-breadcrumb-item>
              </argusx-breadcrumb-list>
            </argusx-breadcrumb>

            <argusx-breadcrumb size="md">
              <argusx-breadcrumb-list>
                <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">Home</a></argusx-breadcrumb-item>
                <argusx-breadcrumb-separator />
                <argusx-breadcrumb-item><argusx-breadcrumb-page>Medium</argusx-breadcrumb-page></argusx-breadcrumb-item>
              </argusx-breadcrumb-list>
            </argusx-breadcrumb>

            <argusx-breadcrumb size="lg">
              <argusx-breadcrumb-list>
                <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">Home</a></argusx-breadcrumb-item>
                <argusx-breadcrumb-separator />
                <argusx-breadcrumb-item><argusx-breadcrumb-page>Large</argusx-breadcrumb-page></argusx-breadcrumb-item>
              </argusx-breadcrumb-list>
            </argusx-breadcrumb>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">Align + Wrap</h2>
          </div>
          <div class="space-y-6 rounded-lg border border-dashed border-border p-6">
            <div class="space-y-3">
              <h3 class="text-xs font-medium text-muted-foreground">Align</h3>
              <div class="space-y-2">
                <argusx-breadcrumb>
                  <argusx-breadcrumb-list align="start" class="w-full">
                    <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">Start</a></argusx-breadcrumb-item>
                    <argusx-breadcrumb-separator />
                    <argusx-breadcrumb-item><argusx-breadcrumb-page>Aligned</argusx-breadcrumb-page></argusx-breadcrumb-item>
                  </argusx-breadcrumb-list>
                </argusx-breadcrumb>

                <argusx-breadcrumb>
                  <argusx-breadcrumb-list align="center" class="w-full">
                    <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">Center</a></argusx-breadcrumb-item>
                    <argusx-breadcrumb-separator />
                    <argusx-breadcrumb-item><argusx-breadcrumb-page>Aligned</argusx-breadcrumb-page></argusx-breadcrumb-item>
                  </argusx-breadcrumb-list>
                </argusx-breadcrumb>

                <argusx-breadcrumb>
                  <argusx-breadcrumb-list align="end" class="w-full">
                    <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">End</a></argusx-breadcrumb-item>
                    <argusx-breadcrumb-separator />
                    <argusx-breadcrumb-item><argusx-breadcrumb-page>Aligned</argusx-breadcrumb-page></argusx-breadcrumb-item>
                  </argusx-breadcrumb-list>
                </argusx-breadcrumb>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-xs font-medium text-muted-foreground">Wrap</h3>
              <div class="grid gap-3 md:grid-cols-2">
                <div class="space-y-2">
                  <p class="text-[11px] text-muted-foreground">wrap</p>
                  <argusx-breadcrumb>
                    <argusx-breadcrumb-list wrap="wrap" class="max-w-[220px] border border-border/50 p-2">
                      <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">VeryLongSection</a></argusx-breadcrumb-item>
                      <argusx-breadcrumb-separator />
                      <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">AnotherLongSection</a></argusx-breadcrumb-item>
                      <argusx-breadcrumb-separator />
                      <argusx-breadcrumb-item><argusx-breadcrumb-page>Wrap</argusx-breadcrumb-page></argusx-breadcrumb-item>
                    </argusx-breadcrumb-list>
                  </argusx-breadcrumb>
                </div>

                <div class="space-y-2">
                  <p class="text-[11px] text-muted-foreground">nowrap</p>
                  <argusx-breadcrumb>
                    <argusx-breadcrumb-list
                      wrap="nowrap"
                      class="max-w-[220px] overflow-x-auto border border-border/50 p-2"
                    >
                      <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">VeryLongSection</a></argusx-breadcrumb-item>
                      <argusx-breadcrumb-separator />
                      <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">AnotherLongSection</a></argusx-breadcrumb-item>
                      <argusx-breadcrumb-separator />
                      <argusx-breadcrumb-item><argusx-breadcrumb-page>NoWrap</argusx-breadcrumb-page></argusx-breadcrumb-item>
                    </argusx-breadcrumb-list>
                  </argusx-breadcrumb>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">Ellipsis Color</h2>
          </div>
          <div class="grid gap-4 rounded-lg border border-dashed border-border p-6 md:grid-cols-2">
            <argusx-breadcrumb>
              <argusx-breadcrumb-list>
                <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">Home</a></argusx-breadcrumb-item>
                <argusx-breadcrumb-separator />
                <argusx-breadcrumb-item>
                  <argusx-breadcrumb-ellipsis ellipsisColor="muted" />
                </argusx-breadcrumb-item>
                <argusx-breadcrumb-separator />
                <argusx-breadcrumb-item><argusx-breadcrumb-page>Muted</argusx-breadcrumb-page></argusx-breadcrumb-item>
              </argusx-breadcrumb-list>
            </argusx-breadcrumb>

            <argusx-breadcrumb>
              <argusx-breadcrumb-list>
                <argusx-breadcrumb-item><a argusxBreadcrumbLink href="#">Home</a></argusx-breadcrumb-item>
                <argusx-breadcrumb-separator />
                <argusx-breadcrumb-item>
                  <argusx-breadcrumb-ellipsis ellipsisColor="strong" />
                </argusx-breadcrumb-item>
                <argusx-breadcrumb-separator />
                <argusx-breadcrumb-item><argusx-breadcrumb-page>Strong</argusx-breadcrumb-page></argusx-breadcrumb-item>
              </argusx-breadcrumb-list>
            </argusx-breadcrumb>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">
              Complex: Responsive Dropdown / Drawer
            </h2>
            <p class="text-xs text-muted-foreground">{{ responsiveModeLabel() }}</p>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <argusx-breadcrumb>
              <argusx-breadcrumb-list>
                <argusx-breadcrumb-item>
                  <a argusxBreadcrumbLink href="#">Home</a>
                </argusx-breadcrumb-item>
                <argusx-breadcrumb-separator />

                <argusx-breadcrumb-item>
                  @if (isDesktop()) {
                    <app-dropdown-menu>
                      <button
                        argusButton
                        variant="ghost"
                        class="h-auto px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                        appDropdownMenuTrigger
                      >
                        <span argusxBreadcrumbEllipsis class="size-4"></span>
                        <span class="sr-only">Toggle menu</span>
                      </button>
                      <app-dropdown-menu-content align="start">
                        <app-dropdown-menu-item>Documentation</app-dropdown-menu-item>
                        <app-dropdown-menu-item>Themes</app-dropdown-menu-item>
                        <app-dropdown-menu-item>GitHub</app-dropdown-menu-item>
                      </app-dropdown-menu-content>
                    </app-dropdown-menu>
                  } @else {
                    <app-drawer direction="bottom" size="sm">
                      <button
                        argusButton
                        variant="ghost"
                        class="h-auto px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                        appDrawerTrigger
                      >
                        <span argusxBreadcrumbEllipsis class="size-4"></span>
                        <span class="sr-only">Open navigation menu</span>
                      </button>
                      <app-drawer-content>
                        <app-drawer-header>
                          <app-drawer-title>Navigate to</app-drawer-title>
                          <app-drawer-description>
                            Select a page to continue.
                          </app-drawer-description>
                        </app-drawer-header>
                        <div class="grid gap-2 px-4 pb-2 text-sm">
                          <a href="#" class="rounded px-2 py-1 hover:bg-muted">Documentation</a>
                          <a href="#" class="rounded px-2 py-1 hover:bg-muted">Themes</a>
                          <a href="#" class="rounded px-2 py-1 hover:bg-muted">GitHub</a>
                        </div>
                        <app-drawer-footer>
                          <button argusButton variant="outline" appDrawerClose>Close</button>
                        </app-drawer-footer>
                      </app-drawer-content>
                    </app-drawer>
                  }
                </argusx-breadcrumb-item>

                <argusx-breadcrumb-separator />
                <argusx-breadcrumb-item>
                  <a argusxBreadcrumbLink href="#">Components</a>
                </argusx-breadcrumb-item>
                <argusx-breadcrumb-separator />
                <argusx-breadcrumb-item>
                  <argusx-breadcrumb-page>Breadcrumb</argusx-breadcrumb-page>
                </argusx-breadcrumb-item>
              </argusx-breadcrumb-list>
            </argusx-breadcrumb>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class BreadcrumbPreviewComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly isDesktop = signal(true);
  readonly responsiveModeLabel = computed(() =>
    this.isDesktop() ? 'Desktop mode: dropdown menu' : 'Mobile mode: drawer'
  );

  ngOnInit(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      this.isDesktop.set(true);
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    this.isDesktop.set(mediaQuery.matches);

    const onMediaChange = (event: MediaQueryListEvent): void => {
      this.isDesktop.set(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onMediaChange);
      this.destroyRef.onDestroy(() => {
        mediaQuery.removeEventListener('change', onMediaChange);
      });
      return;
    }

    mediaQuery.addListener(onMediaChange);
    this.destroyRef.onDestroy(() => {
      mediaQuery.removeListener(onMediaChange);
    });
  }
}
