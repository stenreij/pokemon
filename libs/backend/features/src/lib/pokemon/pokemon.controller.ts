import { Controller, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IPokemon } from '@pokemon/shared/api';
import { CreatePokemonDto, UpdatePokemonDto } from '@pokemon/backend/dto';

@Controller('pokemon')
export class PokemonController {
    constructor(private pokemonService: PokemonService) {}

    @Get('')
    async findAll(): Promise<IPokemon[]> {
        return this.pokemonService.findAll();
    }

    @Get(':id')
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
    async create(@Body() pokemon: CreatePokemonDto): Promise<IPokemon> {
        return this.pokemonService.create(pokemon);
    }

    @Put(':id')
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
