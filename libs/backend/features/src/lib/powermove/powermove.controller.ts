import { Controller, Delete, Put } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IPowermove } from '@pokemon/shared/api';
import { CreatePowermoveDto, UpdatePowermoveDto } from '@pokemon/backend/dto';
import { PowermoveService } from './powermove.service';

@Controller('powermove')
export class PowermoveController {
    constructor(private powermoveService: PowermoveService) {}

    @Get('')
    async findAll(): Promise<IPowermove[]> {
        return this.powermoveService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<IPowermove | null> {
        return this.powermoveService.findOne(id);
    }

    @Post('')
    async create(@Body() powermove: CreatePowermoveDto): Promise<IPowermove> {
        return this.powermoveService.create(powermove);
    }

    @Put(':id')
    async update(@Param('id') powermoveId: number,
        @Body() data: UpdatePowermoveDto
    ): Promise<IPowermove | null> {
        return this.powermoveService.update(powermoveId, data);
    }

    @Delete(':id')
    delete(@Param('id') powermoveId: number): Promise<IPowermove | null> {
        return this.powermoveService.delete(powermoveId);
    }
}
