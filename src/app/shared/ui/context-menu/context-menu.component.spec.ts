import { ChangeDetectionStrategy, Component, ViewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ArgusxContextMenuComponent,
  ArgusxContextMenuComponents,
  type ArgusxContextMenuSide,
} from './context-menu.component';

@Component({
  standalone: true,
  imports: [...ArgusxContextMenuComponents],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <argusx-context-menu>
      <div argusxContextMenuTrigger id="target" tabindex="0">Right click here</div>
      <argusx-context-menu-content>
        <argusx-context-menu-item>Rename</argusx-context-menu-item>
      </argusx-context-menu-content>
    </argusx-context-menu>
  `,
})
class ContextHostComponent {
  readonly side = signal<ArgusxContextMenuSide>('left');
  readonly sideOffset = signal(12);

  @ViewChild(ArgusxContextMenuComponent, { static: true })
  menu!: ArgusxContextMenuComponent;
}

describe('ArgusxContextMenuComponent', () => {
  let fixture: ComponentFixture<ContextHostComponent>;
  let host: ContextHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContextHostComponent);
    host = fixture.componentInstance;
    vi.spyOn(host.menu as any, 'showOverlay').mockImplementation(function (this: any) {
      this.renderedSide.set(this.resolvedSide());
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    if (host?.menu?.open()) {
      host.menu.closeMenu();
      fixture.detectChanges();
    }
  });

  it('opens on contextmenu event and stores cursor coordinates', () => {
    const trigger = fixture.debugElement.query(By.css('[argusxContextMenuTrigger]'));
    trigger.triggerEventHandler(
      'contextmenu',
      new MouseEvent('contextmenu', {
        bubbles: true,
        clientX: 120,
        clientY: 80,
      })
    );
    fixture.detectChanges();

    expect(host.menu.open()).toBe(true);
    expect((host.menu as any).positionX()).toBe(120);
    expect((host.menu as any).positionY()).toBe(80);
  });

  it('opens from keyboard trigger with Shift+F10 and keeps trigger reference', () => {
    const trigger = fixture.debugElement.query(By.css('[argusxContextMenuTrigger]'));
    trigger.triggerEventHandler(
      'keydown',
      new KeyboardEvent('keydown', {
        key: 'F10',
        shiftKey: true,
        bubbles: true,
      })
    );
    fixture.detectChanges();

    expect(host.menu.open()).toBe(true);
    expect((host.menu as any).activeTriggerElement).toBe(trigger.nativeElement);
  });

  it('applies content side config from content wrapper', () => {
    host.menu.registerContentConfig({
      side: host.side(),
      sideOffset: host.sideOffset(),
    });
    host.menu.openAt(40, 40, null);
    fixture.detectChanges();

    expect((host.menu as any).renderedSide()).toBe('left');
    expect((host.menu as any).resolvedSideOffset()).toBe(12);

    host.menu.closeMenu();
    fixture.detectChanges();
    expect(host.menu.open()).toBe(false);
  });
});
