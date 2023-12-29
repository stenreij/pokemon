import { Injectable } from '@nestjs/common';
import { IPowermove } from '@pokemon/shared/api';
import { CreatePowermoveDto, UpdatePowermoveDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Powermove as PowermoveModel, PowermoveDocument } from './powermove.schema'; 

@Injectable()
export class PowermoveService {
    TAG = 'PowermoveService';
    private readonly logger: Logger = new Logger(PowermoveService.name);

  constructor(
        @InjectModel(PowermoveModel.name) private powermoveModel: Model<PowermoveDocument>
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

    async create(powermove: CreatePowermoveDto): Promise<IPowermove> {
        this.logger.log(`create(${powermove})`);
        const lowestAvailableId = await this.getLowestAvailablePowermoveId();
        const powermoveWithId = { ...powermove, powermoveId: lowestAvailableId };
        const createdItem = await this.powermoveModel.create(powermoveWithId);
        return createdItem;
    }

    async update(powermoveId: number, powermove: UpdatePowermoveDto): Promise<IPowermove | null> {
        return this.powermoveModel.findOneAndUpdate({ powermoveId }, powermove);
    }

    async delete(powermoveId: number): Promise<IPowermove | null> {
        const deletedPowermove = await this.powermoveModel.findOneAndDelete({ powermoveId }, {}).exec();
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