# sheet - zardui sources

## Directory
- demo (dir)
- doc (dir)
- index.ts (file)
- sheet-ref.ts (file)
- sheet.component.spec.ts (file)
- sheet.component.ts (file)
- sheet.imports.ts (file)
- sheet.service.ts (file)
- sheet.variants.ts (file)

## index.ts
```typescript
export { type OnClickCallback as SheetOnClickCallback } from '@/shared/components/sheet/sheet.component';
export { ZardSheetComponent, ZardSheetOptions } from '@/shared/components/sheet/sheet.component';
export * from '@/shared/components/sheet/sheet.service';
export * from '@/shared/components/sheet/sheet-ref';
export * from '@/shared/components/sheet/sheet.imports';
export * from '@/shared/components/sheet/sheet.variants';
```

## sheet-ref.ts
```typescript
import type { OverlayRef } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import { EventEmitter, Inject, PLATFORM_ID } from '@angular/core';

import { filter, fromEvent, Subject, takeUntil } from 'rxjs';

import type { ZardSheetComponent, ZardSheetOptions } from './sheet.component';

const enum eTriggerAction {
  CANCEL = 'cancel',
  OK = 'ok',
}

export class ZardSheetRef<T = any, R = any, U = any> {
  private destroy$ = new Subject<void>();
  private isClosing = false;
  protected result?: R;
  componentInstance: T | null = null;

  constructor(
    private overlayRef: OverlayRef,
    private config: ZardSheetOptions<T, U>,
    private containerInstance: ZardSheetComponent<T, U>,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.containerInstance.cancelTriggered.subscribe(() => this.trigger(eTriggerAction.CANCEL));
    this.containerInstance.okTriggered.subscribe(() => this.trigger(eTriggerAction.OK));

    if ((this.config.zMaskClosable ?? true) && isPlatformBrowser(this.platformId)) {
      this.overlayRef
        .outsidePointerEvents()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.close());
    }

    if (isPlatformBrowser(this.platformId)) {
      fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(
          filter(event => event.key === 'Escape'),
          takeUntil(this.destroy$),
        )
        .subscribe(() => this.close());
    }
  }

  close(result?: R) {
    if (this.isClosing) {
      return;
    }

    this.isClosing = true;
    this.result = result;
    this.containerInstance.state.set('closed');

    if (isPlatformBrowser(this.platformId)) {
      const element = this.containerInstance.getNativeElement();
      let cleanupCalled = false;

      const onAnimationEnd = () => {
        if (cleanupCalled) {
          return;
        }

        cleanupCalled = true;
        element.removeEventListener('animationend', onAnimationEnd);
        this.closeCleanup();
      };

      element.addEventListener('animationend', onAnimationEnd);
      setTimeout(onAnimationEnd, 300); // Fallback after expected animation duration
    } else {
      this.closeCleanup();
    }
  }

  private trigger(action: eTriggerAction) {
    const trigger = { ok: this.config.zOnOk, cancel: this.config.zOnCancel }[action];

    if (trigger instanceof EventEmitter) {
      trigger.emit(this.getContentComponent());
    } else if (typeof trigger === 'function') {
      const result = trigger(this.getContentComponent()) as R;
      this.closeWithResult(result);
    } else {
      this.close();
    }
  }

  private getContentComponent(): T {
    return this.componentInstance as T;
  }

  private closeWithResult(result: R): void {
    if (result !== false) {
      this.close(result);
    }
  }

  private closeCleanup(): void {
    if (this.overlayRef) {
      if (this.overlayRef.hasAttached()) {
        this.overlayRef.detachBackdrop();
      }
      this.overlayRef.dispose();
    }

    if (!this.destroy$.closed) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }
}
```

## sheet.component.spec.ts
```typescript
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardSheetRef } from './sheet-ref';
import { ZardSheetService } from './sheet.service';
import { ZardButtonComponent } from '../button/button.component';

@Component({
  imports: [ZardButtonComponent],
  standalone: true,
  template: `
    <button type="button" z-button zType="outline" (click)="openSheet()">Open basic sheet</button>
    <button type="button" z-button zType="outline" (click)="openSheetWithTemplate()">Open sheet with template</button>
    <button type="button" z-button zType="outline" (click)="openSheetRightSide()">Open right side sheet</button>
    <button type="button" z-button zType="outline" (click)="openSheetWithoutFooter()">Open sheet without footer</button>

    <ng-template #testTemplate let-sheetRef="sheetRef">
      <div data-testid="template-content">
        <p>Template content</p>
        <button type="button" (click)="sheetRef.close()">Close from template</button>
      </div>
    </ng-template>
  `,
})
class SheetTestHostComponent {
  private sheetService = inject(ZardSheetService);

  @ViewChild('testTemplate', { static: true }) testTemplate!: TemplateRef<void>;
  lastSheetRef?: ZardSheetRef<void>;

  openSheet() {
    this.lastSheetRef = this.sheetService.create({
      zTitle: 'Test Sheet',
      zDescription: 'This is a test sheet.',
      zContent: 'Test content',
    });
  }

  openSheetWithTemplate() {
    this.lastSheetRef = this.sheetService.create({
      zTitle: 'Template Sheet',
      zContent: this.testTemplate,
    });
  }

  openSheetRightSide() {
    this.lastSheetRef = this.sheetService.create({
      zTitle: 'Right Side Sheet',
      zContent: 'Right side content',
      zSide: 'right',
    });
  }

  openSheetWithoutFooter() {
    this.lastSheetRef = this.sheetService.create({
      zTitle: 'No Footer Sheet',
      zContent: 'No footer content',
      zHideFooter: true,
    });
  }
}

describe('ZardSheetComponent', () => {
  let component: SheetTestHostComponent;
  let fixture: ComponentFixture<SheetTestHostComponent>;
  let platformId: object;
  let sheetService: ZardSheetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetTestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SheetTestHostComponent);
    component = fixture.componentInstance;
    platformId = TestBed.inject(PLATFORM_ID);
    sheetService = TestBed.inject(ZardSheetService);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up any open sheets
    const sheetElements = document.querySelectorAll('z-sheet');
    sheetElements.forEach(sheet => sheet.remove());
  });

  function openSheet() {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
  }

  function openSheetByIndex(index: number) {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[index].click();
    fixture.detectChanges();
  }

  describe('Basic functionality', () => {
    it('should create a sheet when the button is clicked', () => {
      openSheet();

      const sheetElement = document.querySelector('z-sheet');
      if (isPlatformBrowser(platformId)) {
        expect(sheetElement).toBeTruthy();
        expect(sheetElement?.getAttribute('data-state')).toBe('open');
      } else {
        expect(sheetElement).toBeNull();
      }
    });

    it('should display the sheet title, description and content', () => {
      openSheet();

      const sheetElement = document.querySelector('z-sheet');

      if (isPlatformBrowser(platformId)) {
        expect(sheetElement).toBeTruthy();

        const titleElement = sheetElement?.querySelector('[data-testid="z-title"]');
        expect(titleElement).toBeTruthy();
        expect(titleElement?.textContent).toContain('Test Sheet');

        const descriptionElement = sheetElement?.querySelector('[data-testid="z-description"]');
        expect(descriptionElement).toBeTruthy();
        expect(descriptionElement?.textContent).toContain('This is a test sheet.');

        const contentElement = sheetElement?.querySelector('[data-testid="z-content"]');
        expect(contentElement).toBeTruthy();
        expect(contentElement?.textContent).toContain('Test content');
      } else {
        expect(sheetElement).toBeNull();
      }
    });
  });

  describe('Sheet interactions', () => {
    it('should close the sheet when the cancel button is clicked', async () => {
      openSheet();

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const cancelButton = sheetElement?.querySelector<HTMLButtonElement>('[data-testid="z-cancel-button"]');
        expect(cancelButton).toBeTruthy();
        cancelButton?.click();
        fixture.detectChanges();

        await new Promise(resolve => setTimeout(resolve, 350));
        expect(document.querySelector('z-sheet')).toBeNull();
      }
    });

    it('should close the sheet when the ok button is clicked', async () => {
      openSheet();

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const okButton = sheetElement?.querySelector<HTMLButtonElement>('[data-testid="z-ok-button"]');
        expect(okButton).toBeTruthy();
        okButton?.click();
        fixture.detectChanges();

        await new Promise(resolve => setTimeout(resolve, 350));
        expect(document.querySelector('z-sheet')).toBeNull();
      }
    });

    it('should close the sheet when the x button is clicked', async () => {
      openSheet();

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const closeButton = sheetElement?.querySelector<HTMLButtonElement>('[data-testid="z-close-header-button"]');
        expect(closeButton).toBeTruthy();
        closeButton?.click();
        fixture.detectChanges();

        await new Promise(resolve => setTimeout(resolve, 350));
        expect(document.querySelector('z-sheet')).toBeNull();
      }
    });
  });

  describe('Sheet variants', () => {
    it('should create a sheet with right side variant', () => {
      openSheetByIndex(2); // Right side sheet button

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();
        expect(sheetElement?.classList.contains('right-0')).toBeTruthy();
        expect(sheetElement?.classList.contains('border-l')).toBeTruthy();
      }
    });

    it('should create a sheet without footer when hideFooter is true', () => {
      openSheetByIndex(3); // No footer sheet button

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const footerElement = sheetElement?.querySelector('[data-slot="sheet-footer"]');
        expect(footerElement).toBeNull();

        const okButton = sheetElement?.querySelector('[data-testid="z-ok-button"]');
        const cancelButton = sheetElement?.querySelector('[data-testid="z-cancel-button"]');
        expect(okButton).toBeNull();
        expect(cancelButton).toBeNull();
      }
    });
  });

  describe('Template content', () => {
    it('should render template content correctly', () => {
      openSheetByIndex(1); // Template sheet button

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const templateContent = sheetElement?.querySelector('[data-testid="template-content"]');
        expect(templateContent).toBeTruthy();
        expect(templateContent?.textContent).toContain('Template content');
      }
    });
  });

  describe('SSR compatibility', () => {
    it('should handle SSR environment gracefully', () => {
      openSheet();

      if (!isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeNull();
        expect(component.lastSheetRef).toBeTruthy();
      }
    });
  });

  describe('Sheet service', () => {
    it('should create sheet with custom configuration', () => {
      const sheetRef = sheetService.create({
        zTitle: 'Custom Sheet',
        zContent: 'Custom content',
        zOkText: 'Save',
        zCancelText: 'Discard',
        zSide: 'top',
      });

      expect(sheetRef).toBeTruthy();

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet') as HTMLElement;
        expect(sheetElement).toBeTruthy();
      }
    });

    it('should apply custom width and height', async () => {
      sheetService.create({
        zTitle: 'Custom Dimensions Sheet',
        zContent: 'Custom content',
        zSide: 'right',
        zWidth: '500px',
        zHeight: '80vh',
      });

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet') as HTMLElement;
        expect(sheetElement).toBeTruthy();

        // Wait for change detection
        fixture.detectChanges();
        await fixture.whenStable();

        // Check that custom dimensions are applied via CSS variables
        expect(sheetElement.style.width).toBe('500px');
        expect(sheetElement.style.height).toBe('80vh');
      }
    });

    it('should apply default dimensions based on side', async () => {
      sheetService.create({
        zTitle: 'Default Dimensions Sheet',
        zContent: 'Default content',
        zSide: 'left',
      });

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet') as HTMLElement;
        expect(sheetElement).toBeTruthy();

        // Wait for change detection
        fixture.detectChanges();
        await fixture.whenStable();

        // Check that default dimensions use Tailwind classes (no inline styles)
        expect(sheetElement.style.width).toBe('');
        expect(sheetElement.style.height).toBe('');
        expect(sheetElement?.classList.contains('w-3/4')).toBeTruthy();
        expect(sheetElement?.classList.contains('h-full')).toBeTruthy();
      }
    });

    it('should handle sheet callbacks', () => {
      let okClicked = false;
      let cancelClicked = false;

      sheetService.create({
        zTitle: 'Callback Sheet',
        zContent: 'Callback content',
        zOnOk: () => {
          okClicked = true;
          return false;
        }, // return false to prevent closing
        zOnCancel: () => {
          cancelClicked = true;
          return false;
        }, // return false to prevent closing
      });

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const okButton = sheetElement?.querySelector<HTMLButtonElement>('[data-testid="z-ok-button"]');
        const cancelButton = sheetElement?.querySelector<HTMLButtonElement>('[data-testid="z-cancel-button"]');

        if (okButton && cancelButton) {
          okButton.click();
          fixture.detectChanges();
          expect(okClicked).toBeTruthy();

          cancelButton.click();
          fixture.detectChanges();
          expect(cancelClicked).toBeTruthy();
        }
      }
    });
  });
});
```

## sheet.component.ts
```typescript
import { OverlayModule } from '@angular/cdk/overlay';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  type ComponentPortal,
  PortalModule,
  type TemplatePortal,
} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  ElementRef,
  type EmbeddedViewRef,
  type EventEmitter,
  inject,
  output,
  signal,
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
} from '@angular/core';

import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import type { ZardSheetRef } from './sheet-ref';
import { sheetVariants, type ZardSheetVariants } from './sheet.variants';
import { ZardButtonComponent } from '../button/button.component';
import { ZardIconComponent } from '../icon/icon.component';
import type { ZardIcon } from '../icon/icons';

export type OnClickCallback<T> = (instance: T) => false | void | object;
export class ZardSheetOptions<T, U> {
  zCancelIcon?: ZardIcon;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: string;
  zData?: U;
  zDescription?: string;
  zHeight?: string;
  zHideFooter?: boolean;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkIcon?: ZardIcon;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zSide?: ZardSheetVariants['zSide'] = 'left';
  zSize?: ZardSheetVariants['zSize'] = 'default';
  zTitle?: string | TemplateRef<T>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

@Component({
  selector: 'z-sheet',
  imports: [OverlayModule, PortalModule, ZardButtonComponent, ZardIconComponent],
  template: `
    @if (config.zClosable || config.zClosable === undefined) {
      <button
        type="button"
        data-testid="z-close-header-button"
        z-button
        zType="ghost"
        zSize="sm"
        class="absolute top-1 right-1 cursor-pointer"
        (click)="onCloseClick()"
      >
        <z-icon zType="x" />
      </button>
    }

    @if (config.zTitle || config.zDescription) {
      <header data-slot="sheet-header" class="flex flex-col gap-1.5 p-4">
        @if (config.zTitle) {
          <h4 data-testid="z-title" data-slot="sheet-title" class="text-lg leading-none font-semibold tracking-tight">
            {{ config.zTitle }}
          </h4>

          @if (config.zDescription) {
            <p data-testid="z-description" data-slot="sheet-description" class="text-muted-foreground text-sm">
              {{ config.zDescription }}
            </p>
          }
        }
      </header>
    }

    <main class="flex w-full flex-col space-y-4">
      <ng-template cdkPortalOutlet />

      @if (isStringContent) {
        <div data-testid="z-content" data-slot="sheet-content" [innerHTML]="config.zContent"></div>
      }
    </main>

    @if (!config.zHideFooter) {
      <footer data-slot="sheet-footer" class="mt-auto flex flex-col gap-2 p-4">
        @if (config.zOkText !== null) {
          <button
            type="button"
            data-testid="z-ok-button"
            class="cursor-pointer"
            z-button
            [zType]="config.zOkDestructive ? 'destructive' : 'default'"
            [disabled]="config.zOkDisabled"
            (click)="onOkClick()"
          >
            @if (config.zOkIcon) {
              <z-icon [zType]="config.zOkIcon" />
            }

            {{ config.zOkText ?? 'OK' }}
          </button>
        }

        @if (config.zCancelText !== null) {
          <button
            type="button"
            data-testid="z-cancel-button"
            class="cursor-pointer"
            z-button
            zType="outline"
            (click)="onCloseClick()"
          >
            @if (config.zCancelIcon) {
              <z-icon [zType]="config.zCancelIcon" />
            }

            {{ config.zCancelText ?? 'Cancel' }}
          </button>
        }
      </footer>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sheet',
    '[class]': 'classes()',
    '[attr.data-state]': 'state()',
    '[style.width]': 'config.zWidth ? config.zWidth + " !important" : null',
    '[style.height]': 'config.zHeight ? config.zHeight + " !important" : null',
  },
  exportAs: 'zSheet',
})
export class ZardSheetComponent<T, U> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly config = inject(ZardSheetOptions<T, U>);

  protected readonly classes = computed(() => {
    const zSize = this.config.zWidth || this.config.zHeight ? 'custom' : this.config.zSize;

    return mergeClasses(
      sheetVariants({
        zSide: this.config.zSide,
        zSize,
      }),
      this.config.zCustomClasses,
    );
  });

  sheetRef?: ZardSheetRef<T>;

  protected readonly isStringContent = typeof this.config.zContent === 'string';

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();
  readonly state = signal<'closed' | 'open'>('closed');

  constructor() {
    super();
  }

  getNativeElement(): HTMLElement {
    return this.host.nativeElement;
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this.portalOutlet()?.hasAttached()) {
      throw new Error('Attempting to attach modal content after content is already attached');
    }
    return this.portalOutlet()?.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet()?.hasAttached()) {
      throw new Error('Attempting to attach modal content after content is already attached');
    }

    return this.portalOutlet()?.attachTemplatePortal(portal);
  }

  onOkClick() {
    this.okTriggered.emit();
  }

  onCloseClick() {
    this.cancelTriggered.emit();
  }
}
```

## sheet.imports.ts
```typescript
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { ZardSheetComponent } from '@/shared/components/sheet/sheet.component';

