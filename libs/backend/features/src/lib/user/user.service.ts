import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from '@pokemon/shared/api';
import { User as UserModel, UserDocument } from './user.schema';
import { CreateUserDto, UpdatePokemonDto, UpdateUserDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
    TAG = 'UserService';
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
    ) { }

    async findAll(): Promise<IUser[]> {
        this.logger.log(`findAll()`);
        const items = await this.userModel.find().exec();
        return items;
    }

    async findOne(userId: number): Promise<IUser | null> {
        this.logger.log(`findOne(${userId})`);
        const item = await this.userModel.findOne({ userId }).exec();
        if (!item) {
            this.logger.log(`findOne(${userId}) not found`);
        }
        return item;
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
        const updatedItem = this.userModel.findOneAndUpdate({ userId }, user, {
            new: true,
            }).exec();
        return updatedItem;
    }

    async login(email: string, password: string): Promise<IUser> {
        console.log('login called');
        const user = await this.userModel
            .findOne({ email, password })
            .lean()
            .exec();

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        const secretKey = randomBytes(32).toString('hex');
        const userId = user.userId.toString();
        const token = sign({ userId }, secretKey, {
            expiresIn: '1h',
        }) as string;

        const response = { ...user, token };
        console.log('First Backend Response:', response);
        return response as IUser;
    }

    async logout(userId: number): Promise<void> {
        console.log('logout called');
    
        const user = await this.userModel
            .findOne({ userId })
            .lean()
            .exec();
    
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
    
        localStorage.removeItem('auth_token');
        localStorage.removeItem('currentuser');
    
        console.log('Logout successful');
    }
}
