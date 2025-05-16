import { Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { EditorGuard } from '../../core/guards/editor.guard';

export const CALENDAR_ROUTES: Routes = [
  {
    path: '',
    component: CalendarViewComponent,
    canActivate: [AuthGuard],
    title: 'Calendario - Plataforma de Conocimiento',
  },
  {
    path: 'create',
    component: CalendarViewComponent,
    canActivate: [EditorGuard],
    data: { mode: 'create' },
    title: 'Crear Evento - Plataforma de Conocimiento',
  },
  {
    path: 'edit/:id',
    component: CalendarViewComponent,
    canActivate: [EditorGuard],
    data: { mode: 'edit' },
    title: 'Editar Evento - Plataforma de Conocimiento',
  },
];
