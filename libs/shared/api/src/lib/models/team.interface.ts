import { Id } from './id.type';

type User = string;

export interface ITeam {
    teamId: Id;
    teamName: string;
    rating: number;
    trainer: User;
    teamInfo: string;
    pokemon: Array<number>;
}

export type ICreateTeam = Pick<
    ITeam,
    'teamName' | 'trainer' | 'teamInfo' | 'pokemon'
>;
export type IUpdateTeam = Partial<Omit<ITeam, 'teamId'>>;
export type IUpsertTeam = ITeam;