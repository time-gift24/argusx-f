import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableDirectives } from '@app/shared/ui/table';

@Component({
  selector: 'app-table-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableDirectives],
  template: `
    <div class="mx-auto max-w-4xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Table</h1>
      <p class="mb-8 text-muted-foreground">
        Structured display for tabular data with semantic table primitives.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Recent Invoices</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <div appTableContainer class="rounded-md border">
            <table appTable>
              <caption appTableCaption>A list of your recent invoices.</caption>
              <thead appTableHeader>
                <tr appTableRow>
                  <th appTableHead>Invoice</th>
                  <th appTableHead>Status</th>
                  <th appTableHead>Method</th>
                  <th appTableHead class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody appTableBody>
                @for (invoice of invoices; track invoice.id) {
                  <tr appTableRow>
                    <td appTableCell class="font-medium">{{ invoice.id }}</td>
                    <td appTableCell>
                      <span class="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        [class.bg-emerald-100]="invoice.status === 'Paid'"
                        [class.text-emerald-700]="invoice.status === 'Paid'"
                        [class.bg-amber-100]="invoice.status === 'Pending'"
                        [class.text-amber-700]="invoice.status === 'Pending'"
                        [class.bg-rose-100]="invoice.status === 'Failed'"
                        [class.text-rose-700]="invoice.status === 'Failed'"
                      >
                        {{ invoice.status }}
                      </span>
                    </td>
                    <td appTableCell>{{ invoice.method }}</td>
                    <td appTableCell class="text-right">{{ invoice.amount }}</td>
                  </tr>
                }
              </tbody>
              <tfoot appTableFooter>
                <tr appTableRow>
                  <td appTableCell colspan="3">Total</td>
                  <td appTableCell class="text-right">$2,845.00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class TablePreviewComponent {
  readonly invoices = [
    { id: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
    { id: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
    { id: 'INV003', status: 'Paid', method: 'Bank Transfer', amount: '$350.00' },
    { id: 'INV004', status: 'Failed', method: 'Credit Card', amount: '$450.00' },
    { id: 'INV005', status: 'Paid', method: 'ACH', amount: '$550.00' },
    { id: 'INV006', status: 'Pending', method: 'Credit Card', amount: '$1,095.00' },
  ] as const;
}
