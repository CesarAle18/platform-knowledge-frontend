import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CalendarEvent } from '../models/calendar-event.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private path = '/calendar';

  constructor(private apiService: ApiService) { }

  getAll(params?: any): Observable<{ events: CalendarEvent[], total: number }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.apiService.get<{ events: CalendarEvent[], total: number }>(this.path, httpParams);
  }

  getById(id: number): Observable<CalendarEvent> {
    return this.apiService.get<CalendarEvent>(`${this.path}/${id}`);
  }

  create(event: CalendarEvent): Observable<CalendarEvent> {
    return this.apiService.post<CalendarEvent>(this.path, event);
  }

  update(id: number, event: CalendarEvent): Observable<CalendarEvent> {
    return this.apiService.put<CalendarEvent>(`${this.path}/${id}`, event);
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.path}/${id}`);
  }

  // Obtener eventos por rango de fechas
  getByDateRange(startDate: Date, endDate: Date): Observable<CalendarEvent[]> {
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    return this.apiService.get<CalendarEvent[]>(`${this.path}/range?start=${start}&end=${end}`);
  }

  // Obtener eventos del usuario actual
  getMyEvents(): Observable<CalendarEvent[]> {
    return this.apiService.get<CalendarEvent[]>(`${this.path}/my-events`);
  }

  // Obtener eventos relacionados con un elemento específico (proceso, concepto, etc.)
  getRelatedEvents(type: 'process' | 'concept' | 'file', id: number): Observable<CalendarEvent[]> {
    return this.apiService.get<CalendarEvent[]>(`${this.path}/related/${type}/${id}`);
  }
}   