import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CalendarIcon,
  CalculatorIcon,
  CircleHelpIcon,
  ClipboardPasteIcon,
  CodeIcon,
  CopyIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  FolderPlusIcon,
  HomeIcon,
  ImageIcon,
  InboxIcon,
  LayoutGridIcon,
  ListIcon,
  LucideAngularModule,
  PlusIcon,
  ScissorsIcon,
  SettingsIcon,
  SmileIcon,
  TrashIcon,
  UserIcon,
  ZoomInIcon,
  ZoomOutIcon,
  BellIcon,
  type LucideIconData,
} from 'lucide-angular';

import { ArgusxButtonDirective } from '@app/shared/ui/button';
import { ArgusxCommandComponents } from '@app/shared/ui/command';

interface PreviewCommandItem {
  value: string;
  label: string;
  icon: LucideIconData;
  shortcut?: string;
  disabled?: boolean;
  keywords?: string[];
}

interface PreviewCommandGroup {
  heading: string;
  items: PreviewCommandItem[];
}

@Component({
  selector: 'app-command-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...ArgusxCommandComponents, ArgusxButtonDirective, LucideAngularModule],
  template: `
    <div class="mx-auto max-w-6xl space-y-8 p-8">
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold">Command</h1>
        <p class="text-muted-foreground text-sm">
          Full shadcn command-example parity on the ArgusX plain API, backed by menu-core primitives.
        </p>
        <p class="text-muted-foreground text-xs">
          Last selected action: <span class="text-foreground font-medium">{{ selectedAction() }}</span>
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">Inline</h2>
        <div class="rounded-lg border border-dashed border-border p-4">
          <argusx-command class="mx-auto max-w-lg rounded-lg border border-border">
            <argusx-command-input placeholder="Type a command or search..." />
            <argusx-command-list>
              <argusx-command-empty>No results found.</argusx-command-empty>

              @for (group of inlineGroups; track group.heading) {
                <argusx-command-group [heading]="group.heading">
                  @for (item of group.items; track item.value) {
                    <argusx-command-item
                      [value]="item.value"
                      [keywords]="item.keywords ?? []"
                      [disabled]="item.disabled ?? false"
                      (select)="onSelect(item.label)">
                      <lucide-icon [img]="item.icon" class="size-3.5" />
                      <span>{{ item.label }}</span>
                      @if (item.shortcut) {
                        <argusx-command-shortcut>{{ item.shortcut }}</argusx-command-shortcut>
                      }
                    </argusx-command-item>
                  }
                </argusx-command-group>

                @if (!$last) {
                  <argusx-command-separator />
                }
              }
            </argusx-command-list>
          </argusx-command>
        </div>
      </section>

      <div class="grid gap-4 lg:grid-cols-2">
        <section class="space-y-3 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">Basic</h2>
          <button argusx-button variant="outline" class="w-fit" (click)="basicOpen.set(true)">
            Open Menu
          </button>

          <argusx-command-dialog [(open)]="basicOpen">
            <argusx-command>
              <argusx-command-input placeholder="Type a command or search..." />
              <argusx-command-list>
                <argusx-command-empty>No results found.</argusx-command-empty>
                <argusx-command-group heading="Suggestions">
                  @for (item of basicItems; track item.value) {
                    <argusx-command-item [value]="item.value" (select)="onSelect(item.label)">
                      {{ item.label }}
                    </argusx-command-item>
                  }
                </argusx-command-group>
              </argusx-command-list>
            </argusx-command>
          </argusx-command-dialog>
        </section>

        <section class="space-y-3 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Shortcuts</h2>
          <button argusx-button variant="outline" class="w-fit" (click)="shortcutsOpen.set(true)">
            Open Menu
          </button>

          <argusx-command-dialog [(open)]="shortcutsOpen">
            <argusx-command>
              <argusx-command-input placeholder="Type a command or search..." />
              <argusx-command-list>
                <argusx-command-empty>No results found.</argusx-command-empty>
                <argusx-command-group heading="Settings">
                  @for (item of shortcutItems; track item.value) {
                    <argusx-command-item [value]="item.value" (select)="onSelect(item.label)">
                      <lucide-icon [img]="item.icon" class="size-3.5" />
                      <span>{{ item.label }}</span>
                      <argusx-command-shortcut>{{ item.shortcut }}</argusx-command-shortcut>
                    </argusx-command-item>
                  }
                </argusx-command-group>
              </argusx-command-list>
            </argusx-command>
          </argusx-command-dialog>
        </section>

        <section class="space-y-3 rounded-lg border border-dashed border-border p-4 lg:col-span-2">
          <h2 class="text-sm font-medium text-muted-foreground">With Groups</h2>
          <button argusx-button variant="outline" class="w-fit" (click)="groupsOpen.set(true)">
            Open Menu
          </button>

          <argusx-command-dialog [(open)]="groupsOpen">
            <argusx-command>
              <argusx-command-input placeholder="Type a command or search..." />
              <argusx-command-list>
                <argusx-command-empty>No results found.</argusx-command-empty>

                <argusx-command-group heading="Suggestions">
                  @for (item of suggestionItems; track item.value) {
                    <argusx-command-item [value]="item.value" (select)="onSelect(item.label)">
                      <lucide-icon [img]="item.icon" class="size-3.5" />
                      <span>{{ item.label }}</span>
                    </argusx-command-item>
                  }
                </argusx-command-group>

                <argusx-command-separator />

                <argusx-command-group heading="Settings">
                  @for (item of shortcutItems; track item.value) {
                    <argusx-command-item [value]="item.value" (select)="onSelect(item.label)">
                      <lucide-icon [img]="item.icon" class="size-3.5" />
                      <span>{{ item.label }}</span>
                      <argusx-command-shortcut>{{ item.shortcut }}</argusx-command-shortcut>
                    </argusx-command-item>
                  }
                </argusx-command-group>
              </argusx-command-list>
            </argusx-command>
          </argusx-command-dialog>
        </section>

        <section class="space-y-3 rounded-lg border border-dashed border-border p-4 lg:col-span-2">
          <h2 class="text-sm font-medium text-muted-foreground">Many Groups & Items</h2>
          <button argusx-button variant="outline" class="w-fit" (click)="manyOpen.set(true)">
            Open Menu
          </button>

          <argusx-command-dialog [(open)]="manyOpen" class="max-w-2xl">
            <argusx-command>
              <argusx-command-input placeholder="Type a command or search..." />
              <argusx-command-list class="max-h-96">
                <argusx-command-empty>No results found.</argusx-command-empty>

                @for (group of manyGroups; track group.heading) {
                  <argusx-command-group [heading]="group.heading">
                    @for (item of group.items; track item.value) {
                      <argusx-command-item
                        [value]="item.value"
                        [keywords]="item.keywords ?? []"
                        [disabled]="item.disabled ?? false"
                        (select)="onSelect(item.label)">
                        <lucide-icon [img]="item.icon" class="size-3.5" />
                        <span>{{ item.label }}</span>
                        @if (item.shortcut) {
                          <argusx-command-shortcut>{{ item.shortcut }}</argusx-command-shortcut>
                        }
                      </argusx-command-item>
                    }
                  </argusx-command-group>

                  @if (!$last) {
                    <argusx-command-separator />
                  }
                }
              </argusx-command-list>
            </argusx-command>
          </argusx-command-dialog>
        </section>
      </div>
    </div>
  `,
})
export class CommandPreviewComponent {
  readonly basicOpen = signal(false);
  readonly shortcutsOpen = signal(false);
  readonly groupsOpen = signal(false);
  readonly manyOpen = signal(false);

