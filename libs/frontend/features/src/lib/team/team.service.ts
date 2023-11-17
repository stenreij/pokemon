import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, ITeam } from '@pokemon/shared/api';
import { Injectable } from '@angular/core';
import { environment } from 'libs/shared/util-env/src';


export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

@Injectable()
export class TeamService {
    endpoint = environment.lclApiUrl + '/team';

    constructor(private readonly http: HttpClient) {}

    public list(options?: any): Observable<ITeam[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<ITeam[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as ITeam[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public read(id: string | null, options?: any): Observable<ITeam> {
        console.log(`read ${this.endpoint}/${id}`);
        return this.http
            .get<ApiResponse<ITeam>>(`${this.endpoint}/${id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as ITeam),
                catchError(this.handleError)
            );
    }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in TeamService', error);

        return throwError(() => new Error(error.message));
    }
}
