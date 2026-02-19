import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, UserCheck } from 'lucide-angular';
import { distinctUntilChanged, filter, map } from 'rxjs';

type ReviewStatus = 'not_processed' | 'ready_to_review' | 'reviewed';

const PREVIEW_ITEMS = [
  { id: 'button', label: 'Button', reviewStatus: 'reviewed' },
  { id: 'input', label: 'Input', reviewStatus: 'reviewed' },
  { id: 'card', label: 'Card', reviewStatus: 'reviewed' },
  { id: 'context-menu', label: 'Context Menu', reviewStatus: 'reviewed' },
  { id: 'calendar', label: 'Calendar', reviewStatus: 'reviewed' },
  { id: 'accordion', label: 'Accordion', reviewStatus: 'reviewed' },
  { id: 'dialog', label: 'Dialog', reviewStatus: 'reviewed' },
  { id: 'aspect-ratio', label: 'Aspect Ratio', reviewStatus: 'reviewed' },
  { id: 'alert', label: 'Alert', reviewStatus: 'not_processed' },
  { id: 'avatar', label: 'Avatar', reviewStatus: 'not_processed' },
  { id: 'liquid-glass', label: 'Liquid Glass', reviewStatus: 'not_processed' },
  { id: 'llm-chat', label: 'LLM Chat', reviewStatus: 'not_processed' },
  { id: 'markdown', label: 'Markdown', reviewStatus: 'not_processed' },
  { id: 'alert-dialog', label: 'Alert Dialog', reviewStatus: 'reviewed' },
  { id: 'badge', label: 'Badge', reviewStatus: 'ready_to_review' },
  { id: 'breadcrumb', label: 'Breadcrumb', reviewStatus: 'reviewed' },
  { id: 'button-group', label: 'Button Group', reviewStatus: 'not_processed' },
  { id: 'carousel', label: 'Carousel', reviewStatus: 'reviewed' },
  { id: 'chart', label: 'Chart', reviewStatus: 'reviewed' },
  { id: 'checkbox', label: 'Checkbox', reviewStatus: 'reviewed' },
  { id: 'collapsible', label: 'Collapsible', reviewStatus: 'not_processed' },
  { id: 'combobox', label: 'Combobox', reviewStatus: 'reviewed' },
  { id: 'command', label: 'Command', reviewStatus: 'not_processed' },
  { id: 'drawer', label: 'Drawer', reviewStatus: 'reviewed' },
  { id: 'dropdown-menu', label: 'Dropdown Menu', reviewStatus: 'reviewed' },
  { id: 'empty', label: 'Empty', reviewStatus: 'not_processed' },
  { id: 'field', label: 'Field', reviewStatus: 'not_processed' },
  { id: 'hover-card', label: 'Hover Card', reviewStatus: 'not_processed' },
  { id: 'input-group', label: 'Input Group', reviewStatus: 'not_processed' },
  { id: 'input-otp', label: 'Input OTP', reviewStatus: 'not_processed' },
  { id: 'kbd', label: 'Keyboard Key', reviewStatus: 'not_processed' },
  { id: 'label', label: 'Label', reviewStatus: 'not_processed' },
  { id: 'menubar', label: 'Menubar', reviewStatus: 'reviewed' },
  { id: 'native-select', label: 'Native Select', reviewStatus: 'not_processed' },
  { id: 'pagination', label: 'Pagination', reviewStatus: 'reviewed' },
  { id: 'popover', label: 'Popover', reviewStatus: 'not_processed' },
  { id: 'progress', label: 'Progress', reviewStatus: 'not_processed' },
  { id: 'radio-group', label: 'Radio Group', reviewStatus: 'not_processed' },
  { id: 'resizable', label: 'Resizable', reviewStatus: 'not_processed' },
  { id: 'scroll-area', label: 'Scroll Area', reviewStatus: 'reviewed' },
  { id: 'select', label: 'Select', reviewStatus: 'reviewed' },
  { id: 'switch', label: 'Switch', reviewStatus: 'reviewed' },
  { id: 'slider', label: 'Slider', reviewStatus: 'reviewed' },
  { id: 'separator', label: 'Separator', reviewStatus: 'not_processed' },
  { id: 'sheet', label: 'Sheet', reviewStatus: 'not_processed' },
  { id: 'skeleton', label: 'Skeleton', reviewStatus: 'not_processed' },
  { id: 'spinner', label: 'Spinner', reviewStatus: 'not_processed' },
  { id: 'table', label: 'Table', reviewStatus: 'not_processed' },
  { id: 'tabs', label: 'Tabs', reviewStatus: 'not_processed' },
  { id: 'textarea', label: 'Textarea', reviewStatus: 'not_processed' },
  { id: 'toast', label: 'Toast', reviewStatus: 'not_processed' },
  { id: 'toggle', label: 'Toggle', reviewStatus: 'not_processed' },
  { id: 'toggle-group', label: 'Toggle Group', reviewStatus: 'not_processed' },
  { id: 'tooltip', label: 'Tooltip', reviewStatus: 'not_processed' },
] as const;

type PreviewItemId = (typeof PREVIEW_ITEMS)[number]['id'];

type PreviewItem = {
  id: PreviewItemId;
  label: string;
  reviewStatus: ReviewStatus;
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
                    @if (item.reviewStatus === 'reviewed') {
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

  readonly currentItem = computed(() =>
    this.previewItems.find((item) => item.id === this.currentPreview())
  );

  readonly currentIsReviewed = computed(() =>
    this.currentItem()?.reviewStatus === 'reviewed'
  );

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
