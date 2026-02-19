import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  InputGroupAddonComponent,
  InputGroupButtonComponent,
  InputGroupComponent,
  InputGroupInputComponent,
  InputGroupTextareaComponent,
  InputGroupTextComponent,
} from './index';

describe('InputGroupComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('keeps radix-mira baseline root classes and data attributes', () => {
    const group: HTMLElement = fixture.nativeElement.querySelector('[data-testid="group-baseline"] > div');

    expect(group.getAttribute('data-slot')).toBe('input-group');
    expect(group.getAttribute('role')).toBe('group');
    expect(group.className).toContain('bg-input/20');
    expect(group.className).toContain('h-7');
  });

  it('forwards id to native input/textarea for field label compatibility', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="input-wrapper"] input');
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector(
      '[data-testid="textarea-wrapper"] textarea'
    );

    expect(input.id).toBe('username-input');
    expect(textarea.id).toBe('notes-textarea');
  });

  it('keeps inline-start as default addon align for input groups', () => {
    const group: HTMLElement = fixture.nativeElement.querySelector('[data-testid="group-baseline"] > div');
    const firstAddon: HTMLElement | null = group.querySelector('argusx-input-group-addon');

    expect(firstAddon?.getAttribute('data-align')).toBe('inline-start');
  });

  it('defaults addon align to block-start/block-end for textarea groups', () => {
    const group: HTMLElement = fixture.nativeElement.querySelector('[data-testid="group-textarea"] > div');
    const addons = Array.from(group.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement && node.tagName === 'ARGUSX-INPUT-GROUP-ADDON'
    );

    expect(addons).toHaveLength(2);
    expect(addons[0]?.getAttribute('data-align')).toBe('block-start');
    expect(addons[1]?.getAttribute('data-align')).toBe('block-end');
  });

  it('keeps textarea host full-width to avoid centered block content', () => {
    const textareaHost: HTMLElement = fixture.nativeElement.querySelector('[data-testid="textarea-wrapper"]');

    expect(textareaHost.className).toContain('w-full');
  });
});

@Component({
  standalone: true,
  imports: [
    InputGroupComponent,
    InputGroupAddonComponent,
    InputGroupButtonComponent,
    InputGroupTextComponent,
    InputGroupInputComponent,
    InputGroupTextareaComponent,
  ],
  template: `
    <argusx-input-group data-testid="group-baseline">
      <argusx-input-group-addon>
        <argusx-input-group-text>https://</argusx-input-group-text>
      </argusx-input-group-addon>
      <argusx-input-group-input data-testid="input-wrapper" id="username-input" />
      <argusx-input-group-addon align="inline-end">
        <button argusxInputGroupButton data-testid="button-baseline">Go</button>
      </argusx-input-group-addon>
    </argusx-input-group>

    <argusx-input-group class="mt-3" data-testid="group-textarea">
      <argusx-input-group-addon>
        <argusx-input-group-text>Notes</argusx-input-group-text>
      </argusx-input-group-addon>
      <argusx-input-group-textarea data-testid="textarea-wrapper" id="notes-textarea" />
      <argusx-input-group-addon>
        <argusx-input-group-text>Line 1, Col 1</argusx-input-group-text>
      </argusx-input-group-addon>
    </argusx-input-group>
  `,
})
class TestHostComponent {}
