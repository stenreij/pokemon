import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser, IUserInfo } from '@pokemon/shared/api';
import { User as UserModel, UserDocument } from './user.schema'; 
import { CreateUserDto, UpdatePokemonDto, UpdateUserDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
    TAG = 'UserService';
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
        ) {}

    async findAll(): Promise<IUserInfo[]> {
        this.logger.log(`findAll()`);
        const items = await this.userModel.find().exec();
        return items;
    }

    async findOne(userId: number): Promise<IUser | null> {
        this.logger.log(`findOne(${userId})`);
        const item = await this.userModel.findOne({userId}).exec();
        if (!item) {
            this.logger.log(`findOne(${userId}) not found`);
        }
        return item;
    }

    async findOneByEmail(email: string): Promise<IUser | null> {
        this.logger.log(`findOneByEmail(${email})`);
        const item = this.userModel
        .findOne({email})
        .select('-password')
        .exec();
        if (!item) {
            this.logger.log(`findOneByEmail(${email}) not found`);
        }
        return item;
    }

    async create(user: CreateUserDto): Promise<IUserInfo> {
        this.logger.log(`create(${user})`);
        const createdItem = this.userModel.create(user);
        return createdItem;
    }

    async update(id: number, user: UpdateUserDto): Promise<IUserInfo | null> {
        this.logger.log(`Update user ${user.userName}`);
        return this.userModel.findByIdAndUpdate({id}, user);
    }
}
