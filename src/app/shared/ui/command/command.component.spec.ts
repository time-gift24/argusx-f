import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  ArgusxCommandComponent,
  ArgusxCommandEmptyComponent,
  ArgusxCommandDialogComponent,
  ArgusxCommandGroupComponent,
  ArgusxCommandInputComponent,
  ArgusxCommandItemComponent,
  ArgusxCommandListComponent,
} from './command.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArgusxCommandComponent,
    ArgusxCommandInputComponent,
    ArgusxCommandListComponent,
    ArgusxCommandEmptyComponent,
    ArgusxCommandGroupComponent,
    ArgusxCommandItemComponent,
  ],
  template: `
    <argusx-command class="test-command">
      <argusx-command-input placeholder="Search commands..." />
      <argusx-command-list>
        <argusx-command-empty>No results found.</argusx-command-empty>

        <argusx-command-group heading="Primary">
          <argusx-command-item value="alpha" (select)="onSelect($event)">
            Alpha
          </argusx-command-item>
          <argusx-command-item value="beta" (select)="onSelect($event)">
            Beta
          </argusx-command-item>
        </argusx-command-group>

        <argusx-command-group heading="Secondary">
          <argusx-command-item value="gamma" (select)="onSelect($event)">
            Gamma
          </argusx-command-item>
        </argusx-command-group>
      </argusx-command-list>
    </argusx-command>
  `,
})
class CommandHostComponent {
  readonly selectedValues: string[] = [];

  onSelect(value: string): void {
    this.selectedValues.push(value);
  }
}

describe('ArgusxCommandComponent', () => {
  let fixture: ComponentFixture<ArgusxCommandComponent<string>>;
  let component: ArgusxCommandComponent<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgusxCommandComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgusxCommandComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders plain default contract on host attributes', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('data-slot')).toBe('command');
    expect(host.getAttribute('data-variant')).toBe('plain');
  });

  it('tracks visible item registry state and auto highlights', () => {
    const hiddenId = component.registerItem({
      value: () => 'hidden',
      label: () => 'hidden',
      keywords: () => [],
      disabled: () => false,
      isVisible: () => false,
      element: () => null,
      emitSelect: () => undefined,
    });

    expect(component.hasVisibleItems()).toBe(false);
    expect(component.highlightedValue()).toBeUndefined();

    const visibleId = component.registerItem({
      value: () => 'calendar',
      label: () => 'calendar',
      keywords: () => [],
      disabled: () => false,
      isVisible: () => true,
      element: () => null,
      emitSelect: () => undefined,
    });
    fixture.detectChanges();

    expect(component.hasVisibleItems()).toBe(true);
    expect(component.highlightedValue()).toBe('calendar');

    component.unregisterItem(visibleId);
    fixture.detectChanges();
    expect(component.hasVisibleItems()).toBe(false);
    expect(component.highlightedValue()).toBeUndefined();

    component.unregisterItem(hiddenId);
  });

  it('moves highlighted item and selects highlighted callback', () => {
    const selected: string[] = [];

    component.registerItem({
      value: () => 'calendar',
      label: () => 'calendar',
      keywords: () => [],
      disabled: () => false,
      isVisible: () => true,
      element: () => null,
      emitSelect: () => selected.push('calendar'),
    });

    component.registerItem({
      value: () => 'billing',
      label: () => 'billing',
      keywords: () => [],
      disabled: () => false,
      isVisible: () => true,
      element: () => null,
      emitSelect: () => selected.push('billing'),
    });
    fixture.detectChanges();

    component.moveHighlighted(1);
    expect(component.highlightedValue()).toBe('billing');

    component.moveHighlighted(1);
    expect(component.highlightedValue()).toBe('calendar');

    component.selectHighlighted();
    expect(selected).toEqual(['calendar']);
  });

  it('skips disabled items during highlight navigation and selection', () => {
    const selected: string[] = [];

    component.registerItem({
      value: () => 'disabled',
      label: () => 'disabled',
      keywords: () => [],
      disabled: () => true,
      isVisible: () => true,
      element: () => null,
      emitSelect: () => selected.push('disabled'),
    });

    component.registerItem({
      value: () => 'enabled',
      label: () => 'enabled',
      keywords: () => [],
      disabled: () => false,
      isVisible: () => true,
      element: () => null,
      emitSelect: () => selected.push('enabled'),
    });
    fixture.detectChanges();

    expect(component.highlightedValue()).toBe('enabled');

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    (component as { onKeydown: (event: KeyboardEvent) => void }).onKeydown(event);

    expect(selected).toEqual(['enabled']);
  });

  it('clears search on escape key press when search has value', () => {
    component.value.set('calendar');

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    (component as { onKeydown: (event: KeyboardEvent) => void }).onKeydown(event);

    expect(component.value()).toBe('');
  });

  it('handles home/end boundaries through keyboard handler', () => {
    component.registerItem({
      value: () => 'alpha',
      label: () => 'alpha',
      keywords: () => [],
      disabled: () => false,
      isVisible: () => true,
      element: () => null,
      emitSelect: () => undefined,
    });
    component.registerItem({
      value: () => 'beta',
      label: () => 'beta',
      keywords: () => [],
      disabled: () => false,
      isVisible: () => true,
      element: () => null,
      emitSelect: () => undefined,
    });
    component.registerItem({
      value: () => 'gamma',
      label: () => 'gamma',
      keywords: () => [],
      disabled: () => false,
      isVisible: () => true,
      element: () => null,
      emitSelect: () => undefined,
    });
    fixture.detectChanges();

    const keydown = (key: string) =>
      (component as { onKeydown: (event: KeyboardEvent) => void }).onKeydown(
        new KeyboardEvent('keydown', { key })
      );

    keydown('End');
    expect(component.highlightedValue()).toBe('gamma');

    keydown('Home');
    expect(component.highlightedValue()).toBe('alpha');
  });
});

