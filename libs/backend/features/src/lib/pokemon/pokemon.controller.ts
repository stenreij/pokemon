import { Controller, Delete, Put } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IPokemon } from '@pokemon/shared/api';
import { CreatePokemonDto } from '@pokemon/backend/dto';

@Controller('pokemon')
export class PokemonController {
    constructor(private pokemonService: PokemonService) {}

    @Get('')
    getAll(): IPokemon[] {
        return this.pokemonService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: number): IPokemon {
        return this.pokemonService.getOne(id);
    }

    @Post('')
    create(@Body() data: CreatePokemonDto): IPokemon {
        return this.pokemonService.create(data);
    }

    @Delete(':id')
    delete(@Param('id') id: number): IPokemon {
        return this.pokemonService.delete(id);
    }
}
