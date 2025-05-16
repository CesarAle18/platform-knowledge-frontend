import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Obtenemos el token actual
    const token = this.authService.getToken();

    // Si hay un token disponible, lo añadimos a la cabecera Authorization
    if (token) {
      request = this.addToken(request, token);
    }

    // Enviamos la petición y manejamos posibles errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Si recibimos un error 401 (Unauthorized), significa que el token ha expirado o es inválido
          return this.handle401Error(request, next);
        } else if (error.status === 403) {
          // Si recibimos un error 403 (Forbidden), significa que el usuario no tiene permisos
          console.error(
            'Acceso denegado. No tienes permisos para realizar esta acción.'
          );
          // Podríamos redirigir a una página de "Acceso denegado" o mostrar un mensaje
        }

        // Cualquier otro error lo propagamos
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Si no estamos ya intentando refrescar el token
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // En un caso real, aquí intentaríamos refrescar el token automáticamente
      // Para este ejemplo, simplemente cerramos la sesión y redirigimos al login

      return this.authService.refreshToken().pipe(
        switchMap((token: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          // Una vez refrescado el token, reintentamos la solicitud original
          return next.handle(this.addToken(request, token));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          // Si no podemos refrescar el token, cerramos la sesión
          this.authService.logout();
          return throwError(() => err);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      // Si ya estamos refrescando el token, esperamos hasta que termine
      // y luego reintentamos la solicitud con el nuevo token
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }
}
