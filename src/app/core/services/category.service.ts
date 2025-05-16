import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Category } from '../models/category.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private path = '/categories';

  constructor(private apiService: ApiService) {}

  getAll(params?: any): Observable<{ categories: Category[]; total: number }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.apiService.get<{ categories: Category[]; total: number }>(
      this.path,
      httpParams
    );
  }

  getById(id: number): Observable<Category> {
    return this.apiService.get<Category>(`${this.path}/${id}`);
  }

  create(category: Category): Observable<Category> {
    return this.apiService.post<Category>(this.path, category);
  }

  update(id: number, category: Category): Observable<Category> {
    return this.apiService.put<Category>(`${this.path}/${id}`, category);
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.path}/${id}`);
  }

  // Obtener categorías en formato jerárquico
  getHierarchical(): Observable<Category[]> {
    return this.apiService.get<Category[]>(`${this.path}/hierarchical`);
  }
}