export const ZardSheetImports = [ZardSheetComponent, OverlayModule, PortalModule] as const;
```

## sheet.service.ts
```typescript
import { type ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, InjectionToken, Injector, PLATFORM_ID, TemplateRef } from '@angular/core';

import { ZardSheetRef } from './sheet-ref';
import { ZardSheetComponent, ZardSheetOptions } from './sheet.component';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;
export const Z_SHEET_DATA = new InjectionToken<any>('Z_SHEET_DATA');

@Injectable({
  providedIn: 'root',
})
export class ZardSheetService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);

  create<T, U>(config: ZardSheetOptions<T, U>): ZardSheetRef<T> {
    return this.open<T, U>(config.zContent as ComponentType<T>, config);
  }

  private open<T, U>(componentOrTemplateRef: ContentType<T>, config: ZardSheetOptions<T, U>) {
    const overlayRef = this.createOverlay();

    if (!overlayRef) {
      // Return a mock sheet ref for SSR environments
      return new ZardSheetRef(undefined as any, config, undefined as any, this.platformId);
    }

    const sheetContainer = this.attachSheetContainer<T, U>(overlayRef, config);

    const sheetRef = this.attachSheetContent<T, U>(componentOrTemplateRef, sheetContainer, overlayRef, config);
    sheetContainer.sheetRef = sheetRef;

    return sheetRef;
  }

  private createOverlay(): OverlayRef | undefined {
    if (isPlatformBrowser(this.platformId)) {
      const overlayConfig = new OverlayConfig({
        hasBackdrop: true,
        positionStrategy: this.overlay.position().global(),
      });

      return this.overlay.create(overlayConfig);
    }
    return undefined;
  }

  private attachSheetContainer<T, U>(overlayRef: OverlayRef, config: ZardSheetOptions<T, U>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardSheetOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardSheetComponent<T, U>>(
      ZardSheetComponent,
      config.zViewContainerRef,
      injector,
    );
    const containerRef = overlayRef.attach<ZardSheetComponent<T, U>>(containerPortal);
    containerRef.instance.state.set('open');

    return containerRef.instance;
  }

  private attachSheetContent<T, U>(
    componentOrTemplateRef: ContentType<T>,
    sheetContainer: ZardSheetComponent<T, U>,
    overlayRef: OverlayRef,
    config: ZardSheetOptions<T, U>,
  ) {
    const sheetRef = new ZardSheetRef<T>(overlayRef, config, sheetContainer, this.platformId);

    if (componentOrTemplateRef instanceof TemplateRef) {
      sheetContainer.attachTemplatePortal(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          sheetRef: sheetRef,
        } as any),
      );
    } else if (typeof componentOrTemplateRef !== 'string') {
      const injector = this.createInjector<T, U>(sheetRef, config);
      const contentRef = sheetContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector),
      );
      sheetRef.componentInstance = contentRef.instance;
    }

    return sheetRef;
  }

  private createInjector<T, U>(sheetRef: ZardSheetRef<T>, config: ZardSheetOptions<T, U>) {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ZardSheetRef, useValue: sheetRef },
        { provide: Z_SHEET_DATA, useValue: config.zData },
      ],
    });
  }
}
```

## sheet.variants.ts
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const sheetVariants = cva(
  'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      zSide: {
        right:
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 border-l',
        left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 border-r',
        top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
        bottom:
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
      },
      zSize: {
        default: '',
        sm: '',
        lg: '',
        custom: '',
      },
    },
    compoundVariants: [
      {
        zSide: ['left', 'right'],
        zSize: 'default',
        class: 'w-3/4 sm:max-w-sm h-full',
      },
      {
        zSide: ['left', 'right'],
        zSize: 'sm',
        class: 'w-1/2 sm:max-w-xs h-full',
      },
      {
        zSide: ['left', 'right'],
        zSize: 'lg',
        class: 'w-full sm:max-w-lg h-full',
      },
      {
        zSide: ['top', 'bottom'],
        zSize: 'default',
        class: 'h-auto',
      },
      {
        zSide: ['top', 'bottom'],
        zSize: 'sm',
        class: 'h-1/3',
      },
      {
        zSide: ['top', 'bottom'],
        zSize: 'lg',
        class: 'h-3/4',
      },
    ],
    defaultVariants: {
      zSide: 'right',
      zSize: 'default',
    },
  },
);
export type ZardSheetVariants = VariantProps<typeof sheetVariants>;
```

