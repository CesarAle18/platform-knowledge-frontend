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
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated) => {
        // Si el usuario está autenticado, permite el acceso
        if (isAuthenticated) {
          return true;
        }

        // Si no está autenticado, redirige al login y guarda la URL a la que intentaba acceder
        return this.router.createUrlTree(['/auth/login'], {
          queryParams: { returnUrl: state.url },
        });
      })
    );
  }
}
