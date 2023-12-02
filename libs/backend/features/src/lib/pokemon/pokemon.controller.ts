import { Controller, Delete, Put } from '@nestjs/common';
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
        return this.pokemonService.findOne(id);
    }

    @Post('')
    async create(@Body() user: CreatePokemonDto): Promise<IPokemon> {
        return this.pokemonService.create(user);
    }

    @Put(':id')
    async update(@Param('id') pokemonId: number,
        @Body() data: UpdatePokemonDto
    ): Promise<IPokemon | null> {
        return this.pokemonService.update(pokemonId, data);
    }

    @Delete(':id')
    delete(@Param('id') pokemonId: number): Promise<IPokemon | null> {
        return this.pokemonService.delete(pokemonId);
    }
}
