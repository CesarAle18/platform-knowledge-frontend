import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.currentUser$.pipe(
      take(1),
      map((user) => {
        // Permite acceso solo a usuarios con rol 'admin'
        if (user && user.role === 'admin') {
          return true;
        }

        // Si el usuario no tiene rol de administrador pero está autenticado,
        // redirige al dashboard con mensaje de acceso denegado
        if (user) {
          // Podríamos almacenar un mensaje de error en un servicio
          // para mostrarlo en el dashboard
          return this.router.createUrlTree(['/dashboard'], {
            queryParams: { adminAccessDenied: true },
          });
        }

        // Si no está autenticado, redirige al login
        return this.router.createUrlTree(['/auth/login'], {
          queryParams: { returnUrl: state.url },
        });
      })
    );
  }
}
