import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { EditorModule } from 'primeng/editor';

import {
  Glossary,
  Category,
  Version,
  User,
} from '../../../core/models/glossary.model';
import { GlossaryService } from '../../../core/services/glossary.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-glossary-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    MessagesModule,
    TagModule,
    ChipModule,
    EditorModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './glossary-manager.component.html',
  styleUrls: ['./glossary-manager.component.scss'],
})
export class GlossaryManagerComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  glossaryItems: Glossary[] = [];
  categories: Category[] = [];
  selectedGlossary: Glossary | null = null;

  glossaryDialog: boolean = false;
  versionDialog: boolean = false;
  viewVersionDialog: boolean = false;

  glossaryForm!: FormGroup;
  versionForm!: FormGroup;
  versionHistory: Version[] = [];

  currentUser!: User;
  isLoading: boolean = false;

  constructor(
    private glossaryService: GlossaryService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadGlossaryItems();
    this.loadCategories();

    this.initGlossaryForm();
    this.initVersionForm();
  }

  initGlossaryForm() {
    this.glossaryForm = this.fb.group({
      id: [null],
      term: ['', [Validators.required, Validators.minLength(2)]],
      definition: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: [null, Validators.required],
    });
  }

  initVersionForm() {
    this.versionForm = this.fb.group({
      versionNumber: ['', Validators.required],
      content: ['', Validators.required],
      reasonForChange: ['', Validators.required],
    });
  }

  loadGlossaryItems() {
    this.isLoading = true;
    this.glossaryService.getGlossaryItems().subscribe({
      next: (data) => {
        this.glossaryItems = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los términos del glosario',
        });
        this.isLoading = false;
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
          detail: 'No se pudieron cargar las categorías',
        });
      },
    });
  }

  openNew() {
    this.selectedGlossary = null;
    this.glossaryForm.reset();
    this.glossaryDialog = true;
  }

  editGlossaryItem(glossary: Glossary) {
    this.selectedGlossary = { ...glossary };
    this.glossaryForm.patchValue({
      id: glossary.id,
      term: glossary.term,
      definition: glossary.definition,
      categoryId: glossary.categoryId,
    });
    this.glossaryDialog = true;
  }

  openVersionHistory(glossary: Glossary) {
    this.selectedGlossary = { ...glossary };
    this.glossaryService.getGlossaryVersions(glossary.id!).subscribe({
      next: (versions) => {
        this.versionHistory = versions;
        this.viewVersionDialog = true;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el historial de versiones',
        });
      },
    });
  }

  createNewVersion(glossary: Glossary) {
    this.selectedGlossary = { ...glossary };
    this.versionForm.reset();
    this.versionForm.patchValue({
      content: glossary.definition,
    });
    this.versionDialog = true;
  }

  saveVersion() {
    if (this.versionForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos',
      });
      return;
    }

    const versionData = {
      ...this.versionForm.value,
      modelType: 'glossary',
      modelId: this.selectedGlossary!.id!,
      authorId: this.currentUser.id!,
    };

    this.glossaryService.createGlossaryVersion(versionData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Versión creada correctamente',
        });
        this.versionDialog = false;
        this.loadGlossaryItems();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear la versión',
        });
      },
    });
  }

  saveGlossaryItem() {
    if (this.glossaryForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos',
      });
      return;
    }

    const glossaryData = this.glossaryForm.value;

    if (glossaryData.id) {
      // Update existing glossary term
      this.glossaryService.updateGlossaryItem(glossaryData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Término actualizado correctamente',
          });
          this.glossaryDialog = false;
          this.loadGlossaryItems();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el término',
          });
        },
      });
    } else {
      // Create new glossary term
      this.glossaryService.createGlossaryItem(glossaryData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Término creado correctamente',
          });
          this.glossaryDialog = false;
          this.loadGlossaryItems();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el término',
          });
        },
      });
    }
  }

  deleteGlossaryItem(glossary: Glossary) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el término "${glossary.term}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.glossaryService.deleteGlossaryItem(glossary.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Término eliminado correctamente',
            });
            this.loadGlossaryItems();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el término',
            });
          },
        });
      },
    });
  }

  getCategoryName(categoryId: number | undefined): string {
    if (!categoryId) return 'Sin categoría';
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.table.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }
}
