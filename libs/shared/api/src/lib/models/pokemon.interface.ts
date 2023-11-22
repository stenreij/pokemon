import { Id } from './id.type';

export interface IPokemon {
    pokemonId: Id;
    name: string;
    type1: string;
    type2: string;
    rating: number;
    legendary: boolean;
}

export type ICreatePokemon = Pick<
    IPokemon,
    'name' | 'type1' | 'type2' | 'rating' | 'legendary'
>;
export type IUpdatePokemon = Partial<Omit<IPokemon, 'pokemonId'>>;
export type IUpsertPokemon = IPokemon;