import { Routes } from '@angular/router';
import { CategoryManagerComponent } from './category-manager/category-manager.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { EditorGuard } from '../../core/guards/editor.guard';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    component: CategoryManagerComponent,
    canActivate: [AuthGuard],
    title: 'Categorías - Plataforma de Conocimiento',
  },
  {
    path: 'create',
    component: CategoryManagerComponent,
    canActivate: [EditorGuard],
    data: { mode: 'create' },
    title: 'Crear Categoría - Plataforma de Conocimiento',
  },
  {
    path: 'edit/:id',
    component: CategoryManagerComponent,
    canActivate: [EditorGuard],
    data: { mode: 'edit' },
    title: 'Editar Categoría - Plataforma de Conocimiento',
  },
];
