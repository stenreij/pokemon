import { Controller, Delete, HttpException, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IPokemon } from '@pokemon/shared/api';
import { CreatePokemonDto, UpdatePokemonDto } from '@pokemon/backend/dto';
import { AuthGuard } from '../auth/authguard';

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
    async create(@Body() pokemon: CreatePokemonDto): Promise<IPokemon> {
        return this.pokemonService.create(pokemon);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(@Param('id') pokemonId: number, @Body() data: UpdatePokemonDto): Promise<IPokemon | null> {
        const updatedPokemon = await this.pokemonService.update(pokemonId, data);
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
    async delete(@Param('id') pokemonId: number): Promise<void> {
        const deletedPokemon = await this.pokemonService.delete(pokemonId);
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
    }
}
