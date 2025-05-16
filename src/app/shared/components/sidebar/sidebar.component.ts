// sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TreeModule,
    PanelMenuModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  categories: TreeNode[] = [];

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.buildMenu();
  }

  private buildMenu() {
    this.menuItems = [
      {
        label: 'Contenido',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Todos los archivos',
            icon: 'pi pi-fw pi-folder-open',
            routerLink: '/content',
          },
          {
            label: 'Subir archivo',
            icon: 'pi pi-fw pi-upload',
            routerLink: '/content/upload',
            visible: this.authService.hasRole(['admin', 'editor']),
          },
        ],
      },
      {
        label: 'Conceptos técnicos',
        icon: 'pi pi-fw pi-bookmark',
        routerLink: '/concepts',
      },
      {
        label: 'Procesos',
        icon: 'pi pi-fw pi-sitemap',
        routerLink: '/processes',
      },
      {
        label: 'Glosario',
        icon: 'pi pi-fw pi-book',
        routerLink: '/glossary',
      },
    ];
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = this.transformCategoriesToTreeNodes(categories);
    });
  }

  private transformCategoriesToTreeNodes(categories: any[]): TreeNode[] {
    // Primero, encontrar las categorías principales (sin parentId)
    const rootCategories = categories.filter((cat) => !cat.parentId);

    // Función recursiva para construir el árbol
    const buildTree = (category: any): TreeNode => {
      const children = categories.filter((cat) => cat.parentId === category.id);

      return {
        key: category.id.toString(),
        label: category.name,
        data: category,
        icon: 'pi pi-fw pi-folder',
        children: children.length > 0 ? children.map(buildTree) : undefined,
      };
    };

    return rootCategories.map(buildTree);
  }

  onCategorySelect(event: any) {
    this.router.navigate(['/categories', event.node.key]);
  }
}
