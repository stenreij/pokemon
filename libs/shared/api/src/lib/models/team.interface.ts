import { Id } from './id.type';
import { IPokemon } from './pokemon.interface';

export interface ITeam {
    teamId: Id;
    teamName: string;
    rating: number;
    trainer: number;
    teamInfo: string;
    pokemon: Array<IPokemon>;
}

export type ICreateTeam = Pick<
    ITeam,
    'teamName' | 'teamInfo' | 'pokemon'
>;
export type IUpdateTeam = Partial<Omit<ITeam, 'teamId'>>;
export type IUpsertTeam = ITeam;