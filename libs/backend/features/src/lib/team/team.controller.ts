import { Controller, Delete, Put } from '@nestjs/common';
import { TeamService } from '../team/team.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { ITeam } from '@pokemon/shared/api';
import { CreateTeamDto, UpdateTeamDto } from '@pokemon/backend/dto';

@Controller('team')
export class TeamController {
    constructor(private teamService: TeamService) {}

    @Get('')
    async findAll(): Promise<ITeam[]> {
        return this.teamService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<ITeam | null> {
        return this.teamService.findOne(id);
    }

    @Post('')
    async create(@Body() team: CreateTeamDto): Promise<ITeam> {
        return this.teamService.create(team);
    }

    @Put(':id')
    async update(@Param('id') teamId: number,
        @Body() data: UpdateTeamDto
    ): Promise<ITeam | null> {
        return this.teamService.update(teamId, data);
    }

    @Delete(':id')
    delete(@Param('id') teamId: number): Promise<ITeam | null> {
        return this.teamService.delete(teamId);
    }
}
