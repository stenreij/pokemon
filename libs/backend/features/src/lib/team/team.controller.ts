import { Controller, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { TeamService } from '../team/team.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { ITeam } from '@pokemon/shared/api';
import { CreateTeamDto, UpdateTeamDto } from '@pokemon/backend/dto';

@Controller('team')
export class TeamController {
    constructor(private teamService: TeamService) { }

    @Get('')
    async findAll(): Promise<ITeam[]> {
        return this.teamService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<ITeam | null> {
        const item = await this.teamService.findOne(id);
        if (!item) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Team with id: ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return this.teamService.findOne(id);
    }

    @Post('')
    async create(@Body() team: CreateTeamDto): Promise<ITeam> {
        return this.teamService.create(team);
    }

    @Put(':id')
    async update(
        @Param('id') teamId: number,
        @Body() data: UpdateTeamDto
    ): Promise<ITeam | null> {
        const updatedItem = await this.teamService.update(teamId, data);
        if (!updatedItem) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Team with id: ${teamId} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return updatedItem;
    }

    @Delete(':id')
    async delete(@Param('id') teamId: number): Promise<ITeam | null> {
        const deletedItem = await this.teamService.delete(teamId);
        if (!deletedItem) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Team with id: ${teamId} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return deletedItem;
    }
}
