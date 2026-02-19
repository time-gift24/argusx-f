import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  ArgusxDropdownMenuCheckboxItemComponent,
  ArgusxDropdownMenuComponent,
  ArgusxDropdownMenuComponents,
  ArgusxDropdownMenuRadioItemComponent,
} from './dropdown-menu.component';

function waitForRender() {
  return new Promise((resolve) => setTimeout(resolve, 20));
}

@Component({
  standalone: true,
  imports: [...ArgusxDropdownMenuComponents],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <argusx-dropdown-menu>
      <button type="button" id="trigger" argusxDropdownMenuTrigger>Open</button>
      <argusx-dropdown-menu-content>
        <argusx-dropdown-menu-checkbox-item>
          Bookmarked
        </argusx-dropdown-menu-checkbox-item>
        <argusx-dropdown-menu-radio-group>
          <argusx-dropdown-menu-radio-item value="compact">
            Compact
          </argusx-dropdown-menu-radio-item>
          <argusx-dropdown-menu-radio-item value="comfortable">
            Comfortable
          </argusx-dropdown-menu-radio-item>
        </argusx-dropdown-menu-radio-group>
        <argusx-dropdown-menu-item>Profile</argusx-dropdown-menu-item>
      </argusx-dropdown-menu-content>
    </argusx-dropdown-menu>
  `,
})
class DropdownHostComponent {
  @ViewChild(ArgusxDropdownMenuComponent, { static: true })
  menu!: ArgusxDropdownMenuComponent;
}

describe('ArgusxDropdownMenuComponent', () => {
  let fixture: ComponentFixture<DropdownHostComponent>;
  let host: DropdownHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders root slot marker', () => {
    const root = fixture.debugElement.query(By.css('argusx-dropdown-menu'));
    expect(root.attributes['data-slot']).toBe('dropdown-menu');
  });

  it('opens when ArrowDown is pressed on trigger', () => {
    const trigger = fixture.debugElement.query(By.css('[argusxDropdownMenuTrigger]'));
    trigger.triggerEventHandler(
      'keydown',
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    fixture.detectChanges();

    expect(host.menu.open()).toBe(true);
  });

  it('closes on Escape from menu content', async () => {
    host.menu.open.set(true);
    fixture.detectChanges();

    (host.menu as any).onContentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    fixture.detectChanges();
    await waitForRender();

    expect(host.menu.open()).toBe(false);
  });

  it('keeps menu open when checkbox item is toggled', () => {
    host.menu.open.set(true);
    fixture.detectChanges();

    const checkboxItem = fixture.debugElement.query(
      By.directive(ArgusxDropdownMenuCheckboxItemComponent)
    )?.componentInstance as ArgusxDropdownMenuCheckboxItemComponent | undefined;
    checkboxItem?.onClick();
    fixture.detectChanges();

    expect(host.menu.open()).toBe(true);
  });

  it('closes menu on radio selection', () => {
    host.menu.open.set(true);
    fixture.detectChanges();

    const radioItems = fixture.debugElement
      .queryAll(By.directive(ArgusxDropdownMenuRadioItemComponent))
      .map((de) => de.componentInstance as ArgusxDropdownMenuRadioItemComponent);
    radioItems[1]?.onClick();
    fixture.detectChanges();

    expect(host.menu.open()).toBe(false);
  });
});
