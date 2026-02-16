import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
  OnInit,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';

// ============================================================================
// Collapsible Root Token for DI
// ============================================================================

export abstract class CollapsibleRootToken {
  abstract open: ReturnType<typeof model<boolean>>;
  abstract disabled: () => boolean;
  abstract contentId: string;
  abstract triggerId: string;
  abstract toggle: () => void;
}

// ============================================================================
// Collapsible Root Component
// ============================================================================

let collapsibleIdCounter = 0;

/**
 * Collapsible Component
 *
 * A collapsible component that shows/hides content with smooth animations.
 *
 * @example
 * ```html
 * <app-collapsible [(open)]="isOpen">
 *   <app-collapsible-trigger>Toggle</app-collapsible-trigger>
 *   <app-collapsible-content>
 *     Content that can be collapsed
 *   </app-collapsible-content>
 * </app-collapsible>
 * ```
 *
 * Reference: .vendor/aim/components/ui/collapsible.tsx
 */
@Component({
  selector: 'app-collapsible',
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  host: {
    '[attr.data-slot]': '"collapsible"',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  providers: [
    {
      provide: CollapsibleRootToken,
      useExisting: forwardRef(() => CollapsibleComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsibleComponent implements CollapsibleRootToken, OnInit {
  // ============================================================================
  // Inputs
  // ============================================================================
  readonly open = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly defaultOpen = input<boolean>(false);
  readonly onOpenChange = output<boolean>();

  // ============================================================================
  // Internal State
  // ============================================================================
  private readonly instanceId = collapsibleIdCounter++;
  readonly contentId = `collapsible-content-${this.instanceId}`;
  readonly triggerId = `collapsible-trigger-${this.instanceId}`;

  // ============================================================================
  // Computed Properties
  // ============================================================================

  /**
   * Visual state for styling
   */
  protected readonly state = computed<'open' | 'closed'>(() =>
    this.open() ? 'open' : 'closed'
  );

  // ============================================================================
  // Methods
  // ============================================================================

  /**
   * Toggle collapsible state
   */
  toggle(): void {
    if (this.disabled()) return;

    this.open.update((value) => !value);
    this.onOpenChange.emit(this.open());
  }

  // ============================================================================
  // Lifecycle
  // ============================================================================

  ngOnInit(): void {
    // defaultOpen is only an initial state hint and should not override later updates.
    if (this.defaultOpen() && !this.open()) {
      this.open.set(true);
    }
  }
}

// ============================================================================
// Collapsible Trigger Component
// ============================================================================

/**
 * Collapsible Trigger Component
 *
 * A button that toggles the collapsible state.
 *
 * @example
 * ```html
 * <app-collapsible-trigger>
 *   <button>Toggle content</button>
 * </app-collapsible-trigger>
 * ```
 */
@Component({
  selector: 'app-collapsible-trigger',
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  host: {
    '[attr.data-slot]': '"collapsible-trigger"',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.id]': 'triggerId()',
    '[attr.role]': '"button"',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.aria-expanded]': 'open()',
    '[attr.aria-controls]': 'contentId()',
    '[attr.disabled]': 'disabled() ? "" : null',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsibleTriggerComponent {
  // ============================================================================
  // Dependency Injection
  // ============================================================================
  protected readonly collapsible = inject(CollapsibleRootToken);

  // ============================================================================
  // Computed Properties
  // ============================================================================

  protected readonly open = computed(() => this.collapsible.open());
  protected readonly disabled = computed(() => this.collapsible.disabled());
  protected readonly contentId = computed(() => this.collapsible.contentId);
  protected readonly triggerId = computed(() => this.collapsible.triggerId);

  protected readonly state = computed<'open' | 'closed'>(() =>
    this.open() ? 'open' : 'closed'
  );

  // ============================================================================
  // Event Handlers
  // ============================================================================

  onClick(): void {
    this.collapsible.toggle();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.collapsible.toggle();
    }
  }
}

// ============================================================================
// Collapsible Content Component
// ============================================================================

/**
 * Collapsible Content Component
 *
 * The content area that can be shown/hidden.
 * Uses CSS transitions for smooth animations.
 *
 * @example
 * ```html
 * <app-collapsible-content>
 *   <p>Hidden content goes here</p>
 * </app-collapsible-content>
 * ```
 */
@Component({
  selector: 'app-collapsible-content',
  imports: [CommonModule],
  template: `
    <div
      [id]="contentId"
      [class]="computedClass()"
      [attr.data-state]="state()"
      [attr.role]="'region'"
      [attr.aria-labelledby]="triggerId"
      [style.overflow]="'hidden'"
      [style.max-height]="maxHeight()"
      [style.transition]="'max-height 200ms ease-out'"
    >
      <div [class]="'collapsible-content-inner'">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"collapsible-content"',
    '[attr.data-state]': 'state()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsibleContentComponent {
  // ============================================================================
  // Dependency Injection
  // ============================================================================
  protected readonly collapsible = inject(CollapsibleRootToken);

  // ============================================================================
  // Inputs
  // ============================================================================
  readonly class = input<string>('');

  // ============================================================================
  // Computed Properties
  // ============================================================================

  protected readonly contentId = this.collapsible.contentId;
  protected readonly triggerId = this.collapsible.triggerId;

  protected readonly open = computed(() => this.collapsible.open());

  protected readonly state = computed<'open' | 'closed'>(() =>
    this.open() ? 'open' : 'closed'
  );

  /**
   * Max height for animation - 0 when closed, fit-content when open
   * Note: For production, you'd want to measure actual content height
   */
  protected readonly maxHeight = computed(() =>
    this.open() ? 'none' : '0px'
  );

  protected readonly computedClass = computed(() =>
    cn(
      'overflow-hidden transition-[max-height] duration-200 ease-out',
      this.class()
    )
  );
}

// ============================================================================
// Exports
// ============================================================================

export const CollapsibleComponents = [
  CollapsibleComponent,
  CollapsibleTriggerComponent,
  CollapsibleContentComponent,
];
