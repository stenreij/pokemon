import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IUser } from '@pokemon/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '@pokemon/shared/util-env';

export const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
};

@Injectable()
export class UserService {
    endpoint = environment.onlineApiUrl + '/user';
    user: IUser[] | null = null;

    constructor(private readonly http: HttpClient) { }

    public list(options?: any): Observable<IUser[] | null> {
        console.log(`list ${this.endpoint}`);
    
        return this.http
            .get<ApiResponse<IUser[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IUser[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public read(id: string | null, options?: any): Observable<IUser> {
        console.log(`read ${this.endpoint}/${id}`);
        return this.http
            .get<ApiResponse<IUser>>(`${this.endpoint}/${id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IUser),
                catchError(this.handleError)
            );
    }

    public delete(userId: number): Observable<any> {
        const url = `${this.endpoint}/${userId}`;

        return this.http
            .delete<ApiResponse<any>>(url)
            .pipe(catchError(this.handleError));
    }

    public register(user: IUser): Observable<IUser> {
        console.log(`addUser ${this.endpoint}`, user);
        const url = `${this.endpoint}`;
        return this.http
            .post<ApiResponse<IUser>>(url, user, httpOptions)
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IUser),
                catchError(this.handleError)
            );
    }

    public login(user: IUser): Observable<IUser> {
        console.log(`login ${this.endpoint}`, user);
        const url = `${this.endpoint}/login`;
    
        return this.http
            .post<ApiResponse<IUser>>(url, user, httpOptions)
            .pipe(
                tap(console.log),
                map((response: any) => {
                    const loggedInUser = response.results as IUser;
                    localStorage.setItem('token', loggedInUser.token? loggedInUser.token : '');
                    return loggedInUser;
                }),
                catchError(this.handleError)
            );
    }

    public editUser(user: IUser): Observable<IUser> {
        console.log(`editUser ${this.endpoint}`, user);
        const url = `${this.endpoint}/${user.userId}`;
        return this.http
            .put<ApiResponse<IUser>>(url, user, httpOptions)
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IUser),
                catchError(this.handleError)
            );
    }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in UserService', error);

        return throwError(() => new Error(error.message));
    }
}
