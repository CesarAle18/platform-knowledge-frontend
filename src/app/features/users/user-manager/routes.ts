import { Routes } from '@angular/router';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AdminGuard } from '../../core/guards/admin.guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UserManagerComponent,
    canActivate: [AuthGuard, AdminGuard],
    title: 'Gestión de Usuarios - Plataforma de Conocimiento',
  },
  {
    path: 'create',
    component: UserManagerComponent,
    canActivate: [AuthGuard, AdminGuard],
    data: { mode: 'create' },
    title: 'Crear Usuario - Plataforma de Conocimiento',
  },
  {
    path: 'edit/:id',
    component: UserManagerComponent,
    canActivate: [AuthGuard, AdminGuard],
    data: { mode: 'edit' },
    title: 'Editar Usuario - Plataforma de Conocimiento',
  },
];
