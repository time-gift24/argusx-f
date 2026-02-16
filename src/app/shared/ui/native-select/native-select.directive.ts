import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with official shadcn preset (.vendor/aim/components/ui/native-select.tsx)
const nativeSelectWrapperVariants = cva(
  'group/native-select relative w-fit has-[select:disabled]:opacity-50',
  {
    variants: {
      size: {
        sm: '',
        default: '',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const nativeSelectVariants = cva(
  'border-input bg-input/20 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-7 w-full min-w-0 appearance-none rounded-md border py-0.5 pr-6 pl-2 text-xs/relaxed transition-colors select-none focus-visible:ring-2 aria-invalid:ring-2 data-[size=sm]:h-6 data-[size=sm]:text-[0.625rem] outline-none disabled:pointer-events-none disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: '',
        default: '',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

type NativeSelectVariants = VariantProps<typeof nativeSelectVariants>;

/**
 * Directive that applies native select wrapper styles to a div element.
 * This wrapper contains the select element and the chevron icon.
 *
 * @example
 * ```html
 * <div appNativeSelectWrapper [size]="'sm'" [class]="'max-w-sm'">
 *   <select appNativeSelect>
 *     <option>Option 1</option>
 *   </select>
 *   <lucide-icon appNativeSelectIcon [img]="ChevronDown"></lucide-icon>
 * </div>
 * ```
 */
@Directive({
  selector: 'div[appNativeSelectWrapper]',
  host: {
    '[class]': 'computedWrapperClass()',
    '[attr.data-slot]': '"native-select-wrapper"',
    '[attr.data-size]': 'size()',
  },
})
export class NativeSelectWrapperDirective {
  readonly size = input<'sm' | 'default'>('default');
  readonly class = input<string>('');

  protected readonly computedWrapperClass = computed(() =>
    cn(nativeSelectWrapperVariants({ size: this.size() }), this.class())
  );
}

/**
 * Directive that applies native select styles to a select element.
 * Use on <select> elements to provide consistent styling for form selects.
 *
 * @example
 * ```html
 * <div appNativeSelectWrapper>
 *   <select appNativeSelect [size]="'sm'">
 *     <option value="1">Option 1</option>
 *     <option value="2">Option 2</option>
 *   </select>
 *   <lucide-icon appNativeSelectIcon [img]="ChevronDown"></lucide-icon>
 * </div>
 * ```
 */
@Directive({
  selector: 'select[appNativeSelect]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"native-select"',
    '[attr.data-size]': 'size()',
  },
})
export class NativeSelectDirective {
  readonly size = input<'sm' | 'default'>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(nativeSelectVariants({ size: this.size() }), this.class())
  );
}

/**
 * Directive that applies native select option styles to an option element.
 * Use on <option> elements within a native select.
 *
 * @example
 * ```html
 * <select appNativeSelect>
 *   <option appNativeSelectOption value="1">Option 1</option>
 *   <option appNativeSelectOption value="2" disabled>Option 2</option>
 * </select>
 * ```
 */
@Directive({
  selector: 'option[appNativeSelectOption]',
  host: {
    '[attr.data-slot]': '"native-select-option"',
  },
})
export class NativeSelectOptionDirective {
  // No specific styling needed for options - native browser styling is used
  // This directive exists for API consistency and potential future enhancements
}

/**
 * Directive that applies native select optgroup styles to an optgroup element.
 * Use on <optgroup> elements within a native select.
 *
 * @example
 * ```html
 * <select appNativeSelect>
 *   <optgroup appNativeSelectOptGroup label="Group 1">
 *     <option appNativeSelectOption value="1">Option 1</option>
 *   </optgroup>
 * </select>
 * ```
 */
@Directive({
  selector: 'optgroup[appNativeSelectOptGroup]',
  host: {
    '[attr.data-slot]': '"native-select-optgroup"',
    '[class]': 'computedClass()',
  },
})
export class NativeSelectOptGroupDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(this.class()));
}

/**
 * Directive that styles the chevron icon for the native select.
 * Position the icon absolutely on the right side of the select wrapper.
 *
 * @example
 * ```html
 * <div appNativeSelectWrapper>
 *   <select appNativeSelect>
 *     <option>Option 1</option>
 *   </select>
 *   <lucide-icon appNativeSelectIcon [img]="ChevronDown"></lucide-icon>
 * </div>
 * ```
 */
@Directive({
  selector: 'lucide-icon[appNativeSelectIcon]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"native-select-icon"',
    '[attr.aria-hidden]': 'true',
  },
})
export class NativeSelectIconDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground top-1/2 right-1.5 size-3.5 -translate-y-1/2 pointer-events-none absolute select-none flex items-center justify-center [&_svg]:size-full [&_svg]:block',
      'group-data-[size=sm]/native-select:size-3 group-data-[size=sm]/native-select:-translate-y-[calc(--spacing(1.25))]',
      this.class()
    )
  );
}

// Export variants for external use
export { nativeSelectWrapperVariants, nativeSelectVariants };
export type { NativeSelectVariants };

/**
 * Token for dependency injection if needed in child components
 */
export abstract class NativeSelectRootToken {
  abstract size: () => 'sm' | 'default';
}
