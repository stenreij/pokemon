import { Injectable, NotFoundException } from '@nestjs/common';
import { IPokemon } from '@pokemon/shared/api';
import { BehaviorSubject } from 'rxjs';
import { CreatePokemonDto, UpdatePokemonDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { Type } from '@pokemon/shared/api';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon as PokemonModel, PokemonDocument } from './pokemon.schema';

@Injectable()
export class PokemonService {
    TAG = 'PokemonService';
    private readonly logger: Logger = new Logger(PokemonService.name);

  constructor(
        @InjectModel(PokemonModel.name) private pokemonModel: Model<PokemonDocument>
        ) {}

    async findAll(): Promise<IPokemon[]> {
        this.logger.log(`findAll()`);
        const items = await this.pokemonModel.find().exec();
        return items.sort((a, b) => a.pokemonId - b.pokemonId);
    }

    async findOne(pokemonId: number): Promise<IPokemon | null> {
        this.logger.log(`findOne(${pokemonId})`);
        const item = await this.pokemonModel.findOne({pokemonId}).exec();
        if (!item) {
            this.logger.log(`findOne(${pokemonId}) not found`);
        }
        return item;
    }

    async create(pokemon: CreatePokemonDto): Promise<IPokemon> {
        this.logger.log(`create(${pokemon})`);
        const createdItem = this.pokemonModel.create(pokemon);
        return createdItem;
    }

    async update(pokemonId: number, pokemon: UpdatePokemonDto): Promise<IPokemon | null> {
        this.logger.log(`Update pokemon ${pokemon.name}`);
        return this.pokemonModel.findOneAndUpdate({ pokemonId }, pokemon);
    }

    async delete(pokemonId: number): Promise<IPokemon | null> {
        this.logger.log(`Delete pokemon ${pokemonId}`);
        const deletedItem = await this.pokemonModel.findOneAndDelete({ pokemonId }, {}).exec();
        return deletedItem;
    }
}