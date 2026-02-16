import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { ChevronDown, ChevronUp, LucideAngularModule } from 'lucide-angular';

// Aligned with official shadcn preset (.vendor/aim/components/ui/accordion.tsx)

/**
 * Service-like context for accordion state management
 * This directive manages the accordion's expanded/collapsed state
 */
@Directive({
  selector: '[appAccordionRoot]',
  exportAs: 'accordionRoot',
})
export class AccordionRootDirective {
  readonly type = input<'single' | 'multiple'>('single');
  readonly collapsible = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly defaultValue = input<string | string[] | null>(null);

  // Controlled mode inputs and outputs
  readonly value = input<string | string[] | null>(null);
  readonly valueChange = output<string | string[]>();
  readonly onValueChange = output<{ value: string | string[] }>();

  // Track expanded items using a signal
  private readonly _expandedItems = signal<Set<string>>(new Set());

  private readonly initializeDefaultValueEffect = effect(() => {
    // Skip if controlled mode is active
    const controlledValue = this.value();
    if (controlledValue !== undefined && controlledValue !== null) {
      return;
    }

    const defaultValue = this.defaultValue();
    const type = this.type();
    if (!defaultValue) {
      this._expandedItems.set(new Set());
      return;
    }

    const values = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    const normalizedValues = type === 'single' ? values.slice(0, 1) : values;
    this._expandedItems.set(new Set(normalizedValues));
  });

  // Effect for controlled mode - listen to value changes
  private readonly controlledValueEffect = effect(() => {
    const controlledValue = this.value();
    if (controlledValue !== undefined && controlledValue !== null) {
      const values = Array.isArray(controlledValue)
        ? controlledValue
        : [controlledValue];
      this._expandedItems.set(new Set(values));
    }
  });

  isExpanded(itemId: string): boolean {
    return this._expandedItems().has(itemId);
  }

  toggle(itemId: string): void {
    let newValue: string | string[] | undefined;

    this._expandedItems.update((current) => {
      const newSet = new Set(current);

      if (newSet.has(itemId)) {
        if (this.collapsible()) {
          newSet.delete(itemId);
        }
      } else {
        if (this.type() === 'single') {
          newSet.clear();
        }
        newSet.add(itemId);
      }

      // Prepare the new value for output
      const values = Array.from(newSet);
      newValue = this.type() === 'single'
        ? (values[0] ?? '')
        : values;

      return newSet;
    });

    // Emit change events for controlled mode
    if (newValue !== undefined) {
      this.valueChange.emit(newValue);
      this.onValueChange.emit({ value: newValue });
    }
  }
}

/**
 * Accordion component that provides a collapsible content container.
 *
 * @example
 * ```html
 * <app-accordion>
 *   <app-accordion-item value="item-1">
 *     <app-accordion-trigger>Is it accessible?</app-accordion-trigger>
 *     <app-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</app-accordion-content>
 *   </app-accordion-item>
 * </app-accordion>
 * ```
 */
@Component({
  selector: 'app-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: AccordionRootDirective,
      inputs: ['type', 'collapsible', 'disabled', 'defaultValue', 'value'],
      outputs: ['valueChange', 'onValueChange'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"accordion"',
  },
  template: `<ng-content></ng-content>`,
})
export class AccordionComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('overflow-hidden rounded-md border flex w-full flex-col', this.class())
  );
}

/**
 * AccordionItem component that wraps a single accordion item.
 * Provides context for child trigger and content components.
 */
@Component({
  selector: 'app-accordion-item',
  exportAs: 'appAccordionItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"accordion-item"',
    '[attr.data-state]': 'expanded() ? "open" : "closed"',
  },
  template: `<ng-content></ng-content>`,
})
export class AccordionItemComponent {
  readonly class = input<string>('');
  readonly value = input<string>('');
  readonly disabled = input<boolean>(false);

  readonly accordionRoot = inject(AccordionRootDirective);

  readonly expanded = computed(() => {
    const val = this.value();
    if (!val) return false;
    return this.accordionRoot.isExpanded(val);
  });

  protected readonly computedClass = computed(() =>
    cn(
      'data-[state=open]:bg-muted/50 border-b last:border-b-0',
      this.class()
    )
  );

  toggle(): void {
    const val = this.value();
    if (!this.disabled() && val) {
      this.accordionRoot.toggle(val);
    }
  }
}

/**
 * AccordionTrigger component that toggles the accordion item.
 * Automatically injects parent AccordionItemComponent.
 */
@Component({
  selector: 'app-accordion-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  host: {},
  template: `
    <button
      type="button"
      [class]="computedClass()"
      [attr.data-slot]="'accordion-trigger'"
      [attr.aria-expanded]="item.expanded()"
      [disabled]="item.disabled()"
      (click)="item.toggle()"
    >
      <ng-content></ng-content>
      <lucide-icon
        data-slot="accordion-trigger-icon"
        [img]="chevronDownIcon"
        class="pointer-events-none ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200"
        [class.hidden]="item.expanded()"
        aria-hidden="true"
      ></lucide-icon>
      <lucide-icon
        data-slot="accordion-trigger-icon"
        [img]="chevronUpIcon"
        class="pointer-events-none ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200"
        [class.hidden]="!item.expanded()"
        aria-hidden="true"
      ></lucide-icon>
    </button>
  `,
})
export class AccordionTriggerComponent {
  readonly chevronDownIcon = ChevronDown;
  readonly chevronUpIcon = ChevronUp;

  readonly class = input<string>('');
  readonly item = inject(AccordionItemComponent);

  protected readonly computedClass = computed(() =>
    cn(
      '**:data-[slot=accordion-trigger-icon]:text-muted-foreground gap-6 p-2 text-left text-xs/relaxed font-medium hover:underline **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent transition-all outline-none disabled:pointer-events-none disabled:opacity-50',
      this.class()
    )
  );
}

/**
 * AccordionContent component that contains the expandable content.
 * Automatically injects parent AccordionItemComponent.
 */
@Component({
  selector: 'app-accordion-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {},
  template: `
    <div
      [attr.data-slot]="'accordion-content'"
      [attr.data-state]="item.expanded() ? 'open' : 'closed'"
      [attr.aria-hidden]="item.expanded() ? null : 'true'"
      [class]="wrapperClass()"
      role="region"
    >
      <div class="min-h-0 overflow-hidden" [attr.inert]="item.expanded() ? null : ''">
        <div [class]="contentClass()">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class AccordionContentComponent {
  readonly class = input<string>('');
  readonly item = inject(AccordionItemComponent);

  protected readonly wrapperClass = computed(() =>
    cn(
      'grid overflow-hidden text-xs/relaxed transition-[grid-template-rows] duration-200 ease-out',
      this.item.expanded()
        ? 'grid-rows-[1fr]'
        : 'grid-rows-[0fr]',
      this.class()
    )
  );

  protected readonly contentClass = computed(() =>
    cn(
      'pb-4 pt-0 px-2 [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4'
    )
  );
}
