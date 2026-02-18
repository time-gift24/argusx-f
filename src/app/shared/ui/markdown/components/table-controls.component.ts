import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'sd-table-controls',
  standalone: true,
  template: `
    <div class="mb-2 flex items-center justify-end gap-2">
      <button type="button" (click)="copy()">Copy</button>
      <button type="button" (click)="download()">Download</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableControlsComponent {
  readonly tableMarkdown = input.required<string>();

  async copy(): Promise<void> {
    await navigator.clipboard?.writeText?.(this.tableMarkdown());
  }

  download(): void {
    const blob = new Blob([this.tableMarkdown()], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'table.md';
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
