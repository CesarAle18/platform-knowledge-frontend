import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Glossary } from '../models/glossary.model';
import { Version } from '../models/version.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlossaryService {
  private path = '/glossary';

  constructor(private apiService: ApiService) {}

  getAll(params?: any): Observable<{ terms: Glossary[]; total: number }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.apiService.get<{ terms: Glossary[]; total: number }>(
      this.path,
      httpParams
    );
  }

  getById(id: number): Observable<Glossary> {
    return this.apiService.get<Glossary>(`${this.path}/${id}`);
  }

  getBySlug(slug: string): Observable<Glossary> {
    return this.apiService.get<Glossary>(`${this.path}/slug/${slug}`);
  }

  create(term: Glossary): Observable<Glossary> {
    return this.apiService.post<Glossary>(this.path, term);
  }

  update(id: number, term: Glossary): Observable<Glossary> {
    return this.apiService.put<Glossary>(`${this.path}/${id}`, term);
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.path}/${id}`);
  }

  // Obtener términos por categoría
  getByCategory(categoryId: number): Observable<Glossary[]> {
    return this.apiService.get<Glossary[]>(
      `${this.path}/category/${categoryId}`
    );
  }

  // Obtener versiones de un término
  getVersions(termId: number): Observable<Version[]> {
    return this.apiService.get<Version[]>(`${this.path}/${termId}/versions`);
  }

  // Crear una nueva versión
  createVersion(termId: number, definition: string): Observable<Version> {
    return this.apiService.post<Version>(`${this.path}/${termId}/versions`, {
      definition,
    });
  }

  // Establecer una versión como actual
  setCurrentVersion(termId: number, versionId: number): Observable<Glossary> {
    return this.apiService.put<Glossary>(
      `${this.path}/${termId}/versions/${versionId}/current`
    );
  }

  // Buscar términos en el glosario
  search(query: string): Observable<Glossary[]> {
    return this.apiService.get<Glossary[]>(`${this.path}/search?q=${query}`);
  }

  // Obtener términos en orden alfabético
  getAlphabetical(): Observable<{ [key: string]: Glossary[] }> {
    return this.apiService.get<{ [key: string]: Glossary[] }>(
      `${this.path}/alphabetical`
    );
  }
}
