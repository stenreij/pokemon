import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, ITeam } from '@pokemon/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '@pokemon/shared/util-env';

export const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

@Injectable()
export class TeamService {
    endpoint = environment.lclApiUrl + '/team';
  teams: ITeam[] | null = null;

    constructor(private readonly http: HttpClient) { }

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

    public delete(teamId: number): Observable<any> {
        const url = `${this.endpoint}/${teamId}`;

        return this.http
            .delete<ApiResponse<any>>(url)
            .pipe(catchError(this.handleError));
    }

    public addTeam(team: ITeam): Observable<ITeam> {
        console.log(`addTeam ${this.endpoint}`, team);
        const url = `${this.endpoint}`;
        return this.http
            .post<ApiResponse<ITeam>>(url, team, httpOptions)
            .pipe(
                tap(console.log),
                map((response: any) => response.results as ITeam),
                catchError(this.handleError)
            );
    }

    public editTeam(team: ITeam): Observable<ITeam> {
        console.log(`editTeam ${this.endpoint}`, team);
        const url = `${this.endpoint}/${team.teamId}`;
        return this.http
            .put<ApiResponse<ITeam>>(url, team, httpOptions)
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

    public showPopup = false;

    openPopup(){
        this.showPopup = true;
    }

    closePopup(){
        this.showPopup = false;
    }
}
