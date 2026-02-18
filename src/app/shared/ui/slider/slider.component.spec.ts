import 'zone.js';
import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { SliderComponent } from './slider.component';

const createRect = (left: number, top: number, width: number, height: number): DOMRect =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect;

describe('SliderComponent', () => {
  let fixture: ComponentFixture<SliderComponent>;
  let component: SliderComponent;
  let sliderHost: HTMLElement;

  beforeAll(() => {
    getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
      teardown: { destroyAfterEach: true },
    });
  });

  afterAll(() => {
    getTestBed().resetTestEnvironment();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SliderComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    sliderHost = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    component?.ngOnDestroy();
    TestBed.resetTestingModule();
  });

  const setInput = (key: 'min' | 'max' | 'step' | 'orientation' | 'disabled', value: unknown): void => {
    Object.defineProperty(component, key, {
      configurable: true,
      value: () => value,
    });
  };

  it('renders shadcn slot structure and geometry classes', () => {
    const track = sliderHost.querySelector('[data-slot="slider-track"]') as HTMLElement | null;
    const range = sliderHost.querySelector('[data-slot="slider-range"]') as HTMLElement | null;
    const thumb = sliderHost.querySelector('[data-slot="slider-thumb"]') as HTMLElement | null;

    expect(track).toBeTruthy();
    expect(range).toBeTruthy();
    expect(thumb).toBeTruthy();
    expect(track?.className).toContain('data-[orientation=horizontal]:h-1.5');
    expect(track?.className).toContain('data-[orientation=vertical]:w-1.5');
    expect(thumb?.className).toContain('size-4');
    expect(thumb?.className).toContain('absolute');
  });

  it('uses data-disabled styles on host class for true disabled behavior', () => {
    const classes = component.computedClass();

    expect(classes).toContain('data-[disabled]:pointer-events-none');
    expect(classes).toContain('data-[disabled]:opacity-50');
  });

  it('snaps values by step relative to min instead of absolute zero', () => {
    setInput('min', 10);
    setInput('max', 20);
    setInput('step', 3);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    vi.spyOn(sliderHost, 'getBoundingClientRect').mockReturnValue(createRect(0, 0, 100, 20));

    component.onPointerDown({
      currentTarget: sliderHost,
      clientX: 50,
      clientY: 10,
      preventDefault: vi.fn(),
    } as unknown as PointerEvent);

    expect(emitSpy).toHaveBeenLastCalledWith(16);
  });

  it('uses slider host bounds during pointer move while dragging', () => {
    setInput('min', 0);
    setInput('max', 100);
    setInput('step', 1);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    vi.spyOn(sliderHost, 'getBoundingClientRect').mockReturnValue(createRect(0, 0, 200, 20));

    component.onPointerDown({
      currentTarget: sliderHost,
      clientX: 40,
      clientY: 10,
      preventDefault: vi.fn(),
    } as unknown as PointerEvent);

    expect(() =>
      (component as unknown as { onPointerMove: (event: PointerEvent) => void }).onPointerMove({
        currentTarget: document,
        clientX: 150,
        clientY: 10,
      } as PointerEvent)
    ).not.toThrow();
    expect(emitSpy).toHaveBeenLastCalledWith(75);
  });
});
