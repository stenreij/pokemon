import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { IUser } from '@pokemon/shared/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class LoggedInAuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    console.log('canActivate LoggedIn');
    return this.authService.currentUser$.pipe(
      map((user: IUser | null) => {
        if (user && user.token) {
          return true;
        } else {
          console.log('not logged in, reroute to /login');
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('canActivateChild LoggedIn');
    return this.canActivate();
  }
}