describe('ArgusxCommand integration', () => {
  let fixture: ComponentFixture<CommandHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandHostComponent);
    fixture.detectChanges();
  });

  it('updates empty/group visibility from filter results', () => {
    const root = fixture.debugElement.query(By.directive(ArgusxCommandComponent))
      .componentInstance as ArgusxCommandComponent<string>;
    const groups = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLElement>('[data-slot="command-group"]')
    );
    const empty = fixture.nativeElement.querySelector<HTMLElement>(
      '[data-slot="command-empty"]'
    );

    expect(groups[0]?.getAttribute('hidden')).toBeNull();
    expect(groups[1]?.getAttribute('hidden')).toBeNull();
    expect(empty?.getAttribute('hidden')).toBe('');

    root.value.set('gamma');
    fixture.detectChanges();

    expect(groups[0]?.getAttribute('hidden')).toBe('');
    expect(groups[1]?.getAttribute('hidden')).toBeNull();
    expect(empty?.getAttribute('hidden')).toBe('');

    root.value.set('no-match');
    fixture.detectChanges();

    expect(groups[0]?.getAttribute('hidden')).toBe('');
    expect(groups[1]?.getAttribute('hidden')).toBe('');
    expect(empty?.getAttribute('hidden')).toBeNull();
  });

  it('provides key data attributes and a11y roles', () => {
    const command = fixture.nativeElement.querySelector<HTMLElement>('[data-slot="command"]');
    const list = fixture.nativeElement.querySelector<HTMLElement>('[data-slot="command-list"]');
    const options = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLElement>('[data-slot="command-item"]')
    );

    expect(command?.getAttribute('data-variant')).toBe('plain');
    expect(list?.getAttribute('role')).toBe('listbox');
    expect(options[0]?.getAttribute('role')).toBe('option');
    expect(options[0]?.getAttribute('aria-selected')).not.toBeNull();
    expect(options[0]?.getAttribute('data-checked')).not.toBeNull();
  });
});

describe('ArgusxCommandDialogComponent', () => {
  let fixture: ComponentFixture<ArgusxCommandDialogComponent>;
  let component: ArgusxCommandDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgusxCommandDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgusxCommandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('opens and closes via model state', () => {
    expect(component.open()).toBe(false);

    component.open.set(true);
    fixture.detectChanges();
    expect(component.open()).toBe(true);

    component.open.set(false);
    fixture.detectChanges();
    expect(component.open()).toBe(false);
  });
});
