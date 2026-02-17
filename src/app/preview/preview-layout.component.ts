import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';

interface PreviewItem {
  id:
    | 'button'
    | 'input'
    | 'card'
    | 'context-menu'
    | 'calendar'
    | 'accordion'
    | 'dialog'
    | 'aspect-ratio'
    | 'alert'
    | 'avatar'
    | 'liquid-glass'
    | 'alert-dialog'
    | 'badge'
    | 'breadcrumb'
    | 'button-group'
    | 'carousel'
    | 'chart'
    | 'checkbox'
    | 'collapsible'
    | 'combobox'
    | 'command'
    | 'drawer'
    | 'dropdown-menu'
    | 'empty'
    | 'field'
    | 'hover-card'
    | 'input-group'
    | 'input-otp'
    | 'kbd'
    | 'label'
    | 'menubar'
    | 'native-select'
    | 'pagination'
    | 'popover'
    | 'progress'
    | 'radio-group'
    | 'resizable'
    | 'scroll-area'
    | 'select'
    | 'separator'
    | 'sheet'
    | 'skeleton'
    | 'spinner'
    | 'table'
    | 'tabs'
    | 'textarea'
    | 'toast'
    | 'toggle'
    | 'toggle-group'
    | 'tooltip';
  label: string;
}

const PREVIEW_ITEMS: PreviewItem[] = [
  { id: 'button', label: 'Button' },
  { id: 'input', label: 'Input' },
  { id: 'card', label: 'Card' },
  { id: 'context-menu', label: 'Context Menu' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'accordion', label: 'Accordion' },
  { id: 'dialog', label: 'Dialog' },
  { id: 'aspect-ratio', label: 'Aspect Ratio' },
  { id: 'alert', label: 'Alert' },
  { id: 'avatar', label: 'Avatar' },
  { id: 'liquid-glass', label: 'Liquid Glass' },
  { id: 'alert-dialog', label: 'Alert Dialog' },
  { id: 'badge', label: 'Badge' },
  { id: 'breadcrumb', label: 'Breadcrumb' },
  { id: 'button-group', label: 'Button Group' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'chart', label: 'Chart' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'collapsible', label: 'Collapsible' },
  { id: 'combobox', label: 'Combobox' },
  { id: 'command', label: 'Command' },
  { id: 'drawer', label: 'Drawer' },
  { id: 'dropdown-menu', label: 'Dropdown Menu' },
  { id: 'empty', label: 'Empty' },
  { id: 'field', label: 'Field' },
  { id: 'hover-card', label: 'Hover Card' },
  { id: 'input-group', label: 'Input Group' },
  { id: 'input-otp', label: 'Input OTP' },
  { id: 'kbd', label: 'Keyboard Key' },
  { id: 'label', label: 'Label' },
  { id: 'menubar', label: 'Menubar' },
  { id: 'native-select', label: 'Native Select' },
  { id: 'pagination', label: 'Pagination' },
  { id: 'popover', label: 'Popover' },
  { id: 'progress', label: 'Progress' },
  { id: 'radio-group', label: 'Radio Group' },
  { id: 'resizable', label: 'Resizable' },
  { id: 'scroll-area', label: 'Scroll Area' },
  { id: 'select', label: 'Select' },
  { id: 'separator', label: 'Separator' },
  { id: 'sheet', label: 'Sheet' },
  { id: 'skeleton', label: 'Skeleton' },
  { id: 'spinner', label: 'Spinner' },
  { id: 'table', label: 'Table' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'textarea', label: 'Textarea' },
  { id: 'toast', label: 'Toast' },
  { id: 'toggle', label: 'Toggle' },
  { id: 'toggle-group', label: 'Toggle Group' },
  { id: 'tooltip', label: 'Tooltip' },
];

const PREVIEW_ITEM_IDS = new Set(PREVIEW_ITEMS.map((item) => item.id));

function isPreviewItemId(id: string | null): id is PreviewItem['id'] {
  return id !== null && PREVIEW_ITEM_IDS.has(id as PreviewItem['id']);
}

@Component({
  selector: 'app-preview-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen w-screen overflow-hidden">
      <!-- Navbar -->
      <nav class="flex h-full min-h-0 w-56 shrink-0 flex-col border-r border-border bg-sidebar">
        <div class="mb-3 px-3 pt-3">
          <h2 class="text-sm font-semibold text-sidebar-foreground">
            shadcn-angular
          </h2>
          <p class="text-[10px] uppercase tracking-wide text-muted-foreground/90">
            Components
          </p>
          <p class="mt-1 break-all text-[10px] text-muted-foreground">
            {{ currentRoute() }}
          </p>
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3">
          <ul class="space-y-0.5">
            @for (item of previewItems; track item.id) {
              <li>
                <button
                  (click)="setPreview(item.id)"
                  class="w-full text-left block rounded-md px-2.5 py-1.5 text-xs transition-colors {{
                    currentPreview() === item.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }}"
                >
                  {{ item.label }}
                </button>
              </li>
            }
          </ul>
        </div>
      </nav>

      <!-- Iframe Container -->
      <main class="min-w-0 flex-1 overflow-hidden bg-background p-4">
        <iframe
          [src]="safeUrl()"
          class="h-full w-full overflow-auto rounded-lg border border-border bg-card"
        ></iframe>
      </main>
    </div>
  `,
})
export class PreviewLayoutComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly iframeVersion = signal(Date.now());

  readonly previewItems = PREVIEW_ITEMS;
  readonly currentPreview = signal<PreviewItem['id']>('button');

  readonly safeUrl = (): SafeResourceUrl => {
    const url = `/preview/${this.currentPreview()}?v=${this.iframeVersion()}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  };

  readonly currentRoute = (): string => `/preview?component=${this.currentPreview()}`;

  ngOnInit(): void {
    const componentFromUrl = this.route.snapshot.queryParamMap.get('component');
    if (isPreviewItemId(componentFromUrl)) {
      this.currentPreview.set(componentFromUrl);
      this.iframeVersion.set(Date.now());
    } else {
      void this.syncRoute(this.currentPreview(), true);
    }

    this.route.queryParamMap
      .pipe(
        map((params) => params.get('component')),
        filter(isPreviewItemId),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((component) => {
        if (component === this.currentPreview()) {
          return;
        }
        this.currentPreview.set(component);
        this.iframeVersion.set(Date.now());
      });
  }

  setPreview(component: PreviewItem['id']): void {
    if (component === this.currentPreview()) {
      return;
    }
    this.currentPreview.set(component);
    this.iframeVersion.set(Date.now());
    void this.syncRoute(component);
  }

  private syncRoute(component: PreviewItem['id'], replaceUrl = false): Promise<boolean> {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { component },
      queryParamsHandling: 'merge',
      replaceUrl,
    });
  }
}
