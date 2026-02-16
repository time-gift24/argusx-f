import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';

// ============================================================================
// Avatar Root Token for DI
// ============================================================================

export abstract class AvatarRootToken {
  abstract size: () => 'default' | 'sm' | 'lg';
  abstract imageLoadingState: () => 'loading' | 'loaded' | 'error';
  abstract setImageLoadingState: (state: 'loading' | 'loaded' | 'error') => void;
}

// ============================================================================
// Avatar Root Component
// ============================================================================

/**
 * Avatar Component
 *
 * User avatar component supporting images, text fallbacks, and loading states.
 *
 * @example
 * ```html
 * <app-avatar>
 *   <img appAvatarImage src="/avatar.png" alt="User" />
 *   <span appAvatarFallback>UN</span>
 * </app-avatar>
 *
 * <app-avatar size="lg">
 *   <img appAvatarImage src="/avatar.png" alt="User" />
 *   <span appAvatarFallback>UN</span>
 * </app-avatar>
 * ```
 *
 * Reference: .vendor/aim/components/ui/avatar.tsx
 */
@Component({
  selector: 'app-avatar',
  imports: [CommonModule],
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'hostClass()',
    '[attr.data-slot]': '"avatar"',
    '[attr.data-size]': 'size()',
  },
  providers: [
    {
      provide: AvatarRootToken,
      useExisting: AvatarComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent implements AvatarRootToken {
  // ============================================================================
  // Inputs
  // ============================================================================
  readonly size = input<'default' | 'sm' | 'lg'>('default');
  readonly class = input<string>('');

  // ============================================================================
  // Internal State
  // ============================================================================

  /**
   * Image loading state: loading, loaded, or error
   */
  readonly imageLoadingState = signal<'loading' | 'loaded' | 'error'>('loading');

  // ============================================================================
  // Computed Properties
  // ============================================================================

  /**
   * Computed CSS classes for the avatar root
   * Aligned with official shadcn preset (.vendor/aim/components/ui/avatar.tsx)
   */
  protected readonly hostClass = computed(() =>
    cn(
      'group/avatar relative flex shrink-0 select-none overflow-hidden rounded-full',
      'after:absolute after:inset-0 after:rounded-full after:border after:mix-blend-darken dark:after:mix-blend-lighten after:border-border',
      'size-8 data-[size=lg]:size-10 data-[size=sm]:size-6',
      this.class()
    )
  );

  // ============================================================================
  // Public Methods
  // ============================================================================

  /**
   * Update image loading state
   */
  setImageLoadingState(state: 'loading' | 'loaded' | 'error'): void {
    this.imageLoadingState.set(state);
  }
}

// ============================================================================
// Avatar Image Directive
// ============================================================================

/**
 * Avatar Image Directive
 *
 * Image element for avatar with optimized loading and error handling.
 * Automatically shows fallback when image fails to load.
 *
 * @example
 * ```html
 * <img appAvatarImage src="/avatar.png" alt="User Name" />
 * ```
 */
@Directive({
  selector: 'img[appAvatarImage]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"avatar-image"',
    '(load)': 'onLoad()',
    '(error)': 'onError()',
  },
})
export class AvatarImageDirective {
  private readonly avatarRoot = inject(AvatarRootToken, { optional: true });
  private readonly elementRef = inject(ElementRef<HTMLImageElement>);

  readonly class = input<string>('');

  /**
   * Computed CSS classes for the avatar image
   * Aligned with official shadcn preset
   */
  protected readonly computedClass = computed(() =>
    cn(
      'aspect-square size-full object-cover',
      this.class()
    )
  );

  /**
   * Handle image load success
   */
  onLoad(): void {
    this.avatarRoot?.setImageLoadingState('loaded');
  }

  /**
   * Handle image load error
   */
  onError(): void {
    this.avatarRoot?.setImageLoadingState('error');
    // Hide the image element when it fails to load
    if (this.elementRef.nativeElement) {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }
}

// ============================================================================
// Avatar Fallback Directive
// ============================================================================

/**
 * Avatar Fallback Directive
 *
 * Fallback content shown when image is loading or has failed to load.
 * Displays user initials or other fallback content.
 *
 * @example
 * ```html
 * <span appAvatarFallback>UN</span>
 * ```
 */
@Directive({
  selector: '[appAvatarFallback]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"avatar-fallback"',
  },
})
export class AvatarFallbackDirective {
  private readonly avatarRoot = inject(AvatarRootToken, { optional: true });

  readonly class = input<string>('');

  /**
   * Computed CSS classes for the avatar fallback
   * Aligned with official shadcn preset
   */
  protected readonly computedClass = computed(() => {
    const size = this.avatarRoot?.size() ?? 'default';
    const loadingState = this.avatarRoot?.imageLoadingState() ?? 'loading';

    // Only show fallback when image is loading or has errored
    const shouldShow = loadingState === 'loading' || loadingState === 'error';

    return cn(
      'bg-muted text-muted-foreground flex size-full items-center justify-center text-sm',
      size === 'sm' && 'text-xs',
      shouldShow ? 'flex' : 'hidden',
      this.class()
    );
  });
}

// ============================================================================
// Avatar Badge Component
// ============================================================================

/**
 * Avatar Badge Component
 *
 * Status badge displayed on avatar (e.g., online status, notifications).
 *
 * @example
 * ```html
 * <app-avatar>
 *   <img appAvatarImage src="/avatar.png" alt="User" />
 *   <span appAvatarFallback>UN</span>
 *   <app-avatar-badge>
 *     <div class="size-2 rounded-full bg-green-500"></div>
 *   </app-avatar-badge>
 * </app-avatar>
 * ```
 */
@Component({
  selector: 'app-avatar-badge',
  imports: [CommonModule],
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"avatar-badge"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarBadgeComponent {
  private readonly avatarRoot = inject(AvatarRootToken, { optional: true });

  readonly class = input<string>('');

  /**
   * Computed CSS classes for the avatar badge
   * Aligned with official shadcn preset
   */
  protected readonly computedClass = computed(() => {
    const size = this.avatarRoot?.size() ?? 'default';

    return cn(
      'bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none',
      size === 'sm' && 'size-2 [&>svg]:hidden',
      size === 'default' && 'size-2.5 [&>svg]:size-2',
      size === 'lg' && 'size-3 [&>svg]:size-2',
      this.class()
    );
  });
}

// ============================================================================
// Avatar Group Component
// ============================================================================

/**
 * Avatar Group Component
 *
 * Container for stacked avatars with negative spacing.
 *
 * @example
 * ```html
 * <app-avatar-group>
 *   <app-avatar><img appAvatarImage src="/1.png" /></app-avatar>
 *   <app-avatar><img appAvatarImage src="/2.png" /></app-avatar>
 *   <app-avatar-group-count>+5</app-avatar-group-count>
 * </app-avatar-group>
 * ```
 */
@Component({
  selector: 'app-avatar-group',
  imports: [CommonModule],
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"avatar-group"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarGroupComponent {
  readonly class = input<string>('');

  /**
   * Computed CSS classes for the avatar group
   * Aligned with official shadcn preset
   */
  protected readonly computedClass = computed(() =>
    cn(
      'group/avatar-group flex -space-x-2',
      // Add ring to avatars inside group
      '*:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background',
      this.class()
    )
  );
}

// ============================================================================
// Avatar Group Count Component
// ============================================================================

/**
 * Avatar Group Count Component
 *
 * Display count of additional avatars in a group.
 *
 * @example
 * ```html
 * <app-avatar-group>
 *   <app-avatar>...</app-avatar>
 *   <app-avatar>...</app-avatar>
 *   <app-avatar-group-count>+5</app-avatar-group-count>
 * </app-avatar-group>
 * ```
 */
@Component({
  selector: 'app-avatar-group-count',
  imports: [CommonModule],
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"avatar-group-count"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarGroupCountComponent {
  readonly class = input<string>('');

  /**
   * Computed CSS classes for the avatar group count
   * Aligned with official shadcn preset
   */
  protected readonly computedClass = computed(() =>
    cn(
      'bg-muted text-muted-foreground size-8 rounded-full text-xs/relaxed relative flex shrink-0 items-center justify-center ring-2 ring-border',
      // Responsive size based on parent group size
      'group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5',
      'group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
      '[&>svg]:size-4',
      this.class()
    )
  );
}

// ============================================================================
// Exports
// ============================================================================

export const AvatarComponents = [
  AvatarComponent,
  AvatarImageDirective,
  AvatarFallbackDirective,
  AvatarBadgeComponent,
  AvatarGroupComponent,
  AvatarGroupCountComponent,
];
