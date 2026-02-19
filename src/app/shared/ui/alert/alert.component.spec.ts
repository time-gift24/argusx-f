import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ArgusxAlertActionComponent } from './alert-action.component';
import { ArgusxAlertComponent, alertVariants } from './alert.component';
import { ArgusxAlertDescriptionComponent } from './alert-description.component';
import { ArgusxAlertTitleComponent } from './alert-title.component';

describe('ArgusxAlertComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('uses plain as the default variant and keeps host accessibility attributes', () => {
    const alert = fixture.nativeElement.querySelector('[data-testid="plain"]') as HTMLElement;

    expect(alert.getAttribute('data-slot')).toBe('alert');
    expect(alert.getAttribute('data-variant')).toBe('plain');
    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.getAttribute('aria-live')).toBe('polite');
    expect(alert.className).toContain('bg-card');
  });

  it('includes destructive styling in the variant class contract', () => {
    const classes = alertVariants({ variant: 'destructive' });

    expect(classes).toContain('text-destructive');
    expect(classes).toContain('data-[slot=alert-description]');
  });

  it('keeps shadcn-aligned slot markers and typography structure', () => {
    const title = fixture.nativeElement.querySelector('[data-testid="plain-title"]') as HTMLElement;
    const description = fixture.nativeElement.querySelector('[data-testid="plain-description"]') as HTMLElement;
    const action = fixture.nativeElement.querySelector('[data-testid="plain-action"]') as HTMLElement;

    expect(title.getAttribute('data-slot')).toBe('alert-title');
    expect(title.className).toContain('line-clamp-1');

    expect(description.getAttribute('data-slot')).toBe('alert-description');
    expect(description.className).toContain('text-muted-foreground');
    expect(description.className).toContain('leading-relaxed');

    expect(action.getAttribute('data-slot')).toBe('alert-action');
    expect(action.className).toContain('col-span-2');
  });
});

@Component({
  standalone: true,
  imports: [
    ArgusxAlertComponent,
    ArgusxAlertTitleComponent,
    ArgusxAlertDescriptionComponent,
    ArgusxAlertActionComponent,
  ],
  template: `
    <argusx-alert data-testid="plain">
      <argusx-alert-title data-testid="plain-title">Alert title</argusx-alert-title>
      <argusx-alert-description data-testid="plain-description">
        Alert description
      </argusx-alert-description>
      <argusx-alert-action data-testid="plain-action">
        <button type="button">Undo</button>
      </argusx-alert-action>
    </argusx-alert>
  `,
})
class TestHostComponent {}
