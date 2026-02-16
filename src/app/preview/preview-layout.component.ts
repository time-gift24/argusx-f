import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface PreviewItem {
  id: 'button' | 'input' | 'card';
  label: string;
}

const PREVIEW_ITEMS: PreviewItem[] = [
  { id: 'button', label: 'Button' },
  { id: 'input', label: 'Input' },
  { id: 'card', label: 'Card' },
];

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
export class PreviewLayoutComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly previewItems = PREVIEW_ITEMS;
  readonly currentPreview = signal<PreviewItem['id']>('button');

  readonly safeUrl = (): SafeResourceUrl => {
    const url = `/preview/${this.currentPreview()}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  };

  setPreview(component: PreviewItem['id']): void {
    this.currentPreview.set(component);
  }
}
