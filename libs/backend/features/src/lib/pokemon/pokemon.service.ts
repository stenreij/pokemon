import { Injectable, NotFoundException } from '@nestjs/common';
import { IPokemon } from '@pokemon/shared/api';
import { BehaviorSubject } from 'rxjs';
import { CreatePokemonDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class PokemonService {
    TAG = 'PokemonService';

    private pokemon$ = new BehaviorSubject<IPokemon[]>([
        {
            pokemonId: 1,
            name: 'Bulbasaur',
            type1: 'Grass',
            type2: 'Normal',
            rating: 100,
            legendary: false,
        },
        {
            pokemonId: 2,
            name: 'Ivysaur',
            type1: 'Grass',
            type2: 'Normal',
            rating: 200,
            legendary: false,
        },
        {
            pokemonId: 3,
            name: 'Venusaur',
            type1: 'Grass',
            type2: 'Normal',
            rating: 300,
            legendary: false,
        },
        {
            pokemonId: 4,
            name: 'Charmander',
            type1: 'Fire',
            type2: 'Normal',
            rating: 200,
            legendary: false,
        },
        {
            pokemonId: 5,
            name: 'Charmeleon',
            type1: 'Fire',
            type2: 'Normal',
            rating: 300,
            legendary: false,
        },
        {
            pokemonId: 6,
            name: 'Charizard',
            type1: 'Fire',
            type2: 'Normal',
            rating: 400,
            legendary: false,
        },
        {
            pokemonId: 700,
            name: 'Mewtwo',
            type1: 'Psychic',
            type2: 'Normal',
            rating: 2200,
            legendary: true,
        },
    ]);

    getAll(): IPokemon[] {
        Logger.log('getAll', this.TAG);
        return this.pokemon$.value.sort((a, b) => a.pokemonId - b.pokemonId);
    }

    getOne(id: number): IPokemon {
        Logger.log(`getOne(${id})`, this.TAG);
        const pokemon = this.pokemon$.value.find((pokemon) => pokemon.pokemonId === +id);
        Logger.log(`Pokemon => ${JSON.stringify(pokemon)}`, this.TAG);

        if (!pokemon) {
            throw new NotFoundException(`Pokemon could not be found!`);
        }
        return pokemon;
    }

    create(pokemon: Pick<IPokemon, 'name' | "type1" | "type2" | 'rating' | 'legendary' >): IPokemon {
        Logger.log('create', this.TAG);
        const current = this.pokemon$.value;

        const newPokemon: IPokemon = {
            pokemonId: Math.floor(Math.random() * 1000),
            ...pokemon,
        };
        this.pokemon$.next([...current, newPokemon]);
        return newPokemon;
    }
}
