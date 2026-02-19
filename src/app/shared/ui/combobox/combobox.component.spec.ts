import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ArgusxComboboxComponent } from './combobox.component';

describe('ArgusxComboboxComponent', () => {
  let fixture: ComponentFixture<ArgusxComboboxComponent<string>>;
  let component: ArgusxComboboxComponent<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgusxComboboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgusxComboboxComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders plain default contract on host attributes', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('data-slot')).toBe('combobox');
    expect(host.getAttribute('data-variant')).toBe('plain');
    expect(host.getAttribute('data-size')).toBe('default');
  });

  it('opens and closes when enabled', () => {
    expect(component.open()).toBe(false);

    component.openCombobox();
    expect(component.open()).toBe(true);

    component.closeCombobox();
    expect(component.open()).toBe(false);
  });

  it('does not open when disabled', () => {
    (component as { disabled: () => boolean }).disabled = () => true;

    component.openCombobox();

    expect(component.open()).toBe(false);
  });

  it('selects value and closes popup in single mode', () => {
    component.open.set(true);
    component.selectValue('next.js');

    expect(component.value()).toBe('next.js');
    expect(component.open()).toBe(false);
  });

  it('supports multiple-select append and dedupe semantics', () => {
    (component as { multiple: () => boolean }).multiple = () => true;
    component.open.set(true);

    component.selectValue('next.js');
    component.selectValue('next.js');
    component.selectValue('sveltekit');

    expect(component.value()).toEqual(['next.js', 'sveltekit']);
    expect(component.open()).toBe(true);
  });

  it('supports deselect and clear in multiple mode', () => {
    (component as { multiple: () => boolean }).multiple = () => true;
    component.value.set(['next.js', 'sveltekit']);

    component.deselectValue('next.js');
    expect(component.value()).toEqual(['sveltekit']);

    component.clearValue();
    expect(component.value()).toEqual([]);
  });

  it('supports deselect and clear in single mode', () => {
    component.value.set('next.js');

    component.deselectValue('next.js');
    expect(component.value()).toBeUndefined();

    component.value.set('sveltekit');
    component.clearValue();
    expect(component.value()).toBeUndefined();
  });

  it('returns display label for single mode and count summary for multiple mode', () => {
    component.registerItemLabel('next.js', 'Next.js');
    component.value.set('next.js');
    expect(component.getDisplayValue()).toBe('Next.js');

    (component as { multiple: () => boolean }).multiple = () => true;
    component.value.set(['a', 'b']);
    expect(component.getDisplayValue()).toBe('2 selected');
  });

  it('tracks visible item registry state for empty rendering logic', () => {
    expect(component.hasVisibleItems()).toBe(false);

    const first = component.registerItem({
      value: () => 'first',
      isVisible: () => false,
      disabled: () => false,
    });
    const second = component.registerItem({
      value: () => 'second',
      isVisible: () => true,
      disabled: () => false,
    });
    expect(component.hasVisibleItems()).toBe(true);

    component.unregisterItem(second);
    expect(component.hasVisibleItems()).toBe(false);

    component.unregisterItem(first);
    expect(component.hasVisibleItems()).toBe(false);
  });

  it('auto highlights the first visible enabled item when opened', () => {
    (component as { autoHighlight: () => boolean }).autoHighlight = () => true;

    component.registerItem({
      value: () => 'disabled',
      isVisible: () => true,
      disabled: () => true,
    });
    component.registerItem({
      value: () => 'next.js',
      isVisible: () => true,
      disabled: () => false,
    });

    component.openCombobox();

    expect(component.highlightedValue()).toBe('next.js');
  });

  it('moves highlighted item with wrap-around navigation', () => {
    component.registerItem({
      value: () => 'next.js',
      isVisible: () => true,
      disabled: () => false,
    });
    component.registerItem({
      value: () => 'sveltekit',
      isVisible: () => true,
      disabled: () => false,
    });

    component.moveHighlighted(1);
    expect(component.highlightedValue()).toBe('next.js');

    component.moveHighlighted(1);
    expect(component.highlightedValue()).toBe('sveltekit');

    component.moveHighlighted(1);
    expect(component.highlightedValue()).toBe('next.js');

    component.moveHighlighted(-1);
    expect(component.highlightedValue()).toBe('sveltekit');
  });

  it('selects highlighted value when available', () => {
    component.open.set(true);
    component.setHighlightedValue('remix');

    component.selectHighlighted();

    expect(component.value()).toBe('remix');
    expect(component.open()).toBe(false);
  });
});
