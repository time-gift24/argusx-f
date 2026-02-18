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
import { LucideAngularModule, UserCheck } from 'lucide-angular';
import { distinctUntilChanged, filter, map } from 'rxjs';

const PREVIEW_ITEMS = [
  { id: 'button', label: 'Button', manuallyReviewed: true },
  { id: 'input', label: 'Input', manuallyReviewed: true },
{ id: 'card', label: 'Card', manuallyReviewed: true },
  { id: 'context-menu', label: 'Context Menu', manuallyReviewed: true },
  { id: 'calendar', label: 'Calendar', manuallyReviewed: true },
  { id: 'accordion', label: 'Accordion', manuallyReviewed: true },
  { id: 'dialog', label: 'Dialog', manuallyReviewed: true },
  { id: 'aspect-ratio', label: 'Aspect Ratio' },
  { id: 'alert', label: 'Alert' },
  { id: 'avatar', label: 'Avatar' },
  { id: 'liquid-glass', label: 'Liquid Glass' },
  { id: 'llm-chat', label: 'LLM Chat' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'alert-dialog', label: 'Alert Dialog', manuallyReviewed: true },
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
  { id: 'select', label: 'Select', manuallyReviewed: true },
  { id: 'switch', label: 'Switch', manuallyReviewed: true },
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
] as const;

type PreviewItemId = (typeof PREVIEW_ITEMS)[number]['id'];

type PreviewItem = {
  id: PreviewItemId;
  label: string;
  manuallyReviewed?: boolean;
};

const PREVIEW_ITEM_IDS = new Set(PREVIEW_ITEMS.map((item) => item.id));

function isPreviewItemId(id: string | null): id is PreviewItemId {
  return id !== null && PREVIEW_ITEM_IDS.has(id as PreviewItemId);
}

@Component({
  selector: 'app-preview-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <div class="flex h-screen w-screen overflow-hidden">
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
                  <span class="flex items-center justify-between gap-2">
                    <span class="truncate">{{ item.label }}</span>
                    @if (item.manuallyReviewed) {
                      <lucide-icon
                        [img]="manualReviewIcon"
                        class="size-3.5 shrink-0 text-emerald-600"
                        title="人工审核通过"
                        aria-hidden="true"
                      />
                    }
                  </span>
                </button>
              </li>
            }
          </ul>
        </div>
      </nav>

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

  readonly manualReviewIcon = UserCheck;
  readonly previewItems: readonly PreviewItem[] = PREVIEW_ITEMS;
  readonly currentPreview = signal<PreviewItemId>('button');

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

  setPreview(component: PreviewItemId): void {
    if (component === this.currentPreview()) {
      return;
    }
    this.currentPreview.set(component);
    this.iframeVersion.set(Date.now());
    void this.syncRoute(component);
  }

  private syncRoute(component: PreviewItemId, replaceUrl = false): Promise<boolean> {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { component },
      queryParamsHandling: 'merge',
      replaceUrl,
    });
  }
}
