import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  OnInit,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { cn } from '../../utils/cn';

export type ArgusxCollapsibleVariant = 'plain' | 'muted';
type CollapsibleState = 'open' | 'closed';

const CONTENT_VARIANT_CLASSES: Record<ArgusxCollapsibleVariant, string> = {
  plain: '',
  muted: 'rounded-md border border-border bg-muted/30 px-3 py-2',
};

export abstract class ArgusxCollapsibleRootToken {
  abstract open: ReturnType<typeof model<boolean>>;
  abstract disabled: () => boolean;
  abstract argusxVariant: () => ArgusxCollapsibleVariant;
  abstract state: () => CollapsibleState;
  abstract contentId: string;
  abstract triggerId: string;
  abstract toggle: () => void;
}

let collapsibleIdCounter = 0;

@Component({
  selector: 'argusx-collapsible',
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"collapsible"',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-variant]': 'argusxVariant()',
  },
  providers: [
    {
      provide: ArgusxCollapsibleRootToken,
      useExisting: forwardRef(() => ArgusxCollapsibleComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCollapsibleComponent implements ArgusxCollapsibleRootToken, OnInit {
  readonly open = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly defaultOpen = input(false, { transform: booleanAttribute });
  readonly argusxVariant = input<ArgusxCollapsibleVariant>('plain');
  readonly class = input<string>('');
  readonly onOpenChange = output<boolean>();

  private readonly instanceId = collapsibleIdCounter++;

  readonly contentId = `argusx-collapsible-content-${this.instanceId}`;
  readonly triggerId = `argusx-collapsible-trigger-${this.instanceId}`;
  readonly state = computed<CollapsibleState>(() => (this.open() ? 'open' : 'closed'));

  protected readonly computedClass = computed(() =>
    cn('group/collapsible flex w-full flex-col gap-2', this.class())
  );

  ngOnInit(): void {
    if (this.defaultOpen() && !this.open()) {
      this.open.set(true);
    }
  }

  toggle(): void {
    if (this.disabled()) {
      return;
    }

    const next = !this.open();
    this.open.set(next);
    this.onOpenChange.emit(next);
  }
}

@Directive({
  selector: '[argusxCollapsibleTrigger]',
  exportAs: 'argusxCollapsibleTrigger',
  host: {
    '[attr.data-slot]': '"collapsible-trigger"',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.id]': 'triggerId()',
    '[attr.aria-expanded]': 'open()',
    '[attr.aria-controls]': 'contentId()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.disabled]': 'supportsDisabledAttribute() && isDisabled() ? "" : null',
    '[attr.role]': 'role()',
    '[attr.tabindex]': 'tabIndex()',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class ArgusxCollapsibleTriggerDirective {
  private readonly collapsible = inject(ArgusxCollapsibleRootToken);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly asChild = input(false, { transform: booleanAttribute });
  readonly argusxCollapsibleTriggerAsChild = input(false, {
    transform: booleanAttribute,
  });
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly resolvedAsChild = computed(
    () => this.asChild() || this.argusxCollapsibleTriggerAsChild()
  );

  protected readonly open = computed(() => this.collapsible.open());
  protected readonly state = computed<CollapsibleState>(() => this.collapsible.state());
  protected readonly contentId = computed(() => this.collapsible.contentId);
  protected readonly triggerId = computed(() => this.collapsible.triggerId);
  protected readonly isDisabled = computed(() => this.collapsible.disabled() || this.disabled());

  private readonly tagName = computed(() => this.elementRef.nativeElement.tagName.toLowerCase());

  protected readonly supportsDisabledAttribute = computed(() => this.tagName() === 'button');
  private readonly isNaturallyInteractive = computed(
    () => this.tagName() === 'button' || this.tagName() === 'a'
  );

  protected readonly role = computed(() => {
    if (this.resolvedAsChild() || this.isNaturallyInteractive()) {
      return null;
    }

    return 'button';
  });

  protected readonly tabIndex = computed(() => {
    if (this.isDisabled()) {
      return -1;
    }

    if (this.resolvedAsChild() || this.isNaturallyInteractive()) {
      return null;
    }

    return 0;
  });

  onClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.collapsible.toggle();
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      return;
    }

    if (this.resolvedAsChild() || this.isNaturallyInteractive()) {
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.collapsible.toggle();
    }
  }
}

@Component({
  selector: 'argusx-collapsible-content',
  template: `
    <div class="min-h-0 overflow-hidden" [attr.inert]="open() ? null : ''">
      <div [class]="contentClass()">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  host: {
    '[class]': 'wrapperClass()',
    '[attr.id]': 'contentId',
    '[attr.data-slot]': '"collapsible-content"',
    '[attr.data-state]': 'state()',
    '[attr.role]': '"region"',
    '[attr.aria-labelledby]': 'triggerId',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCollapsibleContentComponent {
  private readonly collapsible = inject(ArgusxCollapsibleRootToken);

  readonly class = input<string>('');

  protected readonly open = computed(() => this.collapsible.open());
  protected readonly state = computed<CollapsibleState>(() => this.collapsible.state());
  protected readonly variant = computed(() => this.collapsible.argusxVariant());

  protected readonly contentId = this.collapsible.contentId;
  protected readonly triggerId = this.collapsible.triggerId;

  protected readonly wrapperClass = computed(() =>
    cn(
      'grid overflow-hidden text-sm transition-[grid-template-rows] duration-200 ease-out',
      this.open() ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
    )
  );

  protected readonly contentClass = computed(() =>
    cn(
      'min-h-0',
      CONTENT_VARIANT_CLASSES[this.variant()],
      this.class()
    )
  );
}

export const ArgusxCollapsibleImports = [
  ArgusxCollapsibleComponent,
  ArgusxCollapsibleTriggerDirective,
  ArgusxCollapsibleContentComponent,
] as const;
