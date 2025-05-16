import { Routes } from '@angular/router';
import { ConceptManagerComponent } from './concept-manager/concept-manager.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { EditorGuard } from '../../core/guards/editor.guard';

export const CONCEPTS_ROUTES: Routes = [
  {
    path: '',
    component: ConceptManagerComponent,
    canActivate: [AuthGuard],
    title: 'Conceptos - Plataforma de Conocimiento',
  },
  {
    path: 'create',
    component: ConceptManagerComponent,
    canActivate: [EditorGuard],
    data: { mode: 'create' },
    title: 'Crear Concepto - Plataforma de Conocimiento',
  },
  {
    path: 'edit/:id',
    component: ConceptManagerComponent,
    canActivate: [EditorGuard],
    data: { mode: 'edit' },
    title: 'Editar Concepto - Plataforma de Conocimiento',
  },
  {
    path: 'view/:id',
    component: ConceptManagerComponent,
    canActivate: [AuthGuard],
    data: { mode: 'view' },
    title: 'Ver Concepto - Plataforma de Conocimiento',
  },
];
