import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPowermove } from '@pokemon/shared/api';
import { CreatePowermoveDto, UpdatePowermoveDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Powermove as PowermoveModel, PowermoveDocument } from './powermove.schema'; 
import { TokenBlacklistService } from '../user/blacklist.service';
import { User as UserModel, UserDocument } from '../user/user.schema';

@Injectable()
export class PowermoveService {
    TAG = 'PowermoveService';
    private readonly logger: Logger = new Logger(PowermoveService.name);

  constructor(
        @InjectModel(PowermoveModel.name) private powermoveModel: Model<PowermoveDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
        private readonly tokenBlackListService: TokenBlacklistService
        ) {}

    async findAll(): Promise<IPowermove[]> {
        this.logger.log(`findAll()`);
        const items = await this.powermoveModel.find().exec();
        return items.sort((a, b) => a.powermoveId - b.powermoveId);
    }

    async findOne(powermoveId: number): Promise<IPowermove | null> {
        this.logger.log(`findOne(${powermoveId})`);
        const item = await this.powermoveModel.findOne({powermoveId}).exec();
        if (!item) {
            this.logger.log(`findOne(${powermoveId}) not found`);
        }
        return item;
    }

    async create(powermove: CreatePowermoveDto, userId: string): Promise<IPowermove> {
        this.logger.log(`create(${powermove})`);
        const user = await this.userModel.findOne({userId: userId}).lean().exec();
        this.logger.log(`userId: ` + userId, `User: ` + user);

        if(!user){
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'User not found',
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        const lowestAvailableId = await this.getLowestAvailablePowermoveId();
        const powermoveWithId = { ...powermove, powermoveId: lowestAvailableId, creator: user.userId };
        powermove.creator = user.userId;
        const createdItem = await this.powermoveModel.create(powermoveWithId);
        return createdItem;
    }

    async update(userId: string, powermoveId: number, powermove: UpdatePowermoveDto): Promise<IPowermove | null> {
        this.logger.log(`Update powermove ${powermove.name}`);

        const existingPowermove = await this.powermoveModel.findOne({powermoveId}).lean().exec();
        const user = await this.userModel.findOne({userId}).lean().exec();

        this.logger.log(`existingPowermove: ` + existingPowermove,
        `existingpowermovecreator: ` + existingPowermove?.creator);

        if(!existingPowermove || !user){
            throw new HttpException(
                { 
                    status: HttpStatus.NOT_FOUND, 
                    error: 'Not Found', 
                    message: 'Powermove or user not found' },
                HttpStatus.NOT_FOUND
            );
        }
        this.logger.log(`user.userId: ` + user.userId, `creator: ` + existingPowermove?.creator);

        if(user.role !== 'Admin' && user.userId !== existingPowermove?.creator){
            throw new HttpException(
                { 
                    status: HttpStatus.UNAUTHORIZED, 
                    error: 'Unauthorized', 
                    message: 'You do not have permission to update this powermove' },
                HttpStatus.UNAUTHORIZED
            );
        }

        const updatedPowermove = await this.powermoveModel.findOneAndUpdate({powermoveId}, powermove, {new: true}).exec();
        if(!updatedPowermove) return null;

        return updatedPowermove;
    }

    async delete(userId: string, powermoveId: number): Promise<IPowermove | null> {
        this.logger.log(`Delete Powermove ${powermoveId}`);
        const powermove = await this.powermoveModel.findOne({powermoveId}).lean().exec();
        const user = await this.userModel.findOne({userId: userId}).lean().exec();

        if(!powermove || !user){
            this.logger.warn(`Powermove or user not found`);
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Powermove or user not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        if(user?.role !== 'Admin' && user?.userId !== powermove?.creator){
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to delete this pokémon',
                },
                HttpStatus.UNAUTHORIZED
            ); 
        }
        const deletedPowermove = await this.powermoveModel.findOneAndDelete({ powermoveId }, {}).exec();
        if(!deletedPowermove){
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Powermove with id ${powermoveId} not found for deletion`
                },
                HttpStatus.NOT_FOUND
            );
        }
        this.logger.log(`Deleted powermove with id ${powermoveId}`);
        return deletedPowermove;
    }

    private async getLowestAvailablePowermoveId(): Promise<number> {
        const usedIds = (await this.powermoveModel.distinct('powermoveId').exec()) as number[];
        let lowestId = 1;
        while (usedIds.includes(lowestId)) {
            lowestId++;
        }
        return lowestId;
    }
}