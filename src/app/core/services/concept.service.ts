import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Concept } from '../models/concept.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConceptService {
  private path = '/concepts';

  constructor(private apiService: ApiService) {}

  getAll(params?: any): Observable<{ concepts: Concept[]; total: number }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.apiService.get<{ concepts: Concept[]; total: number }>(
      this.path,
      httpParams
    );
  }

  getById(id: number): Observable<Concept> {
    return this.apiService.get<Concept>(`${this.path}/${id}`);
  }

  getBySlug(slug: string): Observable<Concept> {
    return this.apiService.get<Concept>(`${this.path}/slug/${slug}`);
  }

  create(concept: Concept): Observable<Concept> {
    return this.apiService.post<Concept>(this.path, concept);
  }

  update(id: number, concept: Concept): Observable<Concept> {
    return this.apiService.put<Concept>(`${this.path}/${id}`, concept);
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.path}/${id}`);
  }

  // Obtener conceptos filtrados por cliente
  getByClient(clientId: number): Observable<Concept[]> {
    return this.apiService.get<Concept[]>(`${this.path}/client/${clientId}`);
  }

  // Obtener conceptos filtrados por zona
  getByZone(zoneId: number): Observable<Concept[]> {
    return this.apiService.get<Concept[]>(`${this.path}/zone/${zoneId}`);
  }

  // Añadir etiquetas a un concepto
  addTags(conceptId: number, tagIds: number[]): Observable<Concept> {
    return this.apiService.post<Concept>(`${this.path}/${conceptId}/tags`, {
      tagIds,
    });
  }

  // Eliminar etiquetas de un concepto
  removeTags(conceptId: number, tagIds: number[]): Observable<Concept> {
    return this.apiService.delete<Concept>(
      `${this.path}/${conceptId}/tags?ids=${tagIds.join(',')}`
    );
  }

  // Buscar conceptos
  search(query: string): Observable<Concept[]> {
    return this.apiService.get<Concept[]>(`${this.path}/search?q=${query}`);
  }
}
