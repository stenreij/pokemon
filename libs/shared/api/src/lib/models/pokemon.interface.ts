import { Type } from './type.enum';
import { Id } from './id.type';
import { IPowermove } from './powermove.interface';

export interface IPokemon {
    pokemonId: Id;
    name: string;
    type1: Type;
    type2: Type;
    rating: number;
    legendary: boolean;
    afbeelding: string;
    creator: string;
    powermove: IPowermove;
}

export type ICreatePokemon = Pick<
    IPokemon,
    'name' | 'type1' | 'type2' | 'rating' | 'legendary' | 'afbeelding' | 'creator' | 'powermove'
>;
export type IUpdatePokemon = Partial<Omit<IPokemon, 'pokemonId'>>;
export type IUpsertPokemon = IPokemon;