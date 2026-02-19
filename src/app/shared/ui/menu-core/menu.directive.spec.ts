import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ArgusxMenuDirective } from './menu.directive';
import { ArgusxMenuContentDirective } from './menu-content.directive';
import { ArgusxMenuItemDirective } from './menu-item.directive';

@Component({
  standalone: true,
  imports: [ArgusxMenuDirective, ArgusxMenuContentDirective, ArgusxMenuItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      id="menu-trigger"
      argusxMenu
      [argusxMenuTriggerFor]="menuTpl">
      Open
    </button>

    <ng-template #menuTpl>
      <div argusxMenuContent>
        <button argusxMenuItem>First Item</button>
      </div>
    </ng-template>
  `,
})
class MenuDirectiveHostComponent {
  @ViewChild(ArgusxMenuDirective, { static: true })
  menuDirective!: ArgusxMenuDirective;
}

describe('ArgusxMenuDirective', () => {
  let fixture: ComponentFixture<MenuDirectiveHostComponent>;
  let host: MenuDirectiveHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDirectiveHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuDirectiveHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    (host.menuDirective as any).initializeHoverBehavior();
  });

  it('opens on hover and closes after hover delay when leaving trigger', () => {
    vi.useFakeTimers();

    const cdkTrigger = (host.menuDirective as any).cdkTrigger;
    const openSpy = vi.spyOn(cdkTrigger, 'open').mockImplementation(() => {});
    const closeSpy = vi.spyOn(cdkTrigger, 'close').mockImplementation(() => {});

    const trigger = fixture.debugElement.query(By.css('#menu-trigger')).nativeElement as HTMLElement;
    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(openSpy).toHaveBeenCalledTimes(1);

    const leaveEvent = new MouseEvent('mouseleave', { bubbles: true });
    Object.defineProperty(leaveEvent, 'relatedTarget', { value: null });
    trigger.dispatchEvent(leaveEvent);

    vi.advanceTimersByTime(100);
    expect(closeSpy).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('does not open on hover when disabled', () => {
    const cdkTrigger = (host.menuDirective as any).cdkTrigger;
    const openSpy = vi.spyOn(cdkTrigger, 'open').mockImplementation(() => {});
    Object.defineProperty(host.menuDirective, 'disabled', {
      value: () => true,
      configurable: true,
    });

    const trigger = fixture.debugElement.query(By.css('#menu-trigger')).nativeElement as HTMLElement;
    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    expect(openSpy).not.toHaveBeenCalled();
  });
});
