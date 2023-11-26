import { Injectable, NotFoundException } from '@nestjs/common';
import { IPokemon } from '@pokemon/shared/api';
import { BehaviorSubject } from 'rxjs';
import { CreatePokemonDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { Type } from 'libs/shared/api/src/lib/models/type.enum';

@Injectable()
export class PokemonService {
    TAG = 'PokemonService';

    private pokemon$ = new BehaviorSubject<IPokemon[]>([
        {
            pokemonId: 1,
            name: 'Bulbasaur',
            type1: Type.Grass,
            type2: Type.Poison,
            rating: 100,
            legendary: false,
            afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
        },
        {
            pokemonId: 2,
            name: 'Ivysaur',
            type1: Type.Grass,
            type2: Type.Poison,
            rating: 200,
            legendary: false,
            afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/002.png',
        },
        {
            pokemonId: 3,
            name: 'Venusaur',
            type1: Type.Grass,
            type2: Type.Poison,
            rating: 300,
            legendary: false,
            afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png',
        },
        {
            pokemonId: 4,
            name: 'Charmander',
            type1: Type.Fire,
            type2: Type.Normal,
            rating: 200,
            legendary: false,
            afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png',
        },
        {
            pokemonId: 5,
            name: 'Charmeleon',
            type1: Type.Fire,
            type2: Type.Normal,
            rating: 300,
            legendary: false,
            afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/005.png',
        },
        {
            pokemonId: 6,
            name: 'Charizard',
            type1: Type.Fire,
            type2: Type.Flying,
            rating: 400,
            legendary: false,
            afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png',
        },
        {
            pokemonId: 7,
            name: 'Squirtle',
            type1: Type.Water,
            type2: Type.Normal,
            rating: 175,
            legendary: false,
            afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png',
        },
        {
            pokemonId: 8,
            name: 'Wartortle',
            type1: Type.Water,
            type2: Type.Normal,
            rating: 275,
            legendary: false,
            afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/008.png',
        },
        {
            pokemonId: 9,
            name: 'Blastoise',
            type1: Type.Water,
            type2: Type.Normal,
            rating: 420,
            legendary: false,
            afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png',
        },
        {
            pokemonId: 700,
            name: 'Mewtwo',
            type1: Type.Psychic,
            type2: Type.Normal,
            rating: 2200,
            legendary: true,
            afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png',
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

    create(pokemon: Pick<IPokemon, 'name' | "type1" | "type2" | 'rating' | 'legendary' | 'afbeelding' >): IPokemon {
        Logger.log('create', this.TAG);
        const current = this.pokemon$.value;

        const newPokemon: IPokemon = {
            pokemonId: Math.floor(Math.random() * 1000),
            ...pokemon,
        };
        this.pokemon$.next([...current, newPokemon]);
        return newPokemon;
    }

    update(id: number, pokemon: Pick<IPokemon, 'name' | "type1" | "type2" | "type2" | "rating" | "legendary" | "afbeelding">): IPokemon {
        Logger.log('update', this.TAG);
        const current = this.pokemon$.value;
        const pokemonToUpdate = this.getOne(id);
        const updatedPokemon: IPokemon = {
            ...pokemonToUpdate,
            ...pokemon,
        };
        this.pokemon$.next([
            ...current.filter((pokemon) => pokemon.pokemonId !== pokemonToUpdate.pokemonId),
            updatedPokemon,
        ]);
        return updatedPokemon;
    }

    delete(id: number): IPokemon {
        Logger.log('delete', this.TAG);
        const current = this.pokemon$.value;
        const pokemonToDelete = this.getOne(id);
        this.pokemon$.next([
            ...current.filter((pokemon) => pokemon.pokemonId !== pokemonToDelete.pokemonId),
        ]);
        return pokemonToDelete;
    }
}
