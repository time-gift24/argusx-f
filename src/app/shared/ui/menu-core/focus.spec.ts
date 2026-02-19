import { describe, expect, it } from 'vitest';

import {
  focusAdjacentMenuItem,
  focusMenuItemByIndex,
  getMenuFocusableItems,
} from './focus';

describe('menu-core focus utilities', () => {
  it('collects only focusable menu roles', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button role="menuitem" tabindex="0">A</button>
      <button role="menuitemcheckbox" tabindex="0">B</button>
      <button role="menuitemradio" tabindex="-1">C</button>
      <button role="button" tabindex="0">D</button>
    `;

    const items = getMenuFocusableItems(container);
    expect(items.length).toBe(2);
    expect(items[0]?.textContent).toContain('A');
    expect(items[1]?.textContent).toContain('B');
  });

  it('focuses first and last items by index semantics', () => {
    const first = document.createElement('button');
    first.role = 'menuitem';
    first.tabIndex = 0;

    const second = document.createElement('button');
    second.role = 'menuitem';
    second.tabIndex = 0;

    document.body.append(first, second);

    focusMenuItemByIndex([first, second], 0);
    expect(document.activeElement).toBe(first);

    focusMenuItemByIndex([first, second], -1);
    expect(document.activeElement).toBe(second);

    first.remove();
    second.remove();
  });

  it('moves focus to adjacent item with wrap-around', () => {
    const first = document.createElement('button');
    first.role = 'menuitem';
    first.tabIndex = 0;

    const second = document.createElement('button');
    second.role = 'menuitem';
    second.tabIndex = 0;

    document.body.append(first, second);
    first.focus();

    focusAdjacentMenuItem([first, second], 1, document.activeElement);
    expect(document.activeElement).toBe(second);

    focusAdjacentMenuItem([first, second], 1, document.activeElement);
    expect(document.activeElement).toBe(first);

    first.remove();
    second.remove();
  });
});
