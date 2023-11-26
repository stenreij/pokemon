import { Controller, Delete, Put } from '@nestjs/common';
import { TeamService } from './team.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { ITeam } from '@pokemon/shared/api';
import { CreateTeamDto } from '@pokemon/backend/dto';

@Controller('team')
export class TeamController {
    constructor(private teamService: TeamService) {}

    @Get('')
    getAll(): ITeam[] {
        return this.teamService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: number): ITeam {
        return this.teamService.getOne(id);
    }

    @Post('')
    create(@Body() data: CreateTeamDto): ITeam {
        return this.teamService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() data: CreateTeamDto): ITeam {
        return this.teamService.update(id, data);
    }
    
    @Delete(':id')
    delete(@Param('id') id: number): ITeam {
        return this.teamService.delete(id);
    }

}
