import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService, TreeNode } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TreeModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    CardModule,
    ToolbarModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss'],
})
export class CategoryManagerComponent implements OnInit {
  categories: Category[] = [];
  categoryTree: TreeNode[] = [];
  selectedCategory: Category | null = null;
  parentCategories: Category[] = [];
  selectedParent: Category | null = null;

  displayCategoryDialog: boolean = false;
  isNewCategory: boolean = false;

  loading: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.buildCategoryTree();
        this.parentCategories = this.categories.filter((c) => !c.parentId);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar las categorías',
        });
        this.loading = false;
      },
    });
  }

  buildCategoryTree() {
    // First, get all root categories (those without parentId)
    const rootCategories = this.categories.filter((c) => !c.parentId);

    // Transform them to TreeNodes
    this.categoryTree = rootCategories.map((category) =>
      this.mapCategoryToTreeNode(category)
    );
  }

  mapCategoryToTreeNode(category: Category): TreeNode {
    // Find all children for this category
    const children = this.categories.filter((c) => c.parentId === category.id);

    // Create TreeNode
    const node: TreeNode = {
      key: category.id.toString(),
      label: category.name,
      data: category,
      expandedIcon: 'pi pi-folder-open',
      collapsedIcon: 'pi pi-folder',
      children: children.map((child) => this.mapCategoryToTreeNode(child)),
    };

    return node;
  }

  openNewCategoryDialog() {
    this.selectedCategory = {
      name: '',
      slug: '',
    };
    this.selectedParent = null;
    this.isNewCategory = true;
    this.displayCategoryDialog = true;
  }

  editCategory(node: TreeNode) {
    this.selectedCategory = { ...node.data };
    this.selectedParent = this.selectedCategory.parentId
      ? this.categories.find((c) => c.id === this.selectedCategory.parentId) ||
        null
      : null;
    this.isNewCategory = false;
    this.displayCategoryDialog = true;
  }

  confirmDeleteCategory(node: TreeNode) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar la categoría "${node.label}"? Esta acción no se puede deshacer.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCategory(node.data.id);
      },
    });
  }

  deleteCategory(categoryId: number) {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoría eliminada correctamente',
        });
        this.loadCategories();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la categoría',
        });
      },
    });
  }

  saveCategory() {
    if (!this.selectedCategory) return;

    // Set parentId if a parent is selected
    this.selectedCategory.parentId = this.selectedParent
      ? this.selectedParent.id
      : null;

    // Generate slug if not provided
    if (!this.selectedCategory.slug) {
      this.selectedCategory.slug = this.slugify(this.selectedCategory.name);
    }

    const operation = this.isNewCategory
      ? this.categoryService.createCategory(this.selectedCategory)
      : this.categoryService.updateCategory(this.selectedCategory);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Categoría ${
            this.isNewCategory ? 'creada' : 'actualizada'
          } correctamente`,
        });
        this.closeCategoryDialog();
        this.loadCategories();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo ${
            this.isNewCategory ? 'crear' : 'actualizar'
          } la categoría`,
        });
      },
    });
  }

  closeCategoryDialog() {
    this.displayCategoryDialog = false;
    this.selectedCategory = null;
    this.selectedParent = null;
  }

  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  // Método para evitar la selección de la categoría actual como padre
  // para prevenir ciclos en la jerarquía
  filterParentOptions() {
    if (!this.selectedCategory || !this.selectedCategory.id) {
      return this.categories.filter((c) => !c.parentId);
    }

    // Excluir la categoría actual y sus descendientes
    return this.categories.filter((c) => {
      // No es la categoría actual
      if (c.id === this.selectedCategory.id) return false;

      // No es un descendiente de la categoría actual
      let parent = c;
      while (parent.parentId) {
        if (parent.parentId === this.selectedCategory.id) return false;
        parent = this.categories.find((p) => p.id === parent.parentId);
        if (!parent) break;
      }

      return true;
    });
  }
}
