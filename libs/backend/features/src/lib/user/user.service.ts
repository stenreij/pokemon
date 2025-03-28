import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from '@pokemon/shared/api';
import { User as UserModel, UserDocument } from './user.schema';
import { CreateUserDto, UpdatePokemonDto, UpdateUserDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { environment } from '@pokemon/shared/util-env';
import { TokenBlacklistService } from './blacklist.service';

@Injectable()
export class UserService {
    TAG = 'UserService';
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(UserModel.name)
        private readonly userModel: Model<UserDocument>,
        private readonly tokenBlackListService: TokenBlacklistService
    ) { }

    async findAll(id: string): Promise<IUser[]> {
        this.logger.log(`findAll()`);
        const userId = parseInt(id, 10);
        const items = await this.userModel.find().exec();
        const user = await this.userModel.findOne({ userId }).lean().exec();

        this.logger.log(`user: ` + user)
        if (user?.role !== 'Admin') {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Bad Request',
                    message: 'You do not have permission to view other users',
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
        return items;
    }

    async findOne(userId: string, id: string): Promise<IUser | null> {
        const userIdNum = parseInt(userId, 10);
        const targetId = typeof id === 'string' ? parseInt(id, 10) : id;
        this.logger.log(`userIdNum: ` + userIdNum)
        this.logger.log(`targetId: ` + targetId)

        const loggedInUser = await this.userModel
            .findOne({ userId: userIdNum })
            .lean()
            .exec();

        this.logger.log(`loggedInUser: ` + loggedInUser)

        const isAdmin = loggedInUser?.role === 'Admin';
        const isSameUser = userIdNum === targetId;
        this.logger.log(`isAdmin: ` + isAdmin)

        const userToFind = await this.userModel.findOne({ userId: id }).lean().exec();
        if (!isAdmin && !isSameUser) {
            this.logger.warn(`Unauthorized access for user: ${userId}`);
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to view a user other than yourself',
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        if (!userToFind) {
            this.logger.warn(`User with id ${id} not found`);
            return null;
        }
        this.logger.log(`Found user with id ${id}`);
        return userToFind as IUser;
    }

    async create(user: CreateUserDto): Promise<IUser> {
        this.logger.log(`create(${user})`);
        const createdItem = this.userModel.create(user);
        return createdItem;
    }

    async update(userId: string, id: number, user: UpdateUserDto): Promise<IUser | null> {
        this.logger.log(`Update user ${user.userName}`);
        const userIdNum = parseInt(userId, 10);
        const targetId = typeof id === 'string' ? parseInt(id, 10) : id;
        const loggedInUser = await this.userModel
            .findOne({ userId: userIdNum })
            .lean()
            .exec();

        const isAdmin = loggedInUser?.role === 'Admin';
        const isSameUser = userIdNum === targetId;
        this.logger.log(`isAdmin: ` + isAdmin)

        if (!isAdmin && !isSameUser) {
            this.logger.warn(`Unauthorized access for user: ${userId}`);
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to edit a user other than yourself',
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        const updatedItem = await this.userModel.findOneAndUpdate({ userId: targetId }, user, {
            new: true,
        }).exec();

        if (!updatedItem) {
            this.logger.warn(`User with id ${targetId} not found`);
            return null;
        }
        return updatedItem;
    }

    async delete(loggedInUserId: string, userIdToDelete: number): Promise<IUser | null> {
        this.logger.log(`delete(${userIdToDelete})`);
    
        const targetId = typeof userIdToDelete === 'string' ? parseInt(userIdToDelete, 10) : userIdToDelete;
        const loggedInUserNum = parseInt(loggedInUserId, 10);
        const loggedInUser = await this.userModel
        .findOne({ userId: loggedInUserNum })
        .lean()
        .exec();
    
        const isAdmin = loggedInUser?.role === 'Admin';
        const isSameUser = loggedInUserNum === targetId;
        this.logger.log(`isAdmin: ` + isAdmin, 
        `isSameUser: ` + isSameUser,
        `targetid: ` + targetId)
    
        if (!isAdmin && !isSameUser) {
            this.logger.warn(`Unauthorized access for user: ${loggedInUserId}`);
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to delete a user other than yourself',
                },
                HttpStatus.UNAUTHORIZED
            );
        }
    
        const deletedItem = await this.userModel.findOneAndDelete({ userId: targetId }).lean().exec();
        if (!deletedItem) {
            this.logger.log(`User #${targetId} not found`);
            return null;
        }
    
        this.logger.log(`Deleted user with id ${targetId}`);
        return deletedItem as IUser;
    }    

    async login(email: string, password: string): Promise<IUser> {
        const user = await this.userModel
            .findOne({ email, password })
            .lean()
            .exec();

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        const token = sign({ userId: user.userId.toString() }, environment.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });

        const response = { ...user, token };
        return response as IUser;
    }

    async logout(userId: string, token: string): Promise<boolean> {
        this.logger.log(`logout called for user id: ${userId}`);
        try {
            const user = await this.userModel.findOne({ userId }).lean().exec();
            this.logger.log('USER:  ' + user);
            if (!user) {
                this.logger.warn(`User with id ${userId} not found for logout`);
                return false;
            }

            this.tokenBlackListService.add(token);

            this.logger.log(`Token invalidated for user id: ${userId}`);
            this.logger.log(`Successful logout for user id: ${userId}`);
            return true;
        } catch (error) {
            this.logger.error(`Error during logout for user id: ${userId}, (error as Error).stack`);
            throw new Error('Logout failed');
        }
    }
}