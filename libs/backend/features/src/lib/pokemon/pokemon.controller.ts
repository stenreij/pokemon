import { Controller, Delete, HttpException, HttpStatus, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IPokemon } from '@pokemon/shared/api';
import { CreatePokemonDto, UpdatePokemonDto } from '@pokemon/backend/dto';
import { AuthGuard } from '../auth/authguard';
import { CustomRequest } from '../auth/custom-request.interface';
import { LoggingInterceptor } from '../auth/LoggingInterceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('pokemon')
export class PokemonController {
    constructor(private pokemonService: PokemonService) {}

    @Get('')
    @UseGuards(AuthGuard)
    async findAll(): Promise<IPokemon[]> {
        return this.pokemonService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOne(@Param('id') id: number): Promise<IPokemon | null> {
        const pokemon = await this.pokemonService.findOne(id);
        if (!pokemon) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Pokemon with id: ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return pokemon;
    }

    @Post('')
    @UseGuards(AuthGuard)
    async create(@Req() request: CustomRequest, @Body() pokemon: CreatePokemonDto): Promise<IPokemon> {
        const userId = request.userId;
        return this.pokemonService.create(pokemon, userId as string);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(@Req() request: CustomRequest, @Param('id') pokemonId: number, @Body() data: UpdatePokemonDto): Promise<IPokemon | null> {
        const userId = request.userId;
        const updatedPokemon = await this.pokemonService.update(userId as string, pokemonId, data);
        
        if (!updatedPokemon) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Pokemon with id: ${pokemonId} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return updatedPokemon;
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Req() request: CustomRequest, @Param('id') pokemonId: number): Promise<IPokemon | null> {
        const userId = request.userId;
        const deletedPokemon = await this.pokemonService.delete(userId as string, pokemonId);
        if (!deletedPokemon) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Pokemon with id: ${pokemonId} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return deletedPokemon;
    }
}
