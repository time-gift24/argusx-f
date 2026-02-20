const MENU_FOCUSABLE_SELECTOR = '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]';
const COMMAND_FOCUSABLE_SELECTOR = '[role="option"]';

export function runAfterRender(callback: () => void): void {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => callback());
    return;
  }

  setTimeout(() => callback(), 0);
}

function isFocusable(item: HTMLElement, minTabIndex: number): boolean {
  if (item.hasAttribute('hidden') || item.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  if (item.tabIndex < minTabIndex) {
    return false;
  }

  if (item.hasAttribute('disabled')) {
    return false;
  }

  if (
    item.getAttribute('aria-disabled') === 'true' ||
    item.getAttribute('data-disabled') === 'true'
  ) {
    return false;
  }

  return true;
}

export function getFocusableItemsBySelector(
  container: HTMLElement | null | undefined,
  selector: string,
  minTabIndex = 0
): HTMLElement[] {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter((item) =>
    isFocusable(item, minTabIndex)
  );
}

export function getMenuFocusableItems(container: HTMLElement | null | undefined): HTMLElement[] {
  return getFocusableItemsBySelector(container, MENU_FOCUSABLE_SELECTOR, 0);
}

export function getCommandFocusableItems(container: HTMLElement | null | undefined): HTMLElement[] {
  return getFocusableItemsBySelector(container, COMMAND_FOCUSABLE_SELECTOR, -1);
}

export function focusItemByIndex(items: HTMLElement[], index: number): void {
  if (!items.length) {
    return;
  }

  const target = index < 0 ? items[items.length - 1] : items[Math.min(index, items.length - 1)];
  target?.focus();
}

export function focusMenuItemByIndex(items: HTMLElement[], index: number): void {
  focusItemByIndex(items, index);
}

export function focusAdjacentItem(
  items: HTMLElement[],
  direction: 1 | -1,
  activeElement: Element | null
): void {
  if (!items.length) {
    return;
  }

  const currentIndex = activeElement ? items.indexOf(activeElement as HTMLElement) : -1;
  const nextIndex =
    currentIndex < 0
      ? direction === 1
        ? 0
        : items.length - 1
      : (currentIndex + direction + items.length) % items.length;

  items[nextIndex]?.focus();
}

export function focusAdjacentMenuItem(
  items: HTMLElement[],
  direction: 1 | -1,
  activeElement: Element | null
): void {
  focusAdjacentItem(items, direction, activeElement);
}
