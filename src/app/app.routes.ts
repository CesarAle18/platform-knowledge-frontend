import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

// Importamos las rutas de cada feature
import { AUTH_ROUTES } from './features/auth/routes';
import { DASHBOARD_ROUTES } from './features/dashboard/routes';
import { CONTENT_ROUTES } from './features/content/routes';
import { CATEGORIES_ROUTES } from './features/categories/routes';
import { CONCEPTS_ROUTES } from './features/concepts/routes';
import { GLOSSARY_ROUTES } from './features/glossary/routes';
import { PROCESSES_ROUTES } from './features/processes/routes';
import { CALENDAR_ROUTES } from './features/calendar/routes';
import { USERS_ROUTES } from './features/users/routes';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: AUTH_ROUTES,
  },
  {
    path: 'dashboard',
    children: DASHBOARD_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: 'content',
    children: CONTENT_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    children: CATEGORIES_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: 'concepts',
    children: CONCEPTS_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: 'glossary',
    children: GLOSSARY_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: 'processes',
    children: PROCESSES_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: 'calendar',
    children: CALENDAR_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    children: USERS_ROUTES,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