  readonly selectedAction = signal('None');

  readonly suggestionItems: PreviewCommandItem[] = [
    { value: 'calendar', label: 'Calendar', icon: CalendarIcon },
    {
      value: 'search-emoji',
      label: 'Search Emoji',
      icon: SmileIcon,
      keywords: ['emoji', 'smile'],
    },
    { value: 'calculator', label: 'Calculator', icon: CalculatorIcon, disabled: true },
  ];

  readonly shortcutItems: PreviewCommandItem[] = [
    { value: 'profile', label: 'Profile', icon: UserIcon, shortcut: '⌘P' },
    { value: 'billing', label: 'Billing', icon: CreditCardIcon, shortcut: '⌘B' },
    { value: 'settings', label: 'Settings', icon: SettingsIcon, shortcut: '⌘S' },
  ];

  readonly inlineGroups: PreviewCommandGroup[] = [
    {
      heading: 'Suggestions',
      items: [
        { value: 'calendar', label: 'Calendar', icon: CalendarIcon },
        { value: 'search-emoji', label: 'Search Emoji', icon: SmileIcon, shortcut: '⌘E' },
        { value: 'calculator', label: 'Calculator', icon: CalculatorIcon, shortcut: '⌘C' },
      ],
    },
    {
      heading: 'Settings',
      items: [
        { value: 'profile', label: 'Profile', icon: UserIcon, shortcut: '⌘P' },
        { value: 'billing', label: 'Billing', icon: CreditCardIcon, shortcut: '⌘B' },
        { value: 'settings', label: 'Settings', icon: SettingsIcon, shortcut: '⌘S' },
      ],
    },
  ];

