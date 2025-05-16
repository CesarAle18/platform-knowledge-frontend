import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnChanges {
  @Input() searchText: string = '';
  @Input() caseSensitive: boolean = false;

  originalContent: string;

  constructor(private el: ElementRef) {
    // Guardar el contenido original para poder restaurarlo
    this.originalContent = this.el.nativeElement.innerHTML;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchText'] || changes['caseSensitive']) {
      // Restaurar el contenido original antes de aplicar el nuevo resaltado
      this.el.nativeElement.innerHTML = this.originalContent;

      if (this.searchText && this.searchText.length > 0) {
        this.highlightSearchText();
      }
    }
  }

  private highlightSearchText(): void {
    const content = this.el.nativeElement.innerHTML;
    if (!content || !this.searchText) {
      return;
    }

    const flags = this.caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(`(${this.escapeRegExp(this.searchText)})`, flags);
    const newContent = content.replace(
      regex,
      '<span class="highlight">$1</span>'
    );

    this.el.nativeElement.innerHTML = newContent;
  }

  private escapeRegExp(text: string): string {
    // Escapar caracteres especiales de las expresiones regulares
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
