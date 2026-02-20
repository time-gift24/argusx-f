import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgusxButtonDirective } from '@app/shared/ui/button';
import { InputGroupAddonComponent, InputGroupComponent, InputGroupInputComponent } from '@app/shared/ui/input-group';
import { ArgusxKbdDirective, ArgusxKbdGroupDirective } from '@app/shared/ui/kbd';
import { ArgusxTooltipDirective, ArgusxTooltipContentComponent } from '@app/shared/ui/tooltip';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CircleDashedIcon,
  LucideAngularModule,
  SaveIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-kbd-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucideAngularModule,
    ArgusxButtonDirective,
    ArgusxKbdDirective,
    ArgusxKbdGroupDirective,
    ArgusxTooltipDirective,
    ArgusxTooltipContentComponent,
    InputGroupComponent,
    InputGroupAddonComponent,
    InputGroupInputComponent,
  ],
  template: `
    <div
      class="mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 2xl:max-w-6xl"
    >
      <div class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Basic</div>
        <div
          class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full"
        >
          <div class="flex items-center gap-2">
            <kbd argusx-kbd>Ctrl</kbd>
            <kbd argusx-kbd>⌘K</kbd>
            <kbd argusx-kbd>Ctrl + B</kbd>
          </div>
        </div>
      </div>

      <div class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Modifier Keys</div>
        <div
          class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full"
        >
          <div class="flex items-center gap-2">
            <kbd argusx-kbd>⌘</kbd>
            <kbd argusx-kbd>C</kbd>
          </div>
        </div>
      </div>

      <div class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">KbdGroup</div>
        <div
          class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full"
        >
          <kbd argusx-kbd-group class="inline-flex items-center">
            <kbd argusx-kbd>Ctrl</kbd>
            <kbd argusx-kbd>Shift</kbd>
            <kbd argusx-kbd>P</kbd>
          </kbd>
        </div>
      </div>

      <div class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Arrow Keys</div>
        <div
          class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full"
        >
          <div class="flex items-center gap-2">
            <kbd argusx-kbd>↑</kbd>
            <kbd argusx-kbd>↓</kbd>
            <kbd argusx-kbd>←</kbd>
            <kbd argusx-kbd>→</kbd>
          </div>
        </div>
      </div>

      <div class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Icons</div>
        <div
          class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full"
        >
          <kbd argusx-kbd-group class="inline-flex items-center">
            <kbd argusx-kbd>
              <lucide-icon [img]="circleDashedIcon"></lucide-icon>
            </kbd>
            <kbd argusx-kbd>
              <lucide-icon [img]="arrowLeftIcon"></lucide-icon>
            </kbd>
            <kbd argusx-kbd>
              <lucide-icon [img]="arrowRightIcon"></lucide-icon>
            </kbd>
          </kbd>
        </div>
      </div>

      <div class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">
          With Icons and Text
        </div>
        <div
          class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full"
        >
          <kbd argusx-kbd-group class="inline-flex items-center">
            <kbd argusx-kbd>
              <lucide-icon [img]="arrowLeftIcon"></lucide-icon>
              Left
            </kbd>
            <kbd argusx-kbd>
              <lucide-icon [img]="circleDashedIcon"></lucide-icon>
              Voice Enabled
            </kbd>
          </kbd>
        </div>
      </div>

      <div class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">InputGroup</div>
        <div
          class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full"
        >
          <argusx-input-group>
            <argusx-input-group-input />
            <argusx-input-group-addon align="inline-start">
              <kbd argusx-kbd>Space</kbd>
            </argusx-input-group-addon>
          </argusx-input-group>
        </div>
      </div>

      <div class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Tooltip</div>
        <div
          class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full"
        >
          <button
            argusx-button
            size="icon-sm"
            variant="outline"
            [argusxTooltip]="saveTooltip"
            argusxTooltipPosition="top"
          >
            <lucide-icon [img]="saveIcon"></lucide-icon>
          </button>
          <ng-template #saveTooltip>
            <div class="flex items-center gap-2">
              Save Changes <kbd argusx-kbd>S</kbd>
            </div>
          </ng-template>
        </div>
      </div>

      <div class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With samp</div>
        <div
          class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full"
        >
          <kbd argusx-kbd><samp>File</samp></kbd>
        </div>
      </div>
    </div>
  `,
})
export class KbdPreviewComponent {
  protected readonly arrowLeftIcon = ArrowLeftIcon;
  protected readonly arrowRightIcon = ArrowRightIcon;
  protected readonly circleDashedIcon = CircleDashedIcon;
  protected readonly saveIcon = SaveIcon;
}