  readonly basicItems: PreviewCommandItem[] = [
    { value: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { value: 'search-emoji', label: 'Search Emoji', icon: SmileIcon },
    { value: 'calculator', label: 'Calculator', icon: CalculatorIcon },
  ];

  readonly manyGroups: PreviewCommandGroup[] = [
    {
      heading: 'Navigation',
      items: [
        { value: 'home', label: 'Home', icon: HomeIcon, shortcut: '⌘H' },
        { value: 'inbox', label: 'Inbox', icon: InboxIcon, shortcut: '⌘I' },
        { value: 'documents', label: 'Documents', icon: FileTextIcon, shortcut: '⌘D' },
        { value: 'folders', label: 'Folders', icon: FolderIcon, shortcut: '⌘F' },
      ],
    },
    {
      heading: 'Actions',
      items: [
        { value: 'new-file', label: 'New File', icon: PlusIcon, shortcut: '⌘N' },
        {
          value: 'new-folder',
          label: 'New Folder',
          icon: FolderPlusIcon,
          shortcut: '⇧⌘N',
        },
        { value: 'copy', label: 'Copy', icon: CopyIcon, shortcut: '⌘C' },
        { value: 'cut', label: 'Cut', icon: ScissorsIcon, shortcut: '⌘X' },
        {
          value: 'paste',
          label: 'Paste',
          icon: ClipboardPasteIcon,
          shortcut: '⌘V',
          disabled: true,
        },
        { value: 'delete', label: 'Delete', icon: TrashIcon, shortcut: '⌫' },
      ],
    },
    {
      heading: 'View',
      items: [
        { value: 'grid-view', label: 'Grid View', icon: LayoutGridIcon },
        { value: 'list-view', label: 'List View', icon: ListIcon },
        { value: 'zoom-in', label: 'Zoom In', icon: ZoomInIcon, shortcut: '⌘+' },
        { value: 'zoom-out', label: 'Zoom Out', icon: ZoomOutIcon, shortcut: '⌘-' },
      ],
    },
    {
      heading: 'Account',
      items: [
        { value: 'account-profile', label: 'Profile', icon: UserIcon, shortcut: '⌘P' },
        { value: 'account-billing', label: 'Billing', icon: CreditCardIcon, shortcut: '⌘B' },
        { value: 'account-settings', label: 'Settings', icon: SettingsIcon, shortcut: '⌘S' },
        { value: 'notifications', label: 'Notifications', icon: BellIcon },
        { value: 'help', label: 'Help & Support', icon: CircleHelpIcon },
      ],
    },
    {
      heading: 'Tools',
      items: [
        { value: 'tool-calendar', label: 'Calendar', icon: CalendarIcon },
        { value: 'tool-calculator', label: 'Calculator', icon: CalculatorIcon },
        { value: 'tool-image', label: 'Image Editor', icon: ImageIcon },
        { value: 'tool-code', label: 'Code Editor', icon: CodeIcon },
      ],
    },
  ];

  onSelect(label: string): void {
    this.selectedAction.set(label);
    this.basicOpen.set(false);
    this.shortcutsOpen.set(false);
    this.groupsOpen.set(false);
    this.manyOpen.set(false);
  }
}
