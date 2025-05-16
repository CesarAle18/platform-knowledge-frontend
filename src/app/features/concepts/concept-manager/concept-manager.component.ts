import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipsModule } from 'primeng/chips';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { ConceptService } from '../../../core/services/concept.service';
import {
  Concept,
  Client,
  Zone,
  Tag,
  File,
} from '../../../core/models/concept.model';

@Component({
  selector: 'app-concept-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ToastModule,
    MultiSelectModule,
    ChipsModule,
    FileUploadModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './concept-manager.component.html',
  styleUrl: './concept-manager.component.scss',
})
export class ConceptManagerComponent implements OnInit {
  concepts: Concept[] = [];
  clients: Client[] = [];
  zones: Zone[] = [];
  availableTags: Tag[] = [];

  concept: Concept = {
    name: '',
    description: '',
    tags: [],
  };

  conceptForm: FormGroup;
  conceptDialog: boolean = false;
  submitted: boolean = false;
  isEditing: boolean = false;

  selectedFiles: any[] = [];
  uploadedFiles: File[] = [];

  constructor(
    private conceptService: ConceptService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.conceptForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      clientId: [null],
      coordinator: [''],
      zoneId: [null],
      tags: [[]],
    });
  }

  ngOnInit(): void {
    this.loadConcepts();
    this.loadClients();
    this.loadZones();
    this.loadTags();
  }

  loadConcepts(): void {
    this.conceptService.getConcepts().subscribe(
      (data) => {
        this.concepts = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los conceptos',
        });
      }
    );
  }

  loadClients(): void {
    this.conceptService.getClients().subscribe((data) => {
      this.clients = data;
    });
  }

  loadZones(): void {
    this.conceptService.getZones().subscribe((data) => {
      this.zones = data;
    });
  }

  loadTags(): void {
    this.conceptService.getTags().subscribe((data) => {
      this.availableTags = data;
    });
  }

  openNew(): void {
    this.concept = {
      name: '',
      description: '',
      tags: [],
    };
    this.conceptForm.reset();
    this.submitted = false;
    this.conceptDialog = true;
    this.isEditing = false;
    this.selectedFiles = [];
  }

  editConcept(concept: Concept): void {
    this.concept = { ...concept };
    this.conceptForm.patchValue({
      name: concept.name,
      description: concept.description,
      clientId: concept.clientId,
      coordinator: concept.coordinator,
      zoneId: concept.zoneId,
      tags: concept.tags,
    });
    this.conceptDialog = true;
    this.isEditing = true;

    // Cargar archivos asociados
    if (concept.id) {
      this.conceptService.getConceptFiles(concept.id).subscribe((files) => {
        this.uploadedFiles = files;
      });
    }
  }

  deleteConcept(concept: Concept): void {
    this.confirmationService.confirm({
      message:
        '¿Está seguro que desea eliminar el concepto "' + concept.name + '"?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (concept.id) {
          this.conceptService.deleteConcept(concept.id).subscribe(
            () => {
              this.concepts = this.concepts.filter(
                (val) => val.id !== concept.id
              );
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Concepto eliminado',
                life: 3000,
              });
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el concepto',
              });
            }
          );
        }
      },
    });
  }

  hideDialog(): void {
    this.conceptDialog = false;
    this.submitted = false;
    this.selectedFiles = [];
  }

  saveConcept(): void {
    this.submitted = true;

    if (this.conceptForm.invalid) {
      return;
    }

    const conceptData = {
      ...this.concept,
      ...this.conceptForm.value,
    };

    if (this.isEditing && conceptData.id) {
      // Actualizar concepto existente
      this.conceptService.updateConcept(conceptData.id, conceptData).subscribe(
        (response) => {
          // Manejar archivos si se han seleccionado nuevos
          if (this.selectedFiles.length > 0) {
            this.uploadFiles(conceptData.id);
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Concepto actualizado',
            life: 3000,
          });
          this.loadConcepts();
          this.conceptDialog = false;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el concepto',
          });
        }
      );
    } else {
      // Crear nuevo concepto
      this.conceptService.createConcept(conceptData).subscribe(
        (response) => {
          // Manejar archivos si se han seleccionado
          if (this.selectedFiles.length > 0 && response.id) {
            this.uploadFiles(response.id);
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Concepto creado',
            life: 3000,
          });
          this.loadConcepts();
          this.conceptDialog = false;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el concepto',
          });
        }
      );
    }
  }

  onFileSelect(event: any): void {
    for (let file of event.files) {
      this.selectedFiles.push(file);
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Archivos seleccionados',
      detail: 'Se han seleccionado ' + event.files.length + ' archivos',
    });
  }

  uploadFiles(conceptId: number): void {
    if (this.selectedFiles.length > 0) {
      this.conceptService.uploadFiles(conceptId, this.selectedFiles).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Archivos subidos correctamente',
            life: 3000,
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron subir los archivos',
          });
        }
      );
    }
  }

  removeFile(file: File): void {
    if (file.id) {
      this.confirmationService.confirm({
        message:
          '¿Está seguro que desea eliminar el archivo "' + file.name + '"?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.conceptService.deleteFile(file.id).subscribe(
            () => {
              this.uploadedFiles = this.uploadedFiles.filter(
                (f) => f.id !== file.id
              );
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Archivo eliminado',
                life: 3000,
              });
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el archivo',
              });
            }
          );
        },
      });
    }
  }
}
