import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IPowermove } from '@pokemon/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '@pokemon/shared/util-env';

export const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
};

@Injectable()
export class PowermoveService {
    endpoint = environment.onlineApiUrl + '/powermove';
    powermoves: IPowermove[] | null = null;

    constructor(private readonly http: HttpClient) { }

    public list(options?: any): Observable<IPowermove[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IPowermove[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IPowermove[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public read(id: string | null, options?: any): Observable<IPowermove> {
        console.log(`read ${this.endpoint}/${id}`);
        return this.http
            .get<ApiResponse<IPowermove>>(`${this.endpoint}/${id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IPowermove),
                catchError(this.handleError)
            );
    }

    public delete(powermoveId: number): Observable<any> {
        const url = `${this.endpoint}/${powermoveId}`;

        return this.http
            .delete<ApiResponse<any>>(url)
            .pipe(catchError(this.handleError));
    }

    public addPowermove(powermove: IPowermove): Observable<IPowermove> {
        console.log(`addPowermove ${this.endpoint}`, powermove);
        const url = `${this.endpoint}`;
        return this.http
            .post<ApiResponse<IPowermove>>(url, powermove, httpOptions)
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IPowermove),
                catchError(this.handleError)
            );
    }

    public editPowermove(powermove: IPowermove): Observable<IPowermove> {
        console.log(`editPowermove ${this.endpoint}`, powermove);
        const url = `${this.endpoint}/${powermove.powermoveId}`;
        return this.http
            .put<ApiResponse<IPowermove>>(url, powermove, httpOptions)
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IPowermove),
                catchError(this.handleError)
            );
    }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in PowermoveService', error);

        return throwError(() => new Error(error.message));
    }
}
