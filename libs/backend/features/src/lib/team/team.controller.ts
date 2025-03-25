import { Controller, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { TeamService } from '../team/team.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { ITeam } from '@pokemon/shared/api';
import { CreateTeamDto, UpdateTeamDto } from '@pokemon/backend/dto';
import { Pokemon } from '../pokemon/pokemon.schema';
import internal = require('stream');

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
        return item;
    }

    @Post('')
    async create(@Body() team: CreateTeamDto): Promise<ITeam> {
        return this.teamService.create(team);
    }

    @Post('addPokemonToTeam/:pokemonId/:teamId')
    async addPokemonToTeam(
        @Param('pokemonId') pokemonId: number,
        @Param('teamId') teamId: number,
    ): Promise<{ message: string }> {
        const result = await this.teamService.addPokemonToTeam(pokemonId, teamId);

        if (result === 'Pokemon added to the team') {
            throw new HttpException(
                { message: result },
                HttpStatus.CREATED
            );
        } else {
            throw new HttpException(result, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('removePokemonFromTeam/:pokemonId/:teamId')
    async removePokemonFromTeam(
        @Param('pokemonId') pokemonId: number,
        @Param('teamId') teamId: number,
    ): Promise<{ message: string }> {
        const result = await this.teamService.removePokemonFromTeam(pokemonId, teamId);

        if (result === 'Pokemon removed from the team') {
            return { message: result };
        } else {
            throw new HttpException(result, HttpStatus.NOT_FOUND);
        }
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
