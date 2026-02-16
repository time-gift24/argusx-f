# zardui Avatar 源码

## 目录结构
- avatar.component.ts - 主组件
- avatar.variants.ts - 变体定义
- avatar-group.component.ts - 头像组组件

## 源码

### avatar.component.ts

```typescript
import { NgOptimizedImage } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import type { SafeUrl } from '@angular/platform-browser';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { avatarVariants, imageVariants, type ZardAvatarVariants, type ZardImageVariants } from './avatar.variants';

export type ZardAvatarStatus = 'online' | 'offline' | 'doNotDisturb' | 'away';

@Component({
  selector: 'z-avatar, [z-avatar]',
  imports: [NgOptimizedImage],
  template: `
    @if (zFallback() && (!zSrc() || !imageLoaded())) {
      <span class="absolute z-0 m-auto text-base">{{ zFallback() }}</span>
    }

    @if (zSrc() && !imageError()) {
      <img
        fill
        sizes="100%"
        [alt]="zAlt()"
        [class]="imgClasses()"
        [ngSrc]="zSrc()"
        [priority]="zPriority()"
        (error)="onImageError()"
        (load)="onImageLoad()"
      />
    }

    @if (zStatus()) {
      @switch (zStatus()) {
        @case ('online') {
          <svg>...</svg>
        }
        ...
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'containerClasses()',
    '[style.width]': 'customSize()',
    '[style.height]': 'customSize()',
    '[attr.data-slot]': '"avatar"',
    '[attr.data-status]': 'zStatus() ?? null',
  },
  exportAs: 'zAvatar',
})
export class ZardAvatarComponent {
  readonly class = input<string>('');
  readonly zAlt = input<string>('');
  readonly zFallback = input<string>('');
  readonly zPriority = input(false, { transform: booleanAttribute });
  readonly zShape = input<ZardImageVariants['zShape']>('circle');
  readonly zSize = input<ZardAvatarVariants['zSize'] | number>('default');
  readonly zSrc = input<string | SafeUrl>('');
  readonly zStatus = input<ZardAvatarStatus>();

  protected readonly imageError = signal(false);
  protected readonly imageLoaded = signal(false);

  constructor() {
    effect(() => {
      this.zSrc();
      this.imageError.set(false);
      this.imageLoaded.set(false);
    });
  }

  protected readonly containerClasses = computed(() => {
    const size = this.zSize();
    const zSize = typeof size === 'number' ? undefined : (size as ZardAvatarVariants['zSize']);
    return mergeClasses(avatarVariants({ zShape: this.zShape(), zSize }), this.class());
  });

  protected readonly customSize = computed(() => {
    const size = this.zSize();
    return typeof size === 'number' ? `${size}px` : null;
  });

  protected readonly imgClasses = computed(() => mergeClasses(imageVariants({ zShape: this.zShape() })));

  protected onImageLoad(): void {
    this.imageLoaded.set(true);
    this.imageError.set(false);
  }

  protected onImageError(): void {
    this.imageError.set(true);
    this.imageLoaded.set(false);
  }
}
```

### avatar.variants.ts

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const avatarVariants = cva(
  'relative flex flex-row items-center justify-center box-content cursor-default bg-muted',
  {
    variants: {
      zSize: {
        sm: 'size-8',
        default: 'size-10',
        md: 'size-12',
        lg: 'size-14',
        xl: 'size-16',
      },
      zShape: {
        circle: 'rounded-full',
        rounded: 'rounded-md',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      zSize: 'default',
      zShape: 'circle',
    },
  },
);

export const imageVariants = cva('relative object-cover object-center w-full h-full z-10', {
  variants: {
    zShape: {
      circle: 'rounded-full',
      rounded: 'rounded-md',
      square: 'rounded-none',
    },
  },
  defaultVariants: {
    zShape: 'circle',
  },
});

export const avatarGroupVariants = cva('flex items-center [&_img]:ring-2 [&_img]:ring-background', {
  variants: {
    zOrientation: {
      horizontal: 'flex-row -space-x-3',
      vertical: 'flex-col -space-y-3',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardAvatarVariants = VariantProps<typeof avatarVariants>;
export type ZardImageVariants = VariantProps<typeof imageVariants>;
export type ZardAvatarGroupVariants = VariantProps<typeof avatarGroupVariants>;
```

### avatar-group.component.ts

```typescript
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { avatarGroupVariants, type ZardAvatarGroupVariants } from './avatar.variants';

@Component({
  selector: 'z-avatar-group',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zAvatarGroup',
})
export class ZardAvatarGroupComponent {
  readonly zOrientation = input<ZardAvatarGroupVariants['zOrientation']>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(avatarGroupVariants({ zOrientation: this.zOrientation() }), this.class()),
  );
}
```
