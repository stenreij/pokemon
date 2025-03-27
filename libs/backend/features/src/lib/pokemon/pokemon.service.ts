import { Injectable } from '@nestjs/common';
import { IPokemon } from '@pokemon/shared/api';
import { CreatePokemonDto, UpdatePokemonDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon as PokemonModel, PokemonDocument } from './pokemon.schema';
import { Team as TeamModel, TeamDocument } from '../team/team.schema';
import { TokenBlacklistService } from '../user/blacklist.service';

@Injectable()
export class PokemonService {
    TAG = 'PokemonService';
    private readonly logger: Logger = new Logger(PokemonService.name);

  constructor(
        @InjectModel(PokemonModel.name) private pokemonModel: Model<PokemonDocument>,
        @InjectModel(TeamModel.name) private teamModel: Model<TeamDocument>,
        private readonly tokenBlackListService: TokenBlacklistService
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
        const lowestAvailableId = await this.getLowestAvailablePokemonId();
        const pokemonWithId = { ...pokemon, pokemonId: lowestAvailableId };
        const createdItem = await this.pokemonModel.create(pokemonWithId);
        return createdItem;
    }

    async update(pokemonId: number, pokemon: UpdatePokemonDto): Promise<IPokemon | null> {
        return this.pokemonModel.findOneAndUpdate({ pokemonId }, pokemon);
    }

    async delete(pokemonId: number): Promise<IPokemon | null> {
        const deletedPokemon = await this.pokemonModel.findOneAndDelete({ pokemonId }, {}).exec();
        return deletedPokemon;
    }

    private async getLowestAvailablePokemonId(): Promise<number> {
        const usedIds = (await this.pokemonModel.distinct('pokemonId').exec()) as number[];
        let lowestId = 1;
        while (usedIds.includes(lowestId)) {
            lowestId++;
        }
        return lowestId;
    }
}