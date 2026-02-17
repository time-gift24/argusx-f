import { Injectable } from '@angular/core';
import remend from 'remend';
import type { RemendOptions } from 'remend';

@Injectable({ providedIn: 'root' })
export class RemendService {
  complete(markdown: string, options?: RemendOptions): string {
    return remend(markdown, options);
  }
}
