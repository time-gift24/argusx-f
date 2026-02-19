import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableDirectives, type TableTypeVariants, type TableSizeVariants } from '@app/shared/ui/table';

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

      <!-- Default Table -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Recent Invoices (Default)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <div argusxTableContainer class="rounded-md border">
            <table argusxTable>
              <caption argusxTableCaption>A list of your recent invoices.</caption>
              <thead argusxTableHeader>
                <tr argusxTableRow>
                  <th argusxTableHead>Invoice</th>
                  <th argusxTableHead>Status</th>
                  <th argusxTableHead>Method</th>
                  <th argusxTableHead class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody argusxTableBody>
                @for (invoice of invoices; track invoice.id) {
                  <tr argusxTableRow>
                    <td argusxTableCell class="font-medium">{{ invoice.id }}</td>
                    <td argusxTableCell>
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
                    <td argusxTableCell>{{ invoice.method }}</td>
                    <td argusxTableCell class="text-right">{{ invoice.amount }}</td>
                  </tr>
                }
              </tbody>
              <tfoot argusxTableFooter>
                <tr argusxTableRow>
                  <td argusxTableCell colspan="3">Total</td>
                  <td argusxTableCell class="text-right">$2,845.00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      <!-- Striped Table -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Striped Variant</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <div argusxTableContainer>
            <table argusxTable [argusxType]="'striped'">
              <thead argusxTableHeader>
                <tr argusxTableRow>
                  <th argusxTableHead>ID</th>
                  <th argusxTableHead>Product</th>
                  <th argusxTableHead class="text-right">Price</th>
                </tr>
              </thead>
              <tbody argusxTableBody>
                @for (item of products; track item.id) {
                  <tr argusxTableRow>
                    <td argusxTableCell>{{ item.id }}</td>
                    <td argusxTableCell>{{ item.name }}</td>
                    <td argusxTableCell class="text-right">{{ item.price }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Bordered Table -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Bordered Variant</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <div argusxTableContainer>
            <table argusxTable [argusxType]="'bordered'">
              <thead argusxTableHeader>
                <tr argusxTableRow>
                  <th argusxTableHead>ID</th>
                  <th argusxTableHead>Category</th>
                  <th argusxTableHead class="text-right">Count</th>
                </tr>
              </thead>
              <tbody argusxTableBody>
                @for (cat of categories; track cat.id) {
                  <tr argusxTableRow>
                    <td argusxTableCell>{{ cat.id }}</td>
                    <td argusxTableCell>{{ cat.name }}</td>
                    <td argusxTableCell class="text-right">{{ cat.count }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Compact Size -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Compact Size</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <div argusxTableContainer>
            <table argusxTable [argusxSize]="'compact'">
              <thead argusxTableHeader>
                <tr argusxTableRow>
                  <th argusxTableHead>Key</th>
                  <th argusxTableHead>Value</th>
                </tr>
              </thead>
              <tbody argusxTableBody>
                @for (entry of compactData; track entry.key) {
                  <tr argusxTableRow>
                    <td argusxTableCell>{{ entry.key }}</td>
                    <td argusxTableCell>{{ entry.value }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Comfortable Size -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Comfortable Size</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <div argusxTableContainer>
            <table argusxTable [argusxSize]="'comfortable'">
              <thead argusxTableHeader>
                <tr argusxTableRow>
                  <th argusxTableHead>User</th>
                  <th argusxTableHead>Email</th>
                </tr>
              </thead>
              <tbody argusxTableBody>
                @for (user of users; track user.email) {
                  <tr argusxTableRow>
                    <td argusxTableCell>{{ user.name }}</td>
                    <td argusxTableCell>{{ user.email }}</td>
                  </tr>
                }
              </tbody>
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

  readonly products = [
    { id: 'P001', name: 'Laptop Pro', price: '$1,299.00' },
    { id: 'P002', name: 'Wireless Mouse', price: '$49.00' },
    { id: 'P003', name: 'USB-C Hub', price: '$89.00' },
  ] as const;

  readonly categories = [
    { id: 'C001', name: 'Electronics', count: 150 },
    { id: 'C002', name: 'Accessories', count: 75 },
    { id: 'C003', name: 'Software', count: 25 },
  ] as const;

  readonly compactData = [
    { key: 'version', value: '1.0.0' },
    { key: 'build', value: '2024.01.15' },
    { key: 'status', value: 'stable' },
  ] as const;

  readonly users = [
    { name: 'Alice Johnson', email: 'alice@example.com' },
    { name: 'Bob Smith', email: 'bob@example.com' },
  ] as const;
}
