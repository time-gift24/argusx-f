import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ArgusxPopoverComponent,
  ArgusxPopoverContentComponent,
} from './popover.component';

describe('ArgusxPopoverContentComponent', () => {
  let fixture: ComponentFixture<ArgusxPopoverContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgusxPopoverContentComponent],
      providers: [
        {
          provide: ArgusxPopoverComponent,
          useValue: {
            id: 'popover-test',
            open: signal(false),
            closePopover: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgusxPopoverContentComponent);
    fixture.detectChanges();
  });

  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;

  it('does not apply default host padding', () => {
    expect(host().className).not.toContain('p-4');
  });

  it('does not expose variant attribute', () => {
    expect(host().getAttribute('data-variant')).toBeNull();
  });
});
