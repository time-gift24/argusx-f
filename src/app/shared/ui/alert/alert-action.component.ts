import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * AlertAction component for displaying action buttons in an alert.
 * Typically used for close buttons or other actions.
 * Should be used as a child of AlertComponent.
 *
 * @example
 * ```html
 * <app-alert (close)="handleClose()">
 *   <app-alert-title>Update available</app-alert-title>
 *   <app-alert-description>A new version is ready to install.</app-alert-description>
 *   <app-alert-action>
 *     <button argusx-button variant="ghost" size="icon" (click)="handleClose()">
 *       <lucide-icon [img]="xIcon"></lucide-icon>
 *     </button>
 *   </app-alert-action>
 * </app-alert>
 * ```
 */
@Component({
  selector: 'app-alert-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"alert-action"',
    '[class]': 'computedClass()',
  },
})
export class AlertActionComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn("col-span-2 mt-2 flex items-center justify-end gap-2", this.class())
  );
}
