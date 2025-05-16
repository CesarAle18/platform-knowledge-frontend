import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Tag } from '../models/tag.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private path = '/tags';

  constructor(private apiService: ApiService) {}

  getAll(params?: any): Observable<{ tags: Tag[]; total: number }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.apiService.get<{ tags: Tag[]; total: number }>(
      this.path,
      httpParams
    );
  }

  getById(id: number): Observable<Tag> {
    return this.apiService.get<Tag>(`${this.path}/${id}`);
  }

  create(tag: Tag): Observable<Tag> {
    return this.apiService.post<Tag>(this.path, tag);
  }

  update(id: number, tag: Tag): Observable<Tag> {
    return this.apiService.put<Tag>(`${this.path}/${id}`, tag);
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.path}/${id}`);
  }

  // Obtener tags más utilizados
  getPopular(limit: number = 10): Observable<Tag[]> {
    return this.apiService.get<Tag[]>(`${this.path}/popular?limit=${limit}`);
  }

  // Buscar tags por nombre
  search(query: string): Observable<Tag[]> {
    return this.apiService.get<Tag[]>(`${this.path}/search?q=${query}`);
  }
}
