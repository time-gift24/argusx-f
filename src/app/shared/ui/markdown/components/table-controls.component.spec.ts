import '@angular/compiler';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TableControlsComponent } from './table-controls.component';

@Component({
  standalone: true,
  imports: [TableControlsComponent],
  template: `
    <div class="sd-table-wrapper">
      <sd-table-controls></sd-table-controls>
      <table>
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
class HostComponent {}

describe('TableControlsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: TableControlsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    component = fixture.debugElement.query(
      By.directive(TableControlsComponent)
    ).componentInstance as TableControlsComponent;
  });

  it('should be defined', () => {
    expect(TableControlsComponent).toBeTruthy();
  });

  it('falls back to execCommand copy when clipboard write is denied', async () => {
    const writeText = vi
      .fn<[string], Promise<void>>()
      .mockRejectedValue(
        new DOMException('Write permission denied.', 'NotAllowedError')
      );
    const clipboardBackup = (navigator as any).clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    const execCommandSpy = vi.fn<[string], boolean>().mockReturnValue(true);
    const execCommandBackup = (document as any).execCommand;
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommandSpy,
    });

    try {
      await expect(component.copy('csv')).resolves.toBeUndefined();
      expect(writeText).toHaveBeenCalledWith('Header 1,Header 2\nCell 1,Cell 2');
      expect(execCommandSpy).toHaveBeenCalledWith('copy');
    } finally {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: clipboardBackup,
      });
      Object.defineProperty(document, 'execCommand', {
        configurable: true,
        value: execCommandBackup,
      });
    }
  });
});
