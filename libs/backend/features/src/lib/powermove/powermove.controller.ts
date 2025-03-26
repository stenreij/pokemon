import { Controller, Delete, HttpException, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IPowermove } from '@pokemon/shared/api';
import { CreatePowermoveDto, UpdatePowermoveDto } from '@pokemon/backend/dto';
import { PowermoveService } from './powermove.service';
import { AuthGuard } from '../auth/authguard';

@Controller('powermove')
export class PowermoveController {
    constructor(private powermoveService: PowermoveService) {}

    @Get('')
    @UseGuards(AuthGuard)
    async findAll(): Promise<IPowermove[]> {
        return this.powermoveService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOne(@Param('id') id: number): Promise<IPowermove | null> {
        const powermove = await this.powermoveService.findOne(id);
        if (!powermove) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Powermove with id: ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return powermove;
    }

    @Post('')
    @UseGuards(AuthGuard)
    async create(@Body() powermove: CreatePowermoveDto): Promise<IPowermove> {
        return this.powermoveService.create(powermove);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(@Param('id') powermoveId: number, @Body() data: UpdatePowermoveDto): Promise<IPowermove | null> {
        const updatedPowermove = await this.powermoveService.update(powermoveId, data);
        if (!updatedPowermove) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Powermove with id: ${powermoveId} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return updatedPowermove;
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') powermoveId: number): Promise<void> {
        const deletedPowermove = await this.powermoveService.delete(powermoveId);
        if (!deletedPowermove) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Powermove with id: ${powermoveId} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
    }
}
