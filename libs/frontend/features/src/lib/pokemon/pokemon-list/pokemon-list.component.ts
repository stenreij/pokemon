import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { IPokemon } from '@pokemon/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'


@Component({
    selector: 'pokemon-pokemon-list',
    templateUrl: './pokemon-list.component.html',
    styleUrls: ['./pokemon-list.component.css'],
})

export class PokemonListComponent implements OnInit, OnDestroy {
    pokemon: IPokemon[] | null = null;
    subscription: Subscription | undefined = undefined;

    constructor(private pokemonService: PokemonService, private router: Router) { }

    ngOnInit(): void {
        this.subscription = this.pokemonService.list().subscribe((results) => {
            console.log(`results: ${results}`);
            this.pokemon = results;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}