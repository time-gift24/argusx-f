import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ChevronRight, LucideAngularModule, MoreHorizontal } from 'lucide-angular';

import { cn } from '../../utils/cn';
import {
  type ArgusxBreadcrumbAlign,
  type ArgusxBreadcrumbEllipsisColor,
  type ArgusxBreadcrumbSize,
  type ArgusxBreadcrumbWrap,
  argusxBreadcrumbEllipsisVariants,
  argusxBreadcrumbItemVariants,
  argusxBreadcrumbListVariants,
  argusxBreadcrumbVariants,
} from './breadcrumb.variants';

@Component({
  selector: 'argusx-breadcrumb, nav[argusxBreadcrumb]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"breadcrumb"',
    '[attr.aria-label]': '"breadcrumb"',
    '[attr.data-size]': 'size()',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxBreadcrumbComponent {
  private readonly classValue = signal('');
  private readonly sizeValue = signal<ArgusxBreadcrumbSize>('md');

  protected readonly class = this.classValue.asReadonly();
  protected readonly size = this.sizeValue.asReadonly();

  @Input('class')
  set hostClass(value: string | null | undefined) {
    this.classValue.set(value ?? '');
  }

  @Input({ alias: 'size' })
  set sizeInput(value: ArgusxBreadcrumbSize | null | undefined) {
    this.sizeValue.set(value ?? 'md');
  }

  protected readonly computedClass = computed(() =>
    cn(argusxBreadcrumbVariants({ size: this.size() }), this.class())
  );
}

@Component({
  selector: 'argusx-breadcrumb-list, ol[argusxBreadcrumbList]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"breadcrumb-list"',
    '[attr.data-align]': 'align()',
    '[attr.data-wrap]': 'wrap()',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxBreadcrumbListComponent {
  private readonly classValue = signal('');
  private readonly alignValue = signal<ArgusxBreadcrumbAlign>('start');
  private readonly wrapValue = signal<ArgusxBreadcrumbWrap>('wrap');

  protected readonly class = this.classValue.asReadonly();
  protected readonly align = this.alignValue.asReadonly();
  protected readonly wrap = this.wrapValue.asReadonly();

  @Input('class')
  set hostClass(value: string | null | undefined) {
    this.classValue.set(value ?? '');
  }

  @Input({ alias: 'align' })
  set alignInput(value: ArgusxBreadcrumbAlign | null | undefined) {
    this.alignValue.set(value ?? 'start');
  }

  @Input({ alias: 'wrap' })
  set wrapInput(value: ArgusxBreadcrumbWrap | null | undefined) {
    this.wrapValue.set(value ?? 'wrap');
  }

  protected readonly computedClass = computed(() =>
    cn(
      argusxBreadcrumbListVariants({
        align: this.align(),
        wrap: this.wrap(),
      }),
      this.class()
    )
  );
}

@Component({
  selector: 'argusx-breadcrumb-item, li[argusxBreadcrumbItem]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"breadcrumb-item"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxBreadcrumbItemComponent {
  private readonly classValue = signal('');

  protected readonly class = this.classValue.asReadonly();

  @Input('class')
  set hostClass(value: string | null | undefined) {
    this.classValue.set(value ?? '');
  }

  protected readonly computedClass = computed(() =>
    cn(argusxBreadcrumbItemVariants(), this.class())
  );
}

@Component({
  selector: 'argusx-breadcrumb-link, a[argusxBreadcrumbLink]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"breadcrumb-link"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxBreadcrumbLinkComponent {
  private readonly classValue = signal('');

  protected readonly class = this.classValue.asReadonly();

  @Input('class')
  set hostClass(value: string | null | undefined) {
    this.classValue.set(value ?? '');
  }

  protected readonly computedClass = computed(() =>
    cn('hover:text-foreground transition-colors', this.class())
  );
}

@Component({
  selector: 'argusx-breadcrumb-page, span[argusxBreadcrumbPage]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"breadcrumb-page"',
    '[attr.role]': '"link"',
    '[attr.aria-disabled]': 'true',
    '[attr.aria-current]': '"page"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxBreadcrumbPageComponent {
  private readonly classValue = signal('');

  protected readonly class = this.classValue.asReadonly();

  @Input('class')
  set hostClass(value: string | null | undefined) {
    this.classValue.set(value ?? '');
  }

  protected readonly computedClass = computed(() =>
    cn('text-foreground font-normal', this.class())
  );
}

@Component({
  selector: 'argusx-breadcrumb-separator, li[argusxBreadcrumbSeparator]',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    @if (!hasProjectedContent()) {
      <lucide-icon data-default-separator-icon [img]="chevronRightIcon" />
    }
  `,
  host: {
    '[attr.data-slot]': '"breadcrumb-separator"',
    '[attr.role]': '"presentation"',
    '[attr.aria-hidden]': 'true',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxBreadcrumbSeparatorComponent implements AfterContentChecked {
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly hasProjectedContentValue = signal(false);
  private readonly classValue = signal('');

  readonly chevronRightIcon = ChevronRight;

  protected readonly class = this.classValue.asReadonly();
  protected readonly hasProjectedContent = this.hasProjectedContentValue.asReadonly();

  @Input('class')
  set hostClass(value: string | null | undefined) {
    this.classValue.set(value ?? '');
  }

  protected readonly computedClass = computed(() =>
    cn('[&_svg]:size-[1em] [&_svg]:shrink-0', this.class())
  );

  ngAfterContentChecked(): void {
    const childNodes = this.hostElement.nativeElement.childNodes as NodeListOf<ChildNode>;
    const nextValue = Array.from(childNodes).some((node: ChildNode) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return (node.textContent ?? '').trim().length > 0;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return false;
      }

      const element = node as HTMLElement;
      return !(
        element.tagName.toLowerCase() === 'lucide-icon' &&
        element.hasAttribute('data-default-separator-icon')
      );
    });

    if (nextValue !== this.hasProjectedContentValue()) {
      this.hasProjectedContentValue.set(nextValue);
    }
  }
}

@Component({
  selector: 'argusx-breadcrumb-ellipsis, span[argusxBreadcrumbEllipsis]',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-icon [img]="moreHorizontalIcon" class="size-4" />
    <span class="sr-only">More</span>
  `,
  host: {
    '[attr.data-slot]': '"breadcrumb-ellipsis"',
    '[attr.data-color]': 'ellipsisColor()',
    '[attr.role]': '"presentation"',
    '[attr.aria-hidden]': 'true',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxBreadcrumbEllipsisComponent {
  private readonly classValue = signal('');
  private readonly ellipsisColorValue = signal<ArgusxBreadcrumbEllipsisColor>('muted');

  readonly moreHorizontalIcon = MoreHorizontal;

  protected readonly class = this.classValue.asReadonly();
  protected readonly ellipsisColor = this.ellipsisColorValue.asReadonly();

  @Input('class')
  set hostClass(value: string | null | undefined) {
    this.classValue.set(value ?? '');
  }

  @Input({ alias: 'ellipsisColor' })
  set ellipsisColorInput(value: ArgusxBreadcrumbEllipsisColor | null | undefined) {
    this.ellipsisColorValue.set(value ?? 'muted');
  }

  protected readonly computedClass = computed(() =>
    cn(
      argusxBreadcrumbEllipsisVariants({
        color: this.ellipsisColor(),
      }),
      this.class()
    )
  );
}

export const ArgusxBreadcrumbComponents = [
  ArgusxBreadcrumbComponent,
  ArgusxBreadcrumbListComponent,
  ArgusxBreadcrumbItemComponent,
  ArgusxBreadcrumbLinkComponent,
  ArgusxBreadcrumbPageComponent,
  ArgusxBreadcrumbSeparatorComponent,
  ArgusxBreadcrumbEllipsisComponent,
];
