import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// ✅ Pindah konfigurasi ke sini (global, sekali saja)
marked.setOptions({
  breaks: true,
  gfm: true,
  silent: true
});

@Pipe({
  name: 'marked',
  standalone: true
})
export class MarkedPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value || typeof value !== 'string') {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }

    try {
      const html = marked.parse(value) as string;
      return this.sanitizer.bypassSecurityTrustHtml(html);
    } catch {
      const fallbackHtml = value
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
      return this.sanitizer.bypassSecurityTrustHtml(fallbackHtml);
    }
  }
}
