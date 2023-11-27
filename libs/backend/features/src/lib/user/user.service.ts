import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from '@pokemon/shared/api';
import { BehaviorSubject } from 'rxjs';
import { CreateUserDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { Role } from 'libs/shared/api/src/lib/models/role.enum';

@Injectable()
export class UserService {
    TAG = 'UserService';

    private user$ = new BehaviorSubject<IUser[]>([
        {
            userId: 1,
            userName: 'Admin',
            password: 'Admin',
            email: 'admin@admin.com',
            role: Role.Admin,
            birthDate: new Date('1990-01-01'),
        },
        {
            userId: 2,
            userName: 'Ash',
            password: 'Ash',
            email: 'ash@ash.com',
            role: Role.Trainer,
            birthDate: new Date('1990-01-01'),
        },
        {
            userId: 3,
            userName: 'Jessie',
            password: 'Jessie',
            email: 'jessie@jessie.com',
            role: Role.Trainer,
            birthDate: new Date('1990-01-01'),
        },
        {
            userId: 4,
            userName: 'prof. Oak',
            password: 'Admin',
            email: 'oak@oak.com',
            role: Role.Admin,
            birthDate: new Date('1960-01-01'),
        },
        {
            userId: 5,
            userName: 'Misty',
            password: 'Misty',
            email: 'misty@misty.com',
            role: Role.Trainer,
            birthDate: new Date('1990-01-01'),
        },
    ]);

  
    getAll(): IUser[] {
        Logger.log('getAll', this.TAG);
        return this.user$.value.sort((a, b) => a.userId - b.userId);
    }

    getOne(id: number): IUser {
        Logger.log(`getOne(${id})`, this.TAG);
        const user = this.user$.value.find((user) => user.userId === +id);
        Logger.log(`User => ${JSON.stringify(user)}`, this.TAG);

        if (!user) {
            throw new NotFoundException(`User could not be found!`);
        }
        return user;
    }

    create(user: Pick<IUser, 'userName' | 'email' | 'birthDate' | 'password' | 'role'>): IUser {
        Logger.log('create', this.TAG);
        const current = this.user$.value;
    
        const newUser: IUser = {
            userId: Math.floor(Math.random() * 1000),
            ...user,
        };
    
        this.user$.next([...current, newUser]);
        return newUser;
    }

    update(id: number, user: Pick<IUser, 'userName' | 'email' | 'birthDate' | 'password' | 'role'>): IUser {
        Logger.log('update', this.TAG);
        const current = this.user$.value;
        const userToUpdate = this.getOne(id);
        const updatedUser: IUser = {
            ...userToUpdate,
            ...user,
        };
        this.user$.next([
            ...current.filter((user) => user.userId !== userToUpdate.userId),
            updatedUser,
        ]);
        return updatedUser;
    }

    delete(id: number): IUser {
        Logger.log('delete', this.TAG);
        const current = this.user$.value;
        const userToDelete = this.getOne(id);
        this.user$.next([
            ...current.filter((user) => user.userId !== userToDelete.userId),
        ]);
        return userToDelete;
    }
}
