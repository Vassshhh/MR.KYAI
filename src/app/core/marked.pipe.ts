// src/app/core/pipes/marked.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
  name: 'marked',
  standalone: true
})
export class MarkedPipe implements PipeTransform {
  async transform(value: string | null | undefined): Promise<string> {
    if (value) {
      return await marked.parse(value);
    }
    return '';
  }
}
