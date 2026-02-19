import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  booleanAttribute,
  computed,
  signal,
} from '@angular/core';
import type { ClassValue } from 'clsx';

import { ButtonDirective } from '../button/button.directive';
import { cn } from '../../utils/cn';

import {
  ArgusxCardSize,
  cardBodyVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardVariants,
} from './card.variants';

const HEADER_BORDER_PADDING: Record<ArgusxCardSize, string> = {
  default: 'pb-6',
  sm: 'pb-4',
  lg: 'pb-8',
};

const FOOTER_BORDER_PADDING: Record<ArgusxCardSize, string> = {
  default: 'pt-6',
  sm: 'pt-4',
  lg: 'pt-8',
};

@Directive({
  selector: '[card-action]',
})
export class ArgusxCardActionDirective {}

@Component({
  selector: 'argusx-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, ButtonDirective],
  host: {
    'data-slot': 'card',
    '[attr.data-size]': 'size()',
    '[class]': 'classes()',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
  },
  template: `
    @if (hasTitle()) {
      <div [class]="headerClasses()" data-slot="card-header">
        <div class="leading-none font-semibold" [id]="titleId()" data-slot="card-title">
          @if (titleTemplate(); as template) {
            <ng-container *ngTemplateOutlet="template"></ng-container>
          } @else {
            {{ titleText() }}
          }
        </div>

        @if (hasDescription()) {
          <div class="text-muted-foreground text-sm" [id]="descriptionId()" data-slot="card-description">
            @if (descriptionTemplate(); as template) {
              <ng-container *ngTemplateOutlet="template"></ng-container>
            } @else {
              {{ descriptionText() }}
            }
          </div>
        }

        @if (hasActionSlot()) {
          <div class="col-start-2 row-span-2 row-start-1 self-start justify-self-end" data-slot="card-action">
            <ng-content select="[card-action]" />
          </div>
        } @else if (action()) {
          <button
            argusButton
            type="button"
            variant="link"
            class="col-start-2 row-span-2 row-start-1 self-start justify-self-end"
            data-slot="card-action"
            (click)="onActionClick()"
          >
            {{ action() }}
          </button>
        }
      </div>
    }

    <div [class]="bodyClasses()" data-slot="card-content">
      <ng-content />
    </div>

    <div [class]="footerClasses()" data-slot="card-footer">
      <ng-content select="[card-footer]" />
    </div>
  `,
  styles: `
    [data-slot='card-footer']:empty {
      display: none;
    }
  `,
})
export class ArgusxCardComponent {
  private static nextId = 0;

  private readonly cardId = `argusx-card-${ArgusxCardComponent.nextId++}`;

  @ContentChild(ArgusxCardActionDirective)
  private projectedActionSlot?: ArgusxCardActionDirective;

  private readonly classValue = signal<ClassValue>('');
  private readonly sizeValue = signal<ArgusxCardSize>('default');
  private readonly titleValue = signal<string | TemplateRef<void> | undefined>(undefined);
  private readonly descriptionValue = signal<string | TemplateRef<void> | undefined>(undefined);
  private readonly actionValue = signal('');
  private readonly headerBorderValue = signal(false);
  private readonly footerBorderValue = signal(false);

  protected readonly class = this.classValue.asReadonly();
  protected readonly size = this.sizeValue.asReadonly();
  protected readonly title = this.titleValue.asReadonly();
  protected readonly description = this.descriptionValue.asReadonly();
  protected readonly action = this.actionValue.asReadonly();
  protected readonly headerBorder = this.headerBorderValue.asReadonly();
  protected readonly footerBorder = this.footerBorderValue.asReadonly();

  @Input('class')
  set hostClass(value: ClassValue | null | undefined) {
    this.classValue.set(value ?? '');
  }

  @Input('size')
  set sizeInput(value: ArgusxCardSize | null | undefined) {
    this.sizeValue.set(value ?? 'default');
  }

  @Input('title')
  set titleInput(value: string | TemplateRef<void> | undefined) {
    this.titleValue.set(value);
  }

  @Input('description')
  set descriptionInput(value: string | TemplateRef<void> | undefined) {
    this.descriptionValue.set(value);
  }

  @Input('action')
  set actionInput(value: string | null | undefined) {
    this.actionValue.set(value ?? '');
  }

  @Input({ alias: 'headerBorder', transform: booleanAttribute })
  set headerBorderInput(value: boolean) {
    this.headerBorderValue.set(value);
  }

  @Input({ alias: 'footerBorder', transform: booleanAttribute })
  set footerBorderInput(value: boolean) {
    this.footerBorderValue.set(value);
  }

  @Output() readonly actionClick = new EventEmitter<void>();

  protected readonly titleTemplate = computed(() => {
    const value = this.title();
    return value instanceof TemplateRef ? value : null;
  });

  protected readonly titleText = computed(() => {
    const value = this.title();
    return typeof value === 'string' ? value : '';
  });

  protected readonly descriptionTemplate = computed(() => {
    const value = this.description();
    return value instanceof TemplateRef ? value : null;
  });

  protected readonly descriptionText = computed(() => {
    const value = this.description();
    return typeof value === 'string' ? value : '';
  });

  protected readonly hasTitle = computed(() => {
    const value = this.title();
    return value instanceof TemplateRef || !!value;
  });

  protected readonly hasDescription = computed(() => {
    if (!this.hasTitle()) {
      return false;
    }

    const value = this.description();
    return value instanceof TemplateRef || !!value;
  });

  protected readonly titleId = computed(() => (this.hasTitle() ? `${this.cardId}-title` : null));
  protected readonly descriptionId = computed(() =>
    this.hasDescription() ? `${this.cardId}-description` : null
  );

  protected readonly classes = computed(() => cn(cardVariants({ size: this.size() }), this.class()));
  protected readonly headerClasses = computed(() =>
    cn(
      cardHeaderVariants({ size: this.size() }),
      this.headerBorder() && 'border-b',
      this.headerBorder() && HEADER_BORDER_PADDING[this.size()]
    )
  );
  protected readonly bodyClasses = computed(() => cn(cardBodyVariants({ size: this.size() })));
  protected readonly footerClasses = computed(() =>
    cn(
      cardFooterVariants({ size: this.size() }),
      this.footerBorder() && 'border-t',
      this.footerBorder() && FOOTER_BORDER_PADDING[this.size()]
    )
  );

  protected onActionClick(): void {
    this.actionClick.emit();
  }

  protected hasActionSlot(): boolean {
    return !!this.projectedActionSlot;
  }
}
