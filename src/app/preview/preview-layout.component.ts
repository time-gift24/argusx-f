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
    | 'select'
    | 'card'
    | 'context-menu'
    | 'calendar'
    | 'accordion'
    | 'dialog'
    | 'aspect-ratio'
    | 'alert'
    | 'avatar'
    | 'liquid-glass';
  label: string;
}

const PREVIEW_ITEMS: PreviewItem[] = [
  { id: 'button', label: 'Button' },
  { id: 'input', label: 'Input' },
  { id: 'select', label: 'Select' },
  { id: 'card', label: 'Card' },
  { id: 'context-menu', label: 'Context Menu' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'accordion', label: 'Accordion' },
  { id: 'dialog', label: 'Dialog' },
  { id: 'aspect-ratio', label: 'Aspect Ratio' },
  { id: 'alert', label: 'Alert' },
  { id: 'avatar', label: 'Avatar' },
  { id: 'liquid-glass', label: 'Liquid Glass' },
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
      <nav class="w-56 shrink-0 border-r border-border bg-sidebar px-3 py-3">
        <div class="mb-3">
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
      </nav>

      <!-- Iframe Container -->
      <main class="flex-1 overflow-hidden bg-background p-4">
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
