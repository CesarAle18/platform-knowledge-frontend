import { Routes } from '@angular/router';
import { ProcessManagerComponent } from './process-manager/process-manager.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { EditorGuard } from '../../core/guards/editor.guard';

export const PROCESSES_ROUTES: Routes = [
  {
    path: '',
    component: ProcessManagerComponent,
    canActivate: [AuthGuard],
    title: 'Procesos - Plataforma de Conocimiento',
  },
  {
    path: 'create',
    component: ProcessManagerComponent,
    canActivate: [EditorGuard],
    data: { mode: 'create' },
    title: 'Crear Proceso - Plataforma de Conocimiento',
  },
  {
    path: 'edit/:id',
    component: ProcessManagerComponent,
    canActivate: [EditorGuard],
    data: { mode: 'edit' },
    title: 'Editar Proceso - Plataforma de Conocimiento',
  },
  {
    path: 'view/:id',
    component: ProcessManagerComponent,
    canActivate: [AuthGuard],
    data: { mode: 'view' },
    title: 'Ver Proceso - Plataforma de Conocimiento',
  },
  {
    path: 'version/:id',
    component: ProcessManagerComponent,
    canActivate: [AuthGuard],
    data: { mode: 'version' },
    title: 'Historial de Versiones - Plataforma de Conocimiento',
  },
];
