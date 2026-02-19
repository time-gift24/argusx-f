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
        <argusx-dropdown-menu-label inset>My Account</argusx-dropdown-menu-label>
        <argusx-dropdown-menu-separator />
        <argusx-dropdown-menu-checkbox-item inset>
          Bookmarked
        </argusx-dropdown-menu-checkbox-item>
        <argusx-dropdown-menu-radio-group>
          <argusx-dropdown-menu-radio-item inset value="compact">
            Compact
          </argusx-dropdown-menu-radio-item>
          <argusx-dropdown-menu-radio-item value="comfortable">
            Comfortable
          </argusx-dropdown-menu-radio-item>
        </argusx-dropdown-menu-radio-group>
        <argusx-dropdown-menu-item inset>Profile</argusx-dropdown-menu-item>
        <argusx-dropdown-menu-sub>
          <argusx-dropdown-menu-sub-trigger inset>More</argusx-dropdown-menu-sub-trigger>
          <argusx-dropdown-menu-sub-content>
            <argusx-dropdown-menu-item>Nested</argusx-dropdown-menu-item>
          </argusx-dropdown-menu-sub-content>
        </argusx-dropdown-menu-sub>
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

  it('uses block layout classes for labels and separators', async () => {
    host.menu.open.set(true);
    fixture.detectChanges();
    await waitForRender();

    const label = document.querySelector('[data-slot="dropdown-menu-label"]') as HTMLElement | null;
    const separator = document.querySelector(
      '[data-slot="dropdown-menu-separator"]'
    ) as HTMLElement | null;

    expect(label).toBeTruthy();
    expect(separator).toBeTruthy();

    expect(label?.classList.contains('flex')).toBe(true);
    expect(label?.classList.contains('w-full')).toBe(true);

    expect(separator?.classList.contains('block')).toBe(true);
    expect(separator?.classList.contains('w-full')).toBe(true);
    expect(separator?.classList.contains('h-px')).toBe(true);
    expect(separator?.classList.contains('my-1')).toBe(true);
  });

  it('uses shared inset and left-alignment classes across menu rows', async () => {
    host.menu.open.set(true);
    fixture.detectChanges();
    await waitForRender();

    const label = document.querySelector('[data-slot="dropdown-menu-label"]') as HTMLElement | null;
    const item = document.querySelector('[data-slot="dropdown-menu-item"]') as HTMLElement | null;
    const checkbox = document.querySelector(
      '[data-slot="dropdown-menu-checkbox-item"]'
    ) as HTMLElement | null;
    const radio = document.querySelector('[data-slot="dropdown-menu-radio-item"]') as HTMLElement | null;
    const subTrigger = document.querySelector(
      '[data-slot="dropdown-menu-sub-trigger"]'
    ) as HTMLElement | null;

    expect(label?.className).toContain('data-[inset]:pl-8');
    expect(item?.className).toContain('data-[inset]:pl-8');
    expect(item?.className).toContain('w-full');
    expect(item?.className).toContain('text-left');
    expect(item?.className).toContain('justify-start');
    expect(checkbox?.className).toContain('data-[inset]:pl-8');
    expect(radio?.className).toContain('data-[inset]:pl-8');
    expect(subTrigger?.className).toContain('data-[inset]:pl-8');
  });
});
