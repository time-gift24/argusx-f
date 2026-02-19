import { cva, type VariantProps } from 'class-variance-authority';
import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';

// Table variants - plain style defaults
export const tableContainerVariants = cva('relative w-full overflow-x-auto', {
  variants: {},
  defaultVariants: {},
});

export const tableVariants = cva(
  'w-full caption-bottom text-xs',
  {
    variants: {
      argusxType: {
        default: '',
        striped: '[&_tbody_tr:nth-child(odd)]:bg-muted/50',
        bordered: 'border border-border',
      },
      argusxSize: {
        default: '',
        compact: '[&_td]:py-1 [&_th]:py-1',
        comfortable: '[&_td]:py-4 [&_th]:py-4',
      },
    },
    defaultVariants: {
      argusxType: 'default',
      argusxSize: 'default',
    },
  }
);

export const tableHeaderVariants = cva('[&_tr]:border-b', {
  variants: {},
  defaultVariants: {},
});

export const tableBodyVariants = cva('[&_tr:last-child]:border-0', {
  variants: {},
  defaultVariants: {},
});

export const tableFooterVariants = cva('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', {
  variants: {},
  defaultVariants: {},
});

export const tableRowVariants = cva(
  'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const tableHeadVariants = cva(
  'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const tableCellVariants = cva(
  'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const tableCaptionVariants = cva('text-muted-foreground mt-4 text-xs', {
  variants: {},
  defaultVariants: {},
});

// Type exports
export type TableContainerVariants = VariantProps<typeof tableContainerVariants>;
export type TableVariants = VariantProps<typeof tableVariants>;
export type TableTypeVariants = TableVariants['argusxType'];
export type TableSizeVariants = TableVariants['argusxSize'];

/**
 * Table Container Directive
 * Wraps the table element for overflow handling
 */
@Directive({
  selector: '[argusxTableContainer]',
  host: {
    '[attr.data-slot]': '"table-container"',
    '[class]': 'computedClass()',
  },
})
export class TableContainerDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(tableContainerVariants(), this.class())
  );
}

/**
 * Table Directive
 * Applies table styles to a table element
 */
@Directive({
  selector: 'table[argusxTable]',
  host: {
    '[attr.data-slot]': '"table"',
    '[class]': 'computedClass()',
  },
})
export class TableDirective {
  readonly class = input<string>('');
  readonly argusxType = input<TableTypeVariants>('default');
  readonly argusxSize = input<TableSizeVariants>('default');

  protected readonly computedClass = computed(() =>
    cn(
      tableVariants({
        argusxType: this.argusxType(),
        argusxSize: this.argusxSize(),
      }),
      this.class()
    )
  );
}

/**
 * Table Header Directive
 * Applies header styles to thead element
 */
@Directive({
  selector: 'thead[argusxTableHeader]',
  host: {
    '[attr.data-slot]': '"table-header"',
    '[class]': 'computedClass()',
  },
})
export class TableHeaderDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(tableHeaderVariants(), this.class())
  );
}

/**
 * Table Body Directive
 * Applies body styles to tbody element
 */
@Directive({
  selector: 'tbody[argusxTableBody]',
  host: {
    '[attr.data-slot]': '"table-body"',
    '[class]': 'computedClass()',
  },
})
export class TableBodyDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(tableBodyVariants(), this.class())
  );
}

/**
 * Table Footer Directive
 * Applies footer styles to tfoot element
 */
@Directive({
  selector: 'tfoot[argusxTableFooter]',
  host: {
    '[attr.data-slot]': '"table-footer"',
    '[class]': 'computedClass()',
  },
})
export class TableFooterDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(tableFooterVariants(), this.class())
  );
}

/**
 * Table Row Directive
 * Applies row styles to tr element
 */
@Directive({
  selector: 'tr[argusxTableRow]',
  host: {
    '[attr.data-slot]': '"table-row"',
    '[class]': 'computedClass()',
  },
})
export class TableRowDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(tableRowVariants(), this.class())
  );
}

/**
 * Table Head Directive
 * Applies header cell styles to th element
 */
@Directive({
  selector: 'th[argusxTableHead]',
  host: {
    '[attr.data-slot]': '"table-head"',
    '[class]': 'computedClass()',
  },
})
export class TableHeadDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(tableHeadVariants(), this.class())
  );
}

/**
 * Table Cell Directive
 * Applies cell styles to td element
 */
@Directive({
  selector: 'td[argusxTableCell]',
  host: {
    '[attr.data-slot]': '"table-cell"',
    '[class]': 'computedClass()',
  },
})
export class TableCellDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(tableCellVariants(), this.class())
  );
}

/**
 * Table Caption Directive
 * Applies caption styles to caption element
 */
@Directive({
  selector: 'caption[argusxTableCaption]',
  host: {
    '[attr.data-slot]': '"table-caption"',
    '[class]': 'computedClass()',
  },
})
export class TableCaptionDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(tableCaptionVariants(), this.class())
  );
}

// Export all directives
export const TableDirectives = [
  TableContainerDirective,
  TableDirective,
  TableHeaderDirective,
  TableBodyDirective,
  TableFooterDirective,
  TableRowDirective,
  TableHeadDirective,
  TableCellDirective,
  TableCaptionDirective,
];
