import {
  ChangeDetectionStrategy,
  Component,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  ArgusxMenubarCheckboxItemComponent,
  ArgusxMenubarComponent,
  ArgusxMenubarComponents,
  ArgusxMenubarMenuComponent,
  ArgusxMenubarRadioItemComponent,
  ArgusxMenubarSubComponent,
} from './menubar.component';

@Component({
  standalone: true,
  imports: [...ArgusxMenubarComponents],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <argusx-menubar>
      <argusx-menubar-menu value="file">
        <span argusxMenubarTrigger>File</span>
        <argusx-menubar-content
          align="end"
          [alignOffset]="2"
          [sideOffset]="10"
          class="custom-file-menu">
          <argusx-menubar-item>
            Email link
            <argusx-menubar-shortcut>⌘E</argusx-menubar-shortcut>
          </argusx-menubar-item>
          <argusx-menubar-checkbox-item>
            Show Sidebar
          </argusx-menubar-checkbox-item>
          <argusx-menubar-radio-group>
            <argusx-menubar-radio-item value="compact">Compact</argusx-menubar-radio-item>
            <argusx-menubar-radio-item value="cozy">Cozy</argusx-menubar-radio-item>
          </argusx-menubar-radio-group>
          <argusx-menubar-sub>
            <argusx-menubar-sub-trigger>Share</argusx-menubar-sub-trigger>
            <argusx-menubar-sub-content>
              <argusx-menubar-item>Copy link</argusx-menubar-item>
            </argusx-menubar-sub-content>
          </argusx-menubar-sub>
        </argusx-menubar-content>
      </argusx-menubar-menu>

      <argusx-menubar-menu value="edit">
        <span argusxMenubarTrigger>Edit</span>
        <argusx-menubar-content>
          <argusx-menubar-item>Undo</argusx-menubar-item>
        </argusx-menubar-content>
      </argusx-menubar-menu>
    </argusx-menubar>
  `,
})
class MenubarHostComponent {
  @ViewChild(ArgusxMenubarComponent, { static: true })
  menubar!: ArgusxMenubarComponent;

  @ViewChildren(ArgusxMenubarMenuComponent)
  menus!: QueryList<ArgusxMenubarMenuComponent>;

  @ViewChild(ArgusxMenubarSubComponent)
  submenu!: ArgusxMenubarSubComponent;
}

describe('ArgusxMenubarComponent', () => {
  let fixture: ComponentFixture<MenubarHostComponent>;
  let host: MenubarHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenubarHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenubarHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders with menubar data slot', () => {
    const root = fixture.debugElement.query(By.css('argusx-menubar'));
    expect(root.attributes['data-slot']).toBe('menubar');
  });

  it('opens menu with Enter key and switches top-level menu with ArrowRight', () => {
    const triggers = fixture.debugElement.queryAll(By.css('[data-slot="menubar-trigger"]'));

    triggers[0]?.triggerEventHandler(
      'keydown',
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    fixture.detectChanges();

    const [fileMenu, editMenu] = host.menus.toArray();
    expect(fileMenu?.open()).toBe(true);

    triggers[0]?.triggerEventHandler(
      'keydown',
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    fixture.detectChanges();

    expect(fileMenu?.open()).toBe(false);
    expect(editMenu?.open()).toBe(true);
  });

  it('switches top-level menu on trigger hover after opening one by click', () => {
    const triggers = fixture.debugElement.queryAll(By.css('[data-slot="menubar-trigger"]'));
    const [fileMenu, editMenu] = host.menus.toArray();

    triggers[0]?.triggerEventHandler(
      'click',
      new MouseEvent('click', { bubbles: true })
    );
    fixture.detectChanges();
    expect(fileMenu?.open()).toBe(true);
    expect(editMenu?.open()).toBe(false);

    triggers[1]?.triggerEventHandler(
      'mouseenter',
      new MouseEvent('mouseenter', { bubbles: true })
    );
    fixture.detectChanges();

    expect(fileMenu?.open()).toBe(false);
    expect(editMenu?.open()).toBe(true);
  });

  it('does not open a top-level menu on hover before any menu is open', () => {
    const triggers = fixture.debugElement.queryAll(By.css('[data-slot="menubar-trigger"]'));
    const [fileMenu, editMenu] = host.menus.toArray();

    triggers[1]?.triggerEventHandler(
      'mouseenter',
      new MouseEvent('mouseenter', { bubbles: true })
    );
    fixture.detectChanges();

    expect(fileMenu?.open()).toBe(false);
    expect(editMenu?.open()).toBe(false);
  });

  it('keeps menu open when checkbox item is clicked', () => {
    host.menus.toArray()[0]?.openMenu();
    fixture.detectChanges();

    const checkboxItem = fixture.debugElement.query(
      By.directive(ArgusxMenubarCheckboxItemComponent)
    )?.componentInstance as ArgusxMenubarCheckboxItemComponent | undefined;
    checkboxItem?.onClick();
    fixture.detectChanges();

    expect(host.menus.toArray()[0]?.open()).toBe(true);
  });

  it('closes current menu when radio item is selected', () => {
    host.menus.toArray()[0]?.openMenu();
    fixture.detectChanges();

    const radioItems = fixture.debugElement
      .queryAll(By.directive(ArgusxMenubarRadioItemComponent))
      .map((de) => de.componentInstance as ArgusxMenubarRadioItemComponent);
    radioItems[1]?.onClick();
    fixture.detectChanges();

    expect(host.menus.toArray()[0]?.open()).toBe(false);
  });

  it('opens submenu with ArrowRight on sub trigger', () => {
    const [fileMenu, editMenu] = host.menus.toArray();
    fileMenu?.openMenu();
    fixture.detectChanges();

    const subTrigger = document.querySelector(
      '[data-slot="menubar-sub-trigger"]'
    ) as HTMLElement | null;
    subTrigger?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    fixture.detectChanges();

    expect(host.submenu.open()).toBe(true);
    expect(fileMenu?.open()).toBe(true);
    expect(editMenu?.open()).toBe(false);
  });

  it('uses content wrapper alignment and offset config', () => {
    const fileMenu = host.menus.toArray()[0] as any;
    const positions = fileMenu.positions();

    expect(fileMenu.resolvedAlign()).toBe('end');
    expect(fileMenu.resolvedAlignOffset()).toBe(2);
    expect(fileMenu.resolvedSideOffset()).toBe(10);
    expect(positions[0]?.offsetX).toBe(2);
    expect(positions[0]?.offsetY).toBe(10);
    expect(fileMenu.contentClass()).toContain('custom-file-menu');
  });

  it('applies hover highlight tokens across interactive menubar rows', () => {
    host.menus.toArray()[0]?.openMenu();
    fixture.detectChanges();

    const item = document.querySelector('[data-slot="menubar-item"]') as HTMLElement | null;
    const checkbox = document.querySelector(
      '[data-slot="menubar-checkbox-item"]'
    ) as HTMLElement | null;
    const radio = document.querySelector('[data-slot="menubar-radio-item"]') as HTMLElement | null;
    const subTrigger = document.querySelector(
      '[data-slot="menubar-sub-trigger"]'
    ) as HTMLElement | null;

    expect(item?.className).toContain('hover:bg-accent');
    expect(item?.className).toContain('hover:text-accent-foreground');
    expect(checkbox?.className).toContain('hover:bg-accent');
    expect(radio?.className).toContain('hover:bg-accent');
    expect(subTrigger?.className).toContain('hover:bg-accent');
  });

  it('uses dropdown-aligned inset tokens for menubar interactive rows', () => {
    host.menus.toArray()[0]?.openMenu();
    fixture.detectChanges();

    const item = document.querySelector('[data-slot="menubar-item"]') as HTMLElement | null;
    const checkbox = document.querySelector(
      '[data-slot="menubar-checkbox-item"]'
    ) as HTMLElement | null;
    const radio = document.querySelector('[data-slot="menubar-radio-item"]') as HTMLElement | null;
    const subTrigger = document.querySelector(
      '[data-slot="menubar-sub-trigger"]'
    ) as HTMLElement | null;

    expect(item?.className).toContain('data-[inset]:pl-8');
    expect(item?.className).toContain('w-full');
    expect(item?.className).toContain('text-left');
    expect(checkbox?.className).toContain('pl-8');
    expect(checkbox?.className).toContain('data-[inset]:pl-8');
    expect(radio?.className).toContain('pl-8');
    expect(radio?.className).toContain('data-[inset]:pl-8');
    expect(subTrigger?.className).toContain('data-[inset]:pl-8');
  });

  it('keeps menubar shortcut color in sync on hover and focus', () => {
    host.menus.toArray()[0]?.openMenu();
    fixture.detectChanges();

    const shortcut = document.querySelector(
      '[data-slot="menubar-shortcut"]'
    ) as HTMLElement | null;

    expect(shortcut?.className).toContain(
      'group-focus/argusx-menu-item:text-accent-foreground'
    );
    expect(shortcut?.className).toContain(
      'group-hover/argusx-menu-item:text-accent-foreground'
    );
  });
});
