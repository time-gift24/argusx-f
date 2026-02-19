import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArgusxButtonDirective } from '@app/shared/ui/button';
import { SheetComponents, type SheetSide } from '@app/shared/ui/sheet';

@Component({
  selector: 'app-sheet-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SheetComponents, ArgusxButtonDirective],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Sheet</h1>
      <p class="mb-8 text-muted-foreground">
        A side panel built on overlay primitives for contextual tasks.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Position</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="flex flex-wrap gap-2">
            @for (item of sides; track item) {
              <button
                argusx-button
                variant="outline"
                size="sm"
                [class.bg-muted]="sheetSide() === item"
                (click)="sheetSide.set(item)"
              >
                {{ item }}
              </button>
            }
          </div>

          <argusx-sheet [side]="sheetSide()">
            <button argusx-button argusxSheetTrigger>Open Sheet</button>

            <argusx-sheet-content>
              <argusx-sheet-header>
                <argusx-sheet-title>Edit profile</argusx-sheet-title>
                <argusx-sheet-description>
                  Update your profile information. Click save when you are done.
                </argusx-sheet-description>
              </argusx-sheet-header>

              <div class="px-6 space-y-3">
                <div class="space-y-1">
                  <p class="text-[11px] font-medium">Name</p>
                  <div class="rounded-md border bg-muted/30 px-2 py-1.5 text-xs">Wanyao Zhong</div>
                </div>
                <div class="space-y-1">
                  <p class="text-[11px] font-medium">Email</p>
                  <div class="rounded-md border bg-muted/30 px-2 py-1.5 text-xs">wanyao@example.com</div>
                </div>
              </div>

              <argusx-sheet-footer>
                <button argusx-button variant="outline" argusxSheetClose>Cancel</button>
                <button argusx-button argusxSheetClose>Save changes</button>
              </argusx-sheet-footer>
            </argusx-sheet-content>
          </argusx-sheet>
        </div>
      </section>
    </div>
  `,
})
export class SheetPreviewComponent {
  readonly sides = ['top', 'right', 'bottom', 'left'] as const;
  readonly sheetSide = signal<SheetSide>('right');
}
