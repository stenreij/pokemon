import { Role } from './role.enum';
import { Id } from './id.type';
import { ITeam } from './team.interface';
import { IEntity } from '@pokemon/frontend/common';
import { IUserRegistration } from './auth.interface';

export interface IUser {
    userId: Id;
    userName: string;
    email: string;
    password: string;
    role: Role;
    birthDate: Date;
    teams: ITeam[];
}

export interface IUserIdentity extends IEntity {
    userName: string;
    email: string;
    role: Role;
    token?: string;
}

export interface IUserInfo extends IUserRegistration {
    userId: Id;
    role: Role;
}

export interface IUser extends IUserInfo {
    teams: ITeam[];
}

export type ICreateUser = Pick<
    IUser,
    'userName' | 'email' | 'password' | 'role' | 'birthDate' 
>;
export type IUpdateUser = Partial<Omit<IUser, 'userId'>>;
export type IUpsertUser = IUser;