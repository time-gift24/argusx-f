import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ArgusxContextMenuDirective } from './context-menu.directive';

@Component({
  standalone: true,
  imports: [ArgusxContextMenuDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      id="context-target"
      argusxContextMenu
      [argusxContextMenuTriggerFor]="menuTpl">
      Right click target
    </div>

    <ng-template #menuTpl>
      <div role="menu">Item</div>
    </ng-template>
  `,
})
class ContextMenuDirectiveHostComponent {
  @ViewChild(ArgusxContextMenuDirective, { static: true })
  directive!: ArgusxContextMenuDirective;
}

describe('ArgusxContextMenuDirective', () => {
  let fixture: ComponentFixture<ContextMenuDirectiveHostComponent>;
  let host: ContextMenuDirectiveHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextMenuDirectiveHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContextMenuDirectiveHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('opens context menu on ContextMenu key press', () => {
    const cdkTrigger = (host.directive as any).cdkTrigger;
    const openSpy = vi.spyOn(cdkTrigger, 'open').mockImplementation(() => {});

    const target = fixture.debugElement.query(By.css('#context-target')).nativeElement as HTMLElement;
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      top: 20,
      width: 40,
      height: 20,
      right: 50,
      bottom: 40,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    } as DOMRect);

    target.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ContextMenu', bubbles: true })
    );

    expect(openSpy).toHaveBeenCalledWith({ x: 30, y: 30 });
  });

  it('opens context menu on Shift+F10', () => {
    const cdkTrigger = (host.directive as any).cdkTrigger;
    const openSpy = vi.spyOn(cdkTrigger, 'open').mockImplementation(() => {});

    const target = fixture.debugElement.query(By.css('#context-target')).nativeElement as HTMLElement;
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 50,
      width: 60,
      height: 20,
      right: 160,
      bottom: 70,
      x: 100,
      y: 50,
      toJSON: () => ({}),
    } as DOMRect);

    target.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'F10',
        shiftKey: true,
        bubbles: true,
      })
    );

    expect(openSpy).toHaveBeenCalledWith({ x: 130, y: 60 });
  });
});
