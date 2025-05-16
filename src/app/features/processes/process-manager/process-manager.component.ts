import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { EditorModule } from 'primeng/editor';

// Services and Models
import { ProcessService } from '../../core/services/process.service';
import { CategoryService } from '../../core/services/category.service';
import { FileUploadService } from '../../core/services/file-upload.service';
import { AuthService } from '../../core/services/auth.service';
import {
  Process,
  Version,
  Category,
  Tag,
  File,
} from '../../core/models/process.model';

@Component({
  selector: 'app-process-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ChipModule,
    TagModule,
    ToolbarModule,
    CardModule,
    FileUploadModule,
    EditorModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './process-manager.component.html',
  styleUrls: ['./process-manager.component.scss'],
})
export class ProcessManagerComponent implements OnInit {
  processes: Process[] = [];
  selectedProcess: Process | null = null;
  processDialog: boolean = false;
  versionDialog: boolean = false;
  deleteProcessDialog: boolean = false;
  processForm: FormGroup;
  versionForm: FormGroup;
  categories: Category[] = [];
  statuses: any[] = [
    { label: 'Borrador', value: 'draft' },
    { label: 'Publicado', value: 'published' },
    { label: 'Archivado', value: 'archived' },
  ];
  currentUser: any;
  selectedFiles: File[] = [];
  loading: boolean = true;

  constructor(
    private processService: ProcessService,
    private categoryService: CategoryService,
    private fileUploadService: FileUploadService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.processForm = this.formBuilder.group({
      id: [null],
      title: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: [null],
      status: ['draft', Validators.required],
    });

    this.versionForm = this.formBuilder.group({
      versionNumber: ['', Validators.required],
      content: ['', Validators.required],
      changeReason: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadProcesses();
    this.loadCategories();
    this.currentUser = this.authService.getCurrentUser();
  }

  loadProcesses() {
    this.loading = true;
    this.processService.getProcesses().subscribe({
      next: (data) => {
        this.processes = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los procesos',
          life: 3000,
        });
        this.loading = false;
      },
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las categorías',
          life: 3000,
        });
      },
    });
  }

  openNew() {
    this.selectedProcess = null;
    this.processForm.reset();
    this.processForm.patchValue({
      status: 'draft',
    });
    this.processDialog = true;
  }

  editProcess(process: Process) {
    this.selectedProcess = { ...process };
    this.processForm.patchValue({
      id: process.id,
      title: process.title,
      description: process.description,
      categoryId: process.categoryId,
      status: process.status,
    });
    this.processDialog = true;
  }

  viewProcess(process: Process) {
    this.router.navigate(['/processes', process.id]);
  }

  deleteProcess(process: Process) {
    this.deleteProcessDialog = true;
    this.selectedProcess = process;
  }

  confirmDelete() {
    if (this.selectedProcess && this.selectedProcess.id) {
      this.processService.deleteProcess(this.selectedProcess.id).subscribe({
        next: () => {
          this.processes = this.processes.filter(
            (val) => val.id !== this.selectedProcess!.id
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Proceso eliminado',
            life: 3000,
          });
          this.selectedProcess = null;
          this.deleteProcessDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el proceso',
            life: 3000,
          });
        },
      });
    }
  }

  hideDialog() {
    this.processDialog = false;
    this.processForm.reset();
  }

  hideVersionDialog() {
    this.versionDialog = false;
    this.versionForm.reset();
  }

  saveProcess() {
    if (this.processForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos',
        life: 3000,
      });
      return;
    }

    const processData = this.processForm.value;

    if (processData.id) {
      this.processService.updateProcess(processData.id, processData).subscribe({
        next: (updatedProcess) => {
          const index = this.processes.findIndex(
            (p) => p.id === updatedProcess.id
          );
          if (index !== -1) {
            this.processes[index] = updatedProcess;
            this.processes = [...this.processes];
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Proceso actualizado',
            life: 3000,
          });
          this.processDialog = false;
          this.processForm.reset();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el proceso',
            life: 3000,
          });
        },
      });
    } else {
      this.processService.createProcess(processData).subscribe({
        next: (newProcess) => {
          this.processes.push(newProcess);
          this.processes = [...this.processes];
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Proceso creado',
            life: 3000,
          });
          this.processDialog = false;
          this.processForm.reset();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el proceso',
            life: 3000,
          });
        },
      });
    }
  }

  createNewVersion(process: Process) {
    this.selectedProcess = process;
    this.versionForm.reset();

    // Calcular el siguiente número de versión
    if (process.currentVersion && process.currentVersion.versionNumber) {
      const currentVersion = process.currentVersion.versionNumber;
      const versionParts = currentVersion.split('.');
      const newMinorVersion = parseInt(versionParts[1] || '0') + 1;
      this.versionForm.patchValue({
        versionNumber: `${versionParts[0]}.${newMinorVersion}`,
      });
    } else {
      this.versionForm.patchValue({
        versionNumber: '1.0',
      });
    }

    // Si hay una versión actual, prellenar el contenido
    if (process.currentVersion && process.currentVersion.content) {
      this.versionForm.patchValue({
        content: process.currentVersion.content,
      });
    }

    this.versionDialog = true;
  }

  saveVersion() {
    if (this.versionForm.invalid || !this.selectedProcess) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos',
        life: 3000,
      });
      return;
    }

    const versionData = {
      ...this.versionForm.value,
      modelType: 'process',
      modelId: this.selectedProcess.id,
      authorId: this.currentUser.id,
    };

    this.processService.createVersion(versionData).subscribe({
      next: (response) => {
        // Actualizar el proceso en la lista
        const index = this.processes.findIndex(
          (p) => p.id === this.selectedProcess!.id
        );
        if (index !== -1) {
          this.processes[index].currentVersionId = response.id;
          this.processes[index].currentVersion = response;
          this.processes = [...this.processes];
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Nueva versión creada',
          life: 3000,
        });
        this.versionDialog = false;
        this.versionForm.reset();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear la versión',
          life: 3000,
        });
      },
    });
  }

  onUpload(event: any, processId: number) {
    const files = event.files;

    if (files.length) {
      this.fileUploadService
        .uploadFiles(files, 'process', processId)
        .subscribe({
          next: (uploadedFiles) => {
            // Actualizar el proceso en la lista con los nuevos archivos
            const index = this.processes.findIndex((p) => p.id === processId);
            if (index !== -1) {
              this.processes[index].files = [
                ...(this.processes[index].files || []),
                ...uploadedFiles,
              ];
              this.processes = [...this.processes];
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Archivos subidos correctamente',
              life: 3000,
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al subir los archivos',
              life: 3000,
            });
          },
        });
    }
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    const statusObj = this.statuses.find((s) => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  getCategoryName(categoryId: number | undefined): string {
    if (!categoryId) return 'Sin categoría';
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

  clear(table: Table) {
    table.clear();
  }
}
