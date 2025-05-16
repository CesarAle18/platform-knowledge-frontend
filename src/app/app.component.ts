import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { AuthService } from './core/services/auth.service';

// Componentes compartidos
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Plataforma de Conocimiento para Laboratorios';
  sidebarVisible = true;
  isLoggedIn = false;

  constructor(
    private primeng: PrimeNG,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Activar efecto ripple en componentes PrimeNG
    this.primengConfig.ripple = true;

    // Verificar si el usuario está autenticado
    this.authService.isAuthenticated().subscribe({
      next: (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
      },
    });

    // Suscribirse a cambios en el estado de autenticación
    this.authService.authState$.subscribe({
      next: (authState) => {
        this.isLoggedIn = authState.isAuthenticated;
      },
    });
  }

  /**
   * Alternar la visibilidad del sidebar
   */
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
