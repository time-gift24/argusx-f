import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { CdkMenu } from '@angular/cdk/menu';

import { ArgusxMenuItemDirective } from './menu-item.directive';

@Component({
  standalone: true,
  imports: [CdkMenu, ArgusxMenuItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div cdkMenu>
      <button id="enabled-item" argusxMenuItem>Enabled</button>
      <button id="disabled-item" argusxMenuItem argusxDisabled>Disabled</button>
    </div>
  `,
})
class MenuItemHostComponent {}

function createMousePointerMoveEvent(): Event {
  const event = new Event('pointermove', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'pointerType', { value: 'mouse' });
  return event;
}

describe('ArgusxMenuItemDirective', () => {
  let fixture: ComponentFixture<MenuItemHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuItemHostComponent);
    fixture.detectChanges();
  });

  it('focuses enabled menu item on pointermove', () => {
    const enabled = fixture.debugElement.query(By.css('#enabled-item')).nativeElement as HTMLElement;

    enabled.dispatchEvent(createMousePointerMoveEvent());

    expect(document.activeElement).toBe(enabled);
  });

  it('does not focus disabled menu item on pointermove', () => {
    const disabledDirective = fixture.debugElement
      .query(By.css('#disabled-item'))
      .injector.get(ArgusxMenuItemDirective);
    const enabled = fixture.debugElement.query(By.css('#enabled-item')).nativeElement as HTMLElement;
    Object.defineProperty(disabledDirective, 'disabled', {
      value: () => true,
      configurable: true,
    });

    enabled.focus();
    disabledDirective.onPointerMove(createMousePointerMoveEvent() as PointerEvent);

    expect(document.activeElement).toBe(enabled);
  });

  it('prevents click interaction for disabled menu item', () => {
    const disabledDirective = fixture.debugElement
      .query(By.css('#disabled-item'))
      .injector.get(ArgusxMenuItemDirective);
    Object.defineProperty(disabledDirective, 'disabledState', {
      value: () => true,
      configurable: true,
    });

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    disabledDirective.onClick(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
  });
});
