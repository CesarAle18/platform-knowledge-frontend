import { Routes } from '@angular/router';
import { GlossaryManagerComponent } from './glossary-manager/glossary-manager.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { EditorGuard } from '../../core/guards/editor.guard';

export const GLOSSARY_ROUTES: Routes = [
  {
    path: '',
    component: GlossaryManagerComponent,
    canActivate: [AuthGuard],
    title: 'Glosario - Plataforma de Conocimiento',
  },
  {
    path: 'create',
    component: GlossaryManagerComponent,
    canActivate: [EditorGuard],
    data: { mode: 'create' },
    title: 'Crear Término - Plataforma de Conocimiento',
  },
  {
    path: 'edit/:id',
    component: GlossaryManagerComponent,
    canActivate: [EditorGuard],
    data: { mode: 'edit' },
    title: 'Editar Término - Plataforma de Conocimiento',
  },
  {
    path: 'version/:id',
    component: GlossaryManagerComponent,
    canActivate: [AuthGuard],
    data: { mode: 'version' },
    title: 'Historial de Versiones - Plataforma de Conocimiento',
  },
];
