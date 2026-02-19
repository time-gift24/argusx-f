import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { ButtonDirective } from '../../button/button.directive';
import {
  extractTableDataFromElement,
  tableDataToCSV,
  tableDataToMarkdown,
  tableDataToTSV,
} from '../utils/table-data.utils';

@Component({
  selector: 'sd-table-controls',
  standalone: true,
  imports: [ButtonDirective],
  template: `
    <div class="mb-2 flex items-center justify-end gap-2">
      <button type="button" argusButton variant="outline" size="sm" (click)="copy('csv')">
        Copy CSV
      </button>
      <button type="button" argusButton variant="outline" size="sm" (click)="copy('tsv')">
        Copy TSV
      </button>
      <button type="button" argusButton variant="outline" size="sm" (click)="download('csv')">
        Download CSV
      </button>
      <button
        type="button"
        argusButton
        variant="outline"
        size="sm"
        (click)="download('markdown')">
        Download MD
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableControlsComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  async copy(format: 'csv' | 'tsv'): Promise<void> {
    const tableData = this.resolveTableData();
    if (!tableData) {
      return;
    }

    const content =
      format === 'csv' ? tableDataToCSV(tableData) : tableDataToTSV(tableData);

    const copiedViaClipboard = await this.tryClipboardCopy(content);
    if (copiedViaClipboard) {
      return;
    }

    this.tryLegacyCopy(content);
  }

  download(format: 'csv' | 'markdown'): void {
    const tableData = this.resolveTableData();
    if (!tableData) {
      return;
    }

    const content =
      format === 'csv'
        ? tableDataToCSV(tableData)
        : tableDataToMarkdown(tableData);
    const extension = format === 'csv' ? 'csv' : 'md';
    const mimeType = format === 'csv' ? 'text/csv;charset=utf-8' : 'text/markdown;charset=utf-8';
    const blob = new Blob([content], {
      type: mimeType,
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `table.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private resolveTableData() {
    if (typeof document === 'undefined') {
      return null;
    }

    const wrapper = this.host.nativeElement.closest('.sd-table-wrapper');
    const table = wrapper?.querySelector('table');
    if (!(table instanceof HTMLElement)) {
      return null;
    }

    return extractTableDataFromElement(table);
  }

  private async tryClipboardCopy(content: string): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch {
      return false;
    }
  }

  private tryLegacyCopy(content: string): boolean {
    if (typeof document === 'undefined' || typeof document.execCommand !== 'function') {
      return false;
    }

    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    textarea.style.left = '-9999px';
    document.body.append(textarea);

    textarea.focus();
    textarea.select();

    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  }
}
