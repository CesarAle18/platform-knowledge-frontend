import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { File } from '../../../core/models/file.model';
import { Category } from '../../../core/models/category.model';
import { Tag } from '../../../core/models/tag.model';
import { Concept } from '../../../core/models/concept.model';
import { Process } from '../../../core/models/process.model';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { CategoryService } from '../../../core/services/category.service';
import { ConceptService } from '../../../core/services/concept.service';
import { ProcessService } from '../../../core/services/process.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    ChipsModule,
    DropdownModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    TableModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent implements OnInit {
  uploadForm!: FormGroup;
  files: File[] = [];
  categories: Category[] = [];
  concepts: Concept[] = [];
  processes: Process[] = [];
  isLoading = false;
  selectedTags: string[] = [];
  fileTypes = [
    { label: 'Documento', value: 'document' },
    { label: 'Imagen', value: 'image' },
    { label: 'Video', value: 'video' },
    { label: 'Presentación', value: 'presentation' },
    { label: 'Otro', value: 'other' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private fileUploadService: FileUploadService,
    private categoryService: CategoryService,
    private conceptService: ConceptService,
    private processService: ProcessService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFiles();
    this.loadCategories();
    this.loadConcepts();
    this.loadProcesses();
  }

  initForm(): void {
    this.uploadForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      type: ['document', Validators.required],
      categoryId: [null],
      conceptId: [null],
      processId: [null],
      tags: [[]],
    });
  }

  loadFiles(): void {
    this.isLoading = true;
    this.fileUploadService.getFiles().subscribe({
      next: (files) => {
        this.files = files;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading files:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los archivos',
        });
        this.isLoading = false;
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  loadConcepts(): void {
    this.conceptService.getConcepts().subscribe({
      next: (concepts) => {
        this.concepts = concepts;
      },
      error: (error) => {
        console.error('Error loading concepts:', error);
      },
    });
  }

  loadProcesses(): void {
    this.processService.getProcesses().subscribe({
      next: (processes) => {
        this.processes = processes;
      },
      error: (error) => {
        console.error('Error loading processes:', error);
      },
    });
  }

  onUpload(event: any): void {
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const fileData = event.files[0];

    formData.append('file', fileData);
    formData.append(
      'name',
      this.uploadForm.get('name')?.value || fileData.name
    );
    formData.append(
      'description',
      this.uploadForm.get('description')?.value || ''
    );
    formData.append('type', this.uploadForm.get('type')?.value);

    if (this.uploadForm.get('categoryId')?.value) {
      formData.append('categoryId', this.uploadForm.get('categoryId')?.value);
    }

    if (this.uploadForm.get('conceptId')?.value) {
      formData.append('conceptId', this.uploadForm.get('conceptId')?.value);
    }

    if (this.uploadForm.get('processId')?.value) {
      formData.append('processId', this.uploadForm.get('processId')?.value);
    }

    if (this.uploadForm.get('tags')?.value?.length) {
      formData.append(
        'tags',
        JSON.stringify(this.uploadForm.get('tags')?.value)
      );
    }

    this.isLoading = true;
    this.fileUploadService.uploadFile(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Archivo subido correctamente',
        });
        this.resetForm();
        this.loadFiles();
      },
      error: (error) => {
        console.error('Error uploading file:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al subir el archivo',
        });
        this.isLoading = false;
      },
    });
  }

  resetForm(): void {
    this.uploadForm.reset({
      type: 'document',
    });
    this.selectedTags = [];
  }

  deleteFile(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este archivo?')) {
      this.fileUploadService.deleteFile(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Archivo eliminado correctamente',
          });
          this.loadFiles();
        },
        error: (error) => {
          console.error('Error deleting file:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el archivo',
          });
        },
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
