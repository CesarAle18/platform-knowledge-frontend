import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Process } from '../models/process.model';
import { Version } from '../models/version.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private path = '/processes';

  constructor(private apiService: ApiService) {}

  getAll(params?: any): Observable<{ processes: Process[]; total: number }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.apiService.get<{ processes: Process[]; total: number }>(
      this.path,
      httpParams
    );
  }

  getById(id: number): Observable<Process> {
    return this.apiService.get<Process>(`${this.path}/${id}`);
  }

  getBySlug(slug: string): Observable<Process> {
    return this.apiService.get<Process>(`${this.path}/slug/${slug}`);
  }

  create(process: Process): Observable<Process> {
    return this.apiService.post<Process>(this.path, process);
  }

  update(id: number, process: Process): Observable<Process> {
    return this.apiService.put<Process>(`${this.path}/${id}`, process);
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.path}/${id}`);
  }

  // Obtener procesos por categoría
  getByCategory(categoryId: number): Observable<Process[]> {
    return this.apiService.get<Process[]>(
      `${this.path}/category/${categoryId}`
    );
  }

  // Obtener versiones de un proceso
  getVersions(processId: number): Observable<Version[]> {
    return this.apiService.get<Version[]>(`${this.path}/${processId}/versions`);
  }

  // Crear una nueva versión
  createVersion(processId: number, content: string): Observable<Version> {
    return this.apiService.post<Version>(`${this.path}/${processId}/versions`, {
      content,
    });
  }

  // Establecer una versión como actual
  setCurrentVersion(processId: number, versionId: number): Observable<Process> {
    return this.apiService.put<Process>(
      `${this.path}/${processId}/versions/${versionId}/current`
    );
  }

  // Cambiar estado del proceso
  updateStatus(
    processId: number,
    status: 'draft' | 'published' | 'archived'
  ): Observable<Process> {
    return this.apiService.put<Process>(`${this.path}/${processId}/status`, {
      status,
    });
  }

  // Añadir etiquetas a un proceso
  addTags(processId: number, tagIds: number[]): Observable<Process> {
    return this.apiService.post<Process>(`${this.path}/${processId}/tags`, {
      tagIds,
    });
  }

  // Eliminar etiquetas de un proceso
  removeTags(processId: number, tagIds: number[]): Observable<Process> {
    return this.apiService.delete<Process>(
      `${this.path}/${processId}/tags?ids=${tagIds.join(',')}`
    );
  }

  // Buscar procesos
  search(query: string): Observable<Process[]> {
    return this.apiService.get<Process[]>(`${this.path}/search?q=${query}`);
  }
}
