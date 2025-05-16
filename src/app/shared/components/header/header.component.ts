// header.component.ts
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    MenubarModule,
    AvatarModule,
    SearchBarComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  items: MenuItem[] = [];
  
  constructor(private authService: AuthService, private router: Router) {
    this.buildMenu();
  }

  get userName(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.name : 'Usuario';
  }

  get userRole(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.role : '';
  }

  private buildMenu() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Gestión',
        icon: 'pi pi-fw pi-cog',
        visible: this.authService.hasRole(['admin', 'editor']),
        items: [
          {
            label: 'Categorías',
            icon: 'pi pi-fw pi-tags',
            routerLink: '/categories'
          },
          {
            label: 'Conceptos',
            icon: 'pi pi-fw pi-bookmark',
            routerLink: '/concepts'
          },
          {
            label: 'Procesos',
            icon: 'pi pi-fw pi-sitemap',
            routerLink: '/processes'
          },
          {
            label: 'Glosario',
            icon: 'pi pi-fw pi-book',
            routerLink: '/glossary'
          }
        ]
      },
      {
        label: 'Calendario',
        icon: 'pi pi-fw pi-calendar',
        routerLink: '/calendar'
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-fw pi-users',
        routerLink: '/users',
        visible: this.authService.hasRole(['admin'])
      }
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
