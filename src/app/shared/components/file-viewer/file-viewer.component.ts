import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { File } from '../../../core/models/file.model';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TabViewModule,
    SafeHtmlPipe,
  ],
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss'],
})
export class FileViewerComponent implements OnChanges {
  @Input() file!: File | null;
  @Input() visible: boolean = false;
  @Input() fullscreen: boolean = false;

  fileUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['file'] && this.file) {
      this.fileUrl = this.sanitizeUrl(this.file.path);
    }
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  download() {
    if (this.file) {
      const link = document.createElement('a');
      link.href = this.file.path;
      link.download = this.file.name;
      link.target = '_blank';
      link.click();
    }
  }

  isImage(): boolean {
    return this.file?.mimeType.startsWith('image/') || false;
  }

  isPdf(): boolean {
    return this.file?.mimeType === 'application/pdf' || false;
  }

  isVideo(): boolean {
    return this.file?.mimeType.startsWith('video/') || false;
  }

  isPresentation(): boolean {
    return (
      this.file?.mimeType.includes('presentation') ||
      this.file?.mimeType.includes('powerpoint') ||
      false
    );
  }

  getDialogClass(): string {
    return this.fullscreen ? 'w-full h-full' : 'w-9 md:w-6';
  }
}
