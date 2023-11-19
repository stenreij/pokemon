import { Id } from './id.type';

type User = string;

export interface ITeam {
    teamId: Id;
    teamName: string;
    rating: number;
    trainer: User;
    teamInfo: string;
}

export type ICreateTeam = Pick<
    ITeam,
    'teamName' | 'trainer' | 'teamInfo'
>;
export type IUpdateTeam = Partial<Omit<ITeam, 'teamId'>>;
export type IUpsertTeam = ITeam;