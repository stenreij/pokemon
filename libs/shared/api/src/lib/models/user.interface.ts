import { Role } from './role.enum';
import { Id } from './id.type';

export interface IUser {
    userId: Id;
    userName: string;
    email: string;
    password: string;
    role: Role;
    birthDate: Date;
}

export type ICreateUser = Pick<
    IUser,
    'userName' | 'email' | 'password' | 'role' | 'birthDate' 
>;
export type IUpdateUser = Partial<Omit<IUser, 'userId'>>;
export type IUpsertUser = IUser;