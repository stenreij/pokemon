import { Controller, Delete, HttpException, HttpStatus, Put, Req, UseGuards } from '@nestjs/common';
import { TeamService } from '../team/team.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { ITeam } from '@pokemon/shared/api';
import { CreateTeamDto, UpdateTeamDto } from '@pokemon/backend/dto';
import { Pokemon } from '../pokemon/pokemon.schema';
import internal = require('stream');
import { AuthGuard } from '../auth/authguard';
import { CustomRequest } from '../auth/custom-request.interface';
import { UserExistGuard } from '../user/user-exists.guard';

@Controller('team')
export class TeamController {
    constructor(private teamService: TeamService) { }

    @Get('')
    @UseGuards(AuthGuard)
    async findAll(@Req() request: CustomRequest): Promise<ITeam[]> {
        const userId = request.userId;
        if (!userId) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                    message: 'userId is required',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        return this.teamService.findAll(userId);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
    async create(@Req() request: CustomRequest, @Body() team: CreateTeamDto): Promise<ITeam> {
        const userId = request.userId;
        return this.teamService.create(team, userId as string);
    }

    @Post('addPokemonToTeam/:pokemonId/:teamId')
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
    async delete(@Req() request: CustomRequest, @Param('id') teamId: number): Promise<ITeam | null> {
        const userId = request.userId;
        const deletedItem = await this.teamService.delete(userId as string, teamId);
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
