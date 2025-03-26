import { Injectable, NotFoundException } from '@nestjs/common';
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

    async findAll(): Promise<IUser[]> {
        this.logger.log(`findAll()`);
        const items = await this.userModel.find().exec();
        return items;
    }

    async findOne(userId: number): Promise<IUser | null> {
        this.logger.log(`findOne(${userId})`);
        const item = await this.userModel.findOne({ userId }).lean().exec();
        if (!item) {
            this.logger.log(`findOne(${userId}) not found`);
        }
        return item as IUser;
    }

    async findOneByEmail(email: string): Promise<IUser | null> {
        this.logger.log(`findOneByEmail(${email})`);
        const item = this.userModel
            .findOne({ email })
            .select('-password')
            .exec();
        if (!item) {
            this.logger.log(`findOneByEmail(${email}) not found`);
        }
        return item;
    }

    async create(user: CreateUserDto): Promise<IUser> {
        this.logger.log(`create(${user})`);
        const createdItem = this.userModel.create(user);
        return createdItem;
    }

    async update(userId: number, user: UpdateUserDto): Promise<IUser | null> {
        this.logger.log(`Update user ${user.userName}`);
        const updatedItem = await this.userModel.findOneAndUpdate({ userId }, user, {
            new: true,
        }).exec();
        return updatedItem;
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

    async delete(userId: number): Promise<IUser | null> {
        this.logger.log(`delete(${userId})`);
        const deletedItem = await this.userModel
            .findOneAndDelete({ userId })
            .lean()
            .exec();
        if (!deletedItem) {
            this.logger.log(`User #${userId} not found`);
            return null;
        }
        this.logger.log(`Deleted gebruiker with id ${userId}`)
        return deletedItem as IUser;
    }
}