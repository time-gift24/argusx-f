import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import 'zone.js';
import 'zone.js/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { SwitchPreviewComponent } from './switch-preview.component';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

describe('SwitchPreviewComponent', () => {
  let fixture: ComponentFixture<SwitchPreviewComponent>;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchPreviewComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchPreviewComponent);
    fixture.detectChanges();
  });

  it('should render shadcn-aligned section headings', () => {
    const headings = Array.from(fixture.nativeElement.querySelectorAll('h2')).map((heading) =>
      heading.textContent?.trim()
    );

    expect(headings).toEqual(['Basic', 'With Description', 'Disabled', 'Sizes']);
  });

  it('should render shadcn-aligned copy', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.textContent).toContain('Airplane Mode');
    expect(host.textContent).toContain('Share across devices');
    expect(host.textContent).toContain('Disabled (Unchecked)');
    expect(host.textContent).toContain('Disabled (Checked)');
  });
});
