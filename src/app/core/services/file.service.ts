import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from '../models/file.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient) {}

  getFiles(params?: any): Observable<File[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<File[]>(this.apiUrl, { params: httpParams });
  }

  getFileById(id: number): Observable<File> {
    return this.http.get<File>(`${this.apiUrl}/${id}`);
  }

  uploadFile(file: Blob, metadata: Partial<File>): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    // Añadir metadatos al FormData
    Object.keys(metadata).forEach((key) => {
      if (
        metadata[key as keyof Partial<File>] !== null &&
        metadata[key as keyof Partial<File>] !== undefined
      ) {
        formData.append(key, String(metadata[key as keyof Partial<File>]));
      }
    });

    const req = new HttpRequest('POST', this.apiUrl, formData, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

  updateFile(id: number, metadata: Partial<File>): Observable<File> {
    return this.http.put<File>(`${this.apiUrl}/${id}`, metadata);
  }

  deleteFile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
