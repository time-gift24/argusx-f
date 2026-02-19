import type { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import type { ConnectedPosition } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  computed,
  Directive,
  DOCUMENT,
  ElementRef,
  effect,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  PLATFORM_ID,
  type TemplateRef,
  untracked,
} from '@angular/core';

import { ArgusxMenuManagerService } from './menu-manager.service';
import {
  ARGUSX_MENU_POSITIONS_MAP,
  type ArgusxMenuPlacement,
} from './menu-positions';

export type ArgusxMenuTrigger = 'click' | 'hover';

@Directive({
  selector: '[argusxMenu], [argusx-menu]',
  host: {
    '[attr.tabindex]': "'0'",
    '[attr.role]': "'button'",
    '[attr.aria-haspopup]': "'menu'",
    '[attr.aria-expanded]': 'cdkTrigger.isOpen()',
    '[attr.data-state]': "cdkTrigger.isOpen() ? 'open' : 'closed'",
    '[attr.data-disabled]': 'disabled() ? "" : undefined',
    '[style.cursor]': "'pointer'",
    '[attr.data-slot]': '"menu-trigger"',
  },
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: ['cdkMenuTriggerFor: argusxMenuTriggerFor'],
    },
  ],
  exportAs: 'argusxMenu',
})
export class ArgusxMenuDirective implements OnInit, OnDestroy {
  private static readonly MENU_CONTENT_SELECTOR = '.cdk-overlay-pane [argusxMenuContent]';

  protected readonly cdkTrigger = inject(CdkMenuTrigger, { host: true });
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly menuManager = inject(ArgusxMenuManagerService);
  private readonly platformId = inject(PLATFORM_ID);

  private closeTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly cleanupFns: Array<() => void> = [];

  readonly argusxMenuTriggerFor = input.required<TemplateRef<void>>();
  readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
    alias: 'argusxDisabled',
  });
  readonly trigger = input<ArgusxMenuTrigger>('click', {
    alias: 'argusxTrigger',
  });
  readonly hoverDelay = input<number>(100, { alias: 'argusxHoverDelay' });
  readonly placement = input<ArgusxMenuPlacement>('bottomLeft', {
    alias: 'argusxPlacement',
  });

  private readonly menuPositions = computed(() => this.resolvePositions(this.placement()));

  constructor() {
    effect(() => {
      const positions = this.menuPositions();
      untracked(() => {
        this.cdkTrigger.menuPosition = positions;
      });
    });
  }

  ngOnInit(): void {
    const isMobile = this.detectMobileDevice();
    if (this.trigger() === 'hover' && !isMobile) {
      this.initializeHoverBehavior();
    }
  }

  ngOnDestroy(): void {
    this.cancelScheduledClose();
    this.menuManager.unregisterHoverMenu(this);
    this.cleanupFns.forEach((cleanup) => cleanup());
    this.cleanupFns.length = 0;
  }

  close(): void {
    this.cancelScheduledClose();
    this.cdkTrigger.close();
  }

  private resolvePositions(placement: ArgusxMenuPlacement): ConnectedPosition[] {
    return ARGUSX_MENU_POSITIONS_MAP[placement] ?? ARGUSX_MENU_POSITIONS_MAP['bottomLeft'];
  }

  private initializeHoverBehavior(): void {
    this.setupTriggerListeners();
    this.setupOpenCloseListeners();
  }

  private setupTriggerListeners(): void {
    const element = this.elementRef.nativeElement;

    this.addEventListenerWithCleanup(element, 'mouseenter', () => {
      if (this.disabled()) {
        return;
      }

      element.focus({ preventScroll: true });
      this.cancelScheduledClose();
      this.menuManager.registerHoverMenu(this);
      this.cdkTrigger.open();
    });

    this.addEventListenerWithCleanup(element, 'mouseleave', (event) => {
      this.scheduleCloseIfNeeded(event as MouseEvent);
    });
  }

  private setupOpenCloseListeners(): void {
    const openSub = this.cdkTrigger.opened.subscribe(() => {
      setTimeout(() => this.setupMenuContentListeners(), 0);
    });

    const closeSub = this.cdkTrigger.closed.subscribe(() => {
      this.menuManager.unregisterHoverMenu(this);
    });

    this.cleanupFns.push(() => openSub.unsubscribe(), () => closeSub.unsubscribe());
  }

  private setupMenuContentListeners(): void {
    const menuContent = this.document.querySelector(
      ArgusxMenuDirective.MENU_CONTENT_SELECTOR
    );
    if (!menuContent) {
      return;
    }

    this.addEventListenerWithCleanup(menuContent, 'mouseenter', () => {
      this.cancelScheduledClose();
    });

    this.addEventListenerWithCleanup(menuContent, 'mouseleave', (event) => {
      this.scheduleCloseIfNeeded(event as MouseEvent);
    });
  }

  private cancelScheduledClose(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  private scheduleCloseIfNeeded(event: MouseEvent): void {
    if (this.shouldKeepMenuOpen(event.relatedTarget as Element | null)) {
      return;
    }

    this.closeTimeout = setTimeout(() => {
      this.cdkTrigger.close();
      this.closeTimeout = null;
    }, this.hoverDelay());
  }

  private shouldKeepMenuOpen(relatedTarget: Element | null): boolean {
    if (!relatedTarget) {
      return false;
    }

    const movingToTrigger = this.elementRef.nativeElement.contains(relatedTarget);
    const movingToMenu = relatedTarget.closest(ArgusxMenuDirective.MENU_CONTENT_SELECTOR);
    const movingToOtherTrigger =
      relatedTarget.matches('[argusxMenu], [argusx-menu]') &&
      !this.elementRef.nativeElement.contains(relatedTarget);

    if (movingToOtherTrigger) {
      return false;
    }

    return movingToTrigger || !!movingToMenu;
  }

  private addEventListenerWithCleanup(
    element: Element,
    eventType: string,
    handler: (event: Event) => void,
    options?: AddEventListenerOptions
  ): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    element.addEventListener(eventType, handler, options);
    this.cleanupFns.push(() => element.removeEventListener(eventType, handler, options));
  }

  private detectMobileDevice(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const view = this.document.defaultView;
    if (!view) {
      return false;
    }

    const hasTouch = 'ontouchstart' in view || view.navigator.maxTouchPoints > 0;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileRegex.test(view.navigator.userAgent);
    const isSmallScreen = view.innerWidth <= 768;

    return hasTouch && (isMobileUA || isSmallScreen);
  }
}
