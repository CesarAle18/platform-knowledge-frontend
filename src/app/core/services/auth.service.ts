import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private _currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUserSubject.asObservable();
  isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  // Nuevo método getUsers
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError((error) => {
        console.error('Error al obtener los usuarios:', error);
        return throwError(() => new Error('Error al cargar los usuarios'));
      })
    );
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.validateToken(token).subscribe((user: User | null) => {
        if (user) {
          this._currentUserSubject.next(user);
        } else {
          this.logout();
        }
      });
    }
  }

  private validateToken(token: string): Observable<User | null> {
    return this.http
      .get<User>(`${this.apiUrl}/validate-token`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(catchError(() => of(null)));
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<{ user: User; token: string }>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token);
          this._currentUserSubject.next(response.user);
        }),
        map((response) => response.user)
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  refreshToken(): Observable<string> {
    const currentToken = this.getToken();
    if (!currentToken) {
      return throwError(() => new Error('No hay token para refrescar'));
    }
    return this.http
      .post<{ token: string }>(
        `${this.apiUrl}/refresh-token`,
        {},
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        }
      )
      .pipe(
        map((response) => {
          const newToken = response.token;
          localStorage.setItem(this.tokenKey, newToken);
          return newToken;
        })
      );
  }

  hasRole(role: 'admin' | 'editor' | 'viewer'): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => !!user && user.role === role));
  }

  isAdmin(): Observable<boolean> {
    return this.hasRole('admin');
  }

  isEditor(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => !!user && (user.role === 'editor' || user.role === 'admin'))
    );
  }
}
