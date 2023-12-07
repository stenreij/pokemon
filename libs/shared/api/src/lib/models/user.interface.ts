/* eslint-disable @nx/enforce-module-boundaries */
import { Role } from './role.enum';
import { Id } from './id.type';
import { ITeam } from './team.interface';

export interface IUser {
    userId: Id;
    userName: string;
    email: string;
    password: string;
    role: Role;
    birthDate: Date;
    teams: ITeam[];
    token?: string;
}

export type ICreateUser = Pick<
    IUser,
    'userName' | 'email' | 'password' | 'role' | 'birthDate' 
>;
export type IUpdateUser = Partial<Omit<IUser, 'userId'>>;
export type IUpsertUser = IUser;