import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * Table Container Directive
 * Wraps the table element for overflow handling
 */
@Directive({
  selector: '[appTableContainer]',
  host: {
    '[attr.data-slot]': '"table-container"',
    '[class]': 'computedClass()',
  },
})
export class TableContainerDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('relative w-full overflow-x-auto', this.class())
  );
}

/**
 * Table Directive
 * Applies table styles to a table element
 */
@Directive({
  selector: 'table[appTable]',
  host: {
    '[attr.data-slot]': '"table"',
    '[class]': 'computedClass()',
  },
})
export class TableDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('w-full caption-bottom text-xs', this.class())
  );
}

/**
 * Table Header Directive
 * Applies header styles to thead element
 */
@Directive({
  selector: 'thead[appTableHeader]',
  host: {
    '[attr.data-slot]': '"table-header"',
    '[class]': 'computedClass()',
  },
})
export class TableHeaderDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('[&_tr]:border-b', this.class())
  );
}

/**
 * Table Body Directive
 * Applies body styles to tbody element
 */
@Directive({
  selector: 'tbody[appTableBody]',
  host: {
    '[attr.data-slot]': '"table-body"',
    '[class]': 'computedClass()',
  },
})
export class TableBodyDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('[&_tr:last-child]:border-0', this.class())
  );
}

/**
 * Table Footer Directive
 * Applies footer styles to tfoot element
 */
@Directive({
  selector: 'tfoot[appTableFooter]',
  host: {
    '[attr.data-slot]': '"table-footer"',
    '[class]': 'computedClass()',
  },
})
export class TableFooterDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', this.class())
  );
}

/**
 * Table Row Directive
 * Applies row styles to tr element
 */
@Directive({
  selector: 'tr[appTableRow]',
  host: {
    '[attr.data-slot]': '"table-row"',
    '[class]': 'computedClass()',
  },
})
export class TableRowDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
      this.class()
    )
  );
}

/**
 * Table Head Directive
 * Applies header cell styles to th element
 */
@Directive({
  selector: 'th[appTableHead]',
  host: {
    '[attr.data-slot]': '"table-head"',
    '[class]': 'computedClass()',
  },
})
export class TableHeadDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0',
      this.class()
    )
  );
}

/**
 * Table Cell Directive
 * Applies cell styles to td element
 */
@Directive({
  selector: 'td[appTableCell]',
  host: {
    '[attr.data-slot]': '"table-cell"',
    '[class]': 'computedClass()',
  },
})
export class TableCellDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0', this.class())
  );
}

/**
 * Table Caption Directive
 * Applies caption styles to caption element
 */
@Directive({
  selector: 'caption[appTableCaption]',
  host: {
    '[attr.data-slot]': '"table-caption"',
    '[class]': 'computedClass()',
  },
})
export class TableCaptionDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground mt-4 text-xs', this.class())
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
