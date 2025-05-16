import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar sesión - Plataforma de Conocimiento',
  },
  {
    path: 'logout',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
