import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    PasswordModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    ToolbarModule,
    PaginatorModule,
    RippleModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.scss',
})
export class UserManagerComponent implements OnInit {
  users: User[] = [];
  selectedUsers: User[] = [];
  userDialog: boolean = false;
  deleteUserDialog: boolean = false;
  deleteUsersDialog: boolean = false;
  user: User = {} as User;
  submitted: boolean = false;
  loading: boolean = false;

  userForm: FormGroup;

  roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Visualizador', value: 'viewer' },
  ];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios',
          life: 3000,
        });
        this.loading = false;
      },
    });
  }

  openNew(): void {
    this.user = {} as User;
    this.submitted = false;
    this.userDialog = true;

    // Reset el formulario
    this.userForm.reset();
    this.userForm
      .get('password')
      ?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  deleteSelectedUsers(): void {
    this.deleteUsersDialog = true;
  }

  editUser(user: User): void {
    // Clonamos el usuario para no modificar directamente el original
    this.user = { ...user };

    // Actualizamos el formulario con los datos del usuario
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Password es opcional al editar
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();

    this.userDialog = true;
  }

  deleteUser(user: User): void {
    this.deleteUserDialog = true;
    this.user = { ...user };
  }

  confirmDeleteSelected(): void {
    this.deleteUsersDialog = false;

    const ids = this.selectedUsers.map((user) => user.id);

    this.userService.deleteUsers(ids).subscribe({
      next: () => {
        this.loadUsers();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuarios eliminados',
          life: 3000,
        });
        this.selectedUsers = [];
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron eliminar los usuarios',
          life: 3000,
        });
      },
    });
  }

  confirmDelete(): void {
    this.deleteUserDialog = false;

    if (this.user.id) {
      this.userService.deleteUser(this.user.id).subscribe({
        next: () => {
          this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario eliminado',
            life: 3000,
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el usuario',
            life: 3000,
          });
        },
      });
    }
  }

  hideDialog(): void {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser(): void {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    // Obtenemos los valores del formulario
    const userData: User = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      role: this.userForm.value.role,
    };

    // Si hay contraseña, la agregamos
    if (this.userForm.value.password) {
      userData.password = this.userForm.value.password;
    }

    if (this.user.id) {
      // Actualizar usuario existente
      userData.id = this.user.id;

      this.userService.updateUser(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario actualizado',
            life: 3000,
          });
          this.userDialog = false;
          this.user = {} as User;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el usuario',
            life: 3000,
          });
        },
      });
    } else {
      // Crear nuevo usuario
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario creado',
            life: 3000,
          });
          this.userDialog = false;
          this.user = {} as User;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el usuario',
            life: 3000,
          });
        },
      });
    }
  }

  getRoleSeverity(role: string): string {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'editor':
        return 'warning';
      default:
        return 'info';
    }
  }
}
