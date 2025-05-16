import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ToolbarModule } from 'primeng/toolbar';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';

import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { FileSizePipe } from '../../shared/pipes/file-size.pipe';
import { FileViewerComponent } from '../../shared/components/file-viewer/file-viewer.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

import {
  File,
  Category,
  Tag,
  Concept,
  Process,
} from '../../core/models/file.model';
import { ApiService } from '../../core/services/api.service';
import { FileUploadService } from '../../core/services/file-upload.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    ToastModule,
    TagModule,
    ChipModule,
    ToolbarModule,
    TabViewModule,
    CardModule,
    SafeHtmlPipe,
    FileSizePipe,
    FileViewerComponent,
    SearchBarComponent,
  ],
  providers: [MessageService],
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss'],
})
export class ContentListComponent implements OnInit {
  files: File[] = [];
  selectedFile: File | null = null;
  categories: Category[] = [];
  concepts: Concept[] = [];
  processes: Process[] = [];
  availableTags: Tag[] = [];
  selectedTags: Tag[] = [];

  displayFileDialog: boolean = false;
  displayViewDialog: boolean = false;
  searchTerm: string = '';
  fileTypeFilter: string = '';
  selectedCategory: Category | null = null;

  loading: boolean = true;
  totalRecords: number = 0;

  constructor(
    private apiService: ApiService,
    private fileUploadService: FileUploadService,
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadFiles();
    this.loadCategories();
    this.loadTags();
    this.loadConcepts();
    this.loadProcesses();
  }

  loadFiles(event?: any) {
    this.loading = true;
    let params = {};

    if (event) {
      params = {
        first: event.first,
        rows: event.rows,
        sortField: event.sortField,
        sortOrder: event.sortOrder,
      };
    }

    if (this.searchTerm) {
      params['search'] = this.searchTerm;
    }

    if (this.fileTypeFilter) {
      params['type'] = this.fileTypeFilter;
    }

    if (this.selectedCategory) {
      params['categoryId'] = this.selectedCategory.id;
    }

    this.apiService.get('files', params).subscribe({
      next: (response) => {
        this.files = response.data;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de archivos',
        });
        this.loading = false;
      },
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar las categorías',
        });
      },
    });
  }

  loadTags() {
    this.apiService.get('tags').subscribe({
      next: (tags) => (this.availableTags = tags),
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar las etiquetas',
        });
      },
    });
  }

  loadConcepts() {
    this.apiService.get('concepts').subscribe({
      next: (concepts) => (this.concepts = concepts),
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar los conceptos',
        });
      },
    });
  }

  loadProcesses() {
    this.apiService.get('processes').subscribe({
      next: (processes) => (this.processes = processes),
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar los procesos',
        });
      },
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.loadFiles();
  }

  onCategoryChange() {
    this.loadFiles();
  }

  onFileTypeChange() {
    this.loadFiles();
  }

  onViewFile(file: File) {
    this.selectedFile = file;
    this.displayViewDialog = true;
  }

  onEditFile(file: File) {
    this.selectedFile = { ...file };
    this.displayFileDialog = true;
  }

  onDeleteFile(file: File) {
    if (confirm('¿Está seguro que desea eliminar este archivo?')) {
      this.apiService.delete(`files/${file.id}`).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Archivo eliminado correctamente',
          });
          this.loadFiles();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el archivo',
          });
        },
      });
    }
  }

  saveFile() {
    if (!this.selectedFile) return;

    const operation = this.selectedFile.id
      ? this.apiService.put(`files/${this.selectedFile.id}`, this.selectedFile)
      : this.apiService.post('files', this.selectedFile);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Archivo ${
            this.selectedFile.id ? 'actualizado' : 'creado'
          } correctamente`,
        });
        this.closeFileDialog();
        this.loadFiles();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo ${
            this.selectedFile.id ? 'actualizar' : 'crear'
          } el archivo`,
        });
      },
    });
  }

  openNewFileDialog() {
    this.selectedFile = {
      name: '',
      path: '',
      size: 0,
      mimeType: '',
      type: 'document',
    };
    this.displayFileDialog = true;
  }

  closeFileDialog() {
    this.displayFileDialog = false;
    this.selectedFile = null;
  }

  closeViewDialog() {
    this.displayViewDialog = false;
    this.selectedFile = null;
  }

  getFileTypeClass(type: string): string {
    const typeClasses = {
      document: 'p-tag-info',
      image: 'p-tag-success',
      video: 'p-tag-warning',
      presentation: 'p-tag-danger',
      other: 'p-tag-secondary',
    };
    return typeClasses[type] || 'p-tag-secondary';
  }

  getFileTypeIcon(type: string): string {
    const typeIcons = {
      document: 'pi pi-file-pdf',
      image: 'pi pi-image',
      video: 'pi pi-video',
      presentation: 'pi pi-desktop',
      other: 'pi pi-file',
    };
    return typeIcons[type] || 'pi pi-file';
  }

  onFileUpload(event: any) {
    const files = event.files;
    if (files && files.length) {
      const uploadPromises = files.map((file) => {
        return this.fileUploadService.uploadFile(file, {
          categoryId: this.selectedCategory?.id,
          type: this.determineFileType(file),
        });
      });

      Promise.all(uploadPromises)
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Archivos subidos correctamente',
          });
          this.loadFiles();
        })
        .catch((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al subir archivos',
          });
        });
    }
  }

  determineFileType(file: any): string {
    const mimeType = file.type;
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('word') ||
      mimeType.includes('text')
    ) {
      return 'document';
    } else if (mimeType.includes('image')) {
      return 'image';
    } else if (mimeType.includes('video')) {
      return 'video';
    } else if (
      mimeType.includes('presentation') ||
      mimeType.includes('powerpoint')
    ) {
      return 'presentation';
    } else {
      return 'other';
    }
  }
}
