import { Id } from './id.type';

type User = string;

export interface ITeam {
    teamId: Id;
    teamName: string;
    rating: number;
    trainer: User;
}

export type ICreateTeam = Pick<
    ITeam,
    'teamName' | 'rating' | 'trainer'
>;
export type IUpdateTeam = Partial<Omit<ITeam, 'teamId'>>;
export type IUpsertTeam = ITeam;