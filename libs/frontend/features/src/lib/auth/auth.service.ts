import { Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from '@pokemon/shared/api';
import { environment } from '@pokemon/shared/util-env';
import { JwtHelperService } from '@auth0/angular-jwt';

export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>(
  'AuthService'
);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<IUser | null>(null);
  private readonly CURRENT_USER = 'currentuser';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private readonly jwtHelper = new JwtHelperService();
  private readonly tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {
    this.getUserFromLocalStorage()
      .pipe(
        switchMap((user: IUser | null) => {
          if (user) {
            console.log('User found in local storage');
            this.currentUser$.next(user);
            return of(user);
          } else {
            console.log(`No current user found`);
            return of(null);
          }
        })
      )
      .subscribe(() => console.log('Startup auth done'));
  }

  login(email: string, password: string): Observable<IUser | null> {
    console.log(`login at ${environment.lclApiUrl}/user/login`);
    return this.http
      .post<{ results: IUser } | null>( 
        `${environment.lclApiUrl}/user/login`,
        { email: email, password: password },
        { headers: this.headers }
      )
      .pipe(
        map((response) => {
          console.log('Raw Backend Response:', response);

          if (
            response &&
            response.results &&
            response.results.token &&
            response.results.userId
          ) {
            console.log('Token:', response.results.token);
            console.log('User:', response.results.userId);

            localStorage.setItem(this.tokenKey, response.results.token);
            this.saveUserToLocalStorage(response.results);
            this.currentUser$.next(response.results);
            return response.results;
          } else {
            console.log('Else statement response structure:', response);
            return null;
          }
        }),
        catchError((error: any) => {
          console.log('error:', error);
          console.log('error.message:', error.message);
          console.log('error.error.message:', error.error.message);
          return of(null);
        })
      );
  }

  validateToken(userData: IUser): Observable<IUser | null> {
    const url = `${environment.lclApiUrl}/auth/profile`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userData.token,
      }),
    };

    console.log(`validateToken at ${url}`);
    return this.http.get<any>(url, httpOptions).pipe(
      map((response) => {
        console.log('token is valid');
        return response as IUser;
      }),
      catchError((error: any) => {
        console.log('Validate token Failed');
        this.currentUser$.next(null);
        return of(null);
      })
    );
  }

  logout(): void {
    console.log(`logout at ${environment.lclApiUrl}/user/logout`);

    this.router
      .navigate(['/login'])
      .then((success) => {
        if (success) {
          console.log('logout - removing local user info');
          localStorage.removeItem(this.CURRENT_USER);
          localStorage.removeItem(this.tokenKey);
          this.currentUser$.next(null);
        } else {
          console.log('navigate result:', success);
        }
      })
      .catch((error) => console.log('not logged out!'));
  }

  getUserFromLocalStorage(): Observable<IUser | null> {
    const itemFromStorage = localStorage.getItem(this.CURRENT_USER);
    if (itemFromStorage === null) {
      return of(null);
    } else {
      const localUser = JSON.parse(itemFromStorage);
      return of(localUser);
    }
  }

  private saveUserToLocalStorage(user: IUser): void {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  userMayEdit(itemUserId: number): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user: IUser | null) => (user ? user.userId === itemUserId : false))
    );
  }

  public isAuthenticated(): boolean {
    const token = this.getAuthToken();
    console.log('isAuthenticated token:', token);
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  private getAuthToken(): string | null {
    console.log('getAuthToken', localStorage.getItem(this.tokenKey));
    return localStorage.getItem(this.tokenKey);
  }
}