export function runAfterRender(callback: () => void): void {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => callback());
    return;
  }

  setTimeout(() => callback(), 0);
}

export function getMenuFocusableItems(container: HTMLElement | null | undefined): HTMLElement[] {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]'
    )
  ).filter((item) => item.tabIndex >= 0);
}

export function focusMenuItemByIndex(
  items: HTMLElement[],
  index: number
): void {
  if (!items.length) {
    return;
  }

  const target =
    index < 0 ? items[items.length - 1] : items[Math.min(index, items.length - 1)];
  target?.focus();
}

export function focusAdjacentMenuItem(
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
