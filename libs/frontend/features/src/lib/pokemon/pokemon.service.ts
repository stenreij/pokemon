import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IPokemon } from '@pokemon/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '@pokemon/shared/util-env';


export const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

@Injectable()
export class PokemonService {
    endpoint = environment.onlineApiUrl + '/pokemon';

    constructor(private readonly http: HttpClient) { }

    public list(options?: any): Observable<IPokemon[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IPokemon[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IPokemon[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public read(id: string | null, options?: any): Observable<IPokemon> {
        console.log(`read ${this.endpoint}/${id}`);
        return this.http
            .get<ApiResponse<IPokemon>>(`${this.endpoint}/${id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IPokemon),
                catchError(this.handleError)
            );
    }

    public addPokemon(pokemon: IPokemon): Observable<IPokemon> {
        console.log(`addTeam ${this.endpoint}`, pokemon);
        const url = `${this.endpoint}`;
        return this.http
            .post<ApiResponse<IPokemon>>(url, pokemon, httpOptions)
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IPokemon),
                catchError(this.handleError)
            );
    }

    public editPokemon(pokemon: IPokemon): Observable<IPokemon> {
        console.log(`editPokemon ${this.endpoint}`, pokemon);
        const url = `${this.endpoint}/${pokemon.pokemonId}`;
        return this.http
            .put<ApiResponse<IPokemon>>(url, pokemon, httpOptions)
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IPokemon),
                catchError(this.handleError)
            );
    }

    public delete(pokemonId: number): Observable<any> {
        const url = `${this.endpoint}/${pokemonId}`;

        return this.http
            .delete<ApiResponse<any>>(url)
            .pipe(catchError(this.handleError));
    }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in PokemonService', error);

        return throwError(() => new Error(error.message));
    }
}
