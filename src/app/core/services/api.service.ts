import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private formatErrors(error: any) {
    return throwError(() => error.error);
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put<T>(path: string, body: Object = {}): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}${path}`, JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(catchError(this.formatErrors));
  }

  post<T>(path: string, body: Object = {}): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}${path}`, JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(catchError(this.formatErrors));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<T>(`${this.apiUrl}${path}`)
      .pipe(catchError(this.formatErrors));
  }

  // Método para subir archivos
  uploadFile(path: string, formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}${path}`, formData)
      .pipe(catchError(this.formatErrors));
  }
}
