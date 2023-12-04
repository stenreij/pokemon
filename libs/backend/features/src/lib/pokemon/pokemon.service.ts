import { Injectable } from '@nestjs/common';
import { IPokemon } from '@pokemon/shared/api';
import { CreatePokemonDto, UpdatePokemonDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon as PokemonModel, PokemonDocument } from './pokemon.schema';
import { Team as TeamModel, TeamDocument } from '../team/team.schema';

@Injectable()
export class PokemonService {
    TAG = 'PokemonService';
    private readonly logger: Logger = new Logger(PokemonService.name);

  constructor(
        @InjectModel(PokemonModel.name) private pokemonModel: Model<PokemonDocument>,
        @InjectModel(TeamModel.name) private teamModel: Model<TeamDocument>,
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
        this.logger.log(`Update pokemon ${pokemon.name}`);
        const updatedPokemon = await this.pokemonModel.findOneAndUpdate({ pokemonId }, pokemon, { new: true });
        if (!updatedPokemon) {
            return null; 
        }

        await this.updatePokemonInTeams(updatedPokemon);
        return updatedPokemon;
    }

    async delete(pokemonId: number): Promise<IPokemon | null> {
        this.logger.log(`Delete pokemon ${pokemonId}`);
        const deletedItem = await this.pokemonModel.findOneAndDelete({ pokemonId }, {}).exec();
        if (deletedItem) {
            await this.removePokemonFromTeams(deletedItem);
        }
    
        return deletedItem;
    }

    private async getLowestAvailablePokemonId(): Promise<number> {
        const usedIds = (await this.pokemonModel.distinct('pokemonId').exec()) as number[];
        let lowestId = 1;
        while (usedIds.includes(lowestId)) {
            lowestId++;
        }
        return lowestId;
    }

    private async updatePokemonInTeams(pokemon: IPokemon): Promise<void> {
        const teamsContainingPokemon = await this.teamModel.find({ 'pokemon.pokemonId': pokemon.pokemonId }).exec();

        if (teamsContainingPokemon.length === 0) {
            return; 
        }

        await Promise.all(
            teamsContainingPokemon.map(async (team) => {
                const updatedTeam = team.toObject();
                const index = updatedTeam.pokemon.findIndex((p) => p.pokemonId === pokemon.pokemonId);

                if (index !== -1) {
                    updatedTeam.pokemon[index] = { ...pokemon }; 
                    await this.teamModel.findOneAndUpdate({ teamId: team.teamId }, updatedTeam);
                }
            })
        );
    }

    private async removePokemonFromTeams(pokemon: IPokemon): Promise<void> {
        const teamsContainingPokemon = await this.teamModel.find({ 'pokemon.pokemonId': pokemon.pokemonId }).exec();
    
        if (teamsContainingPokemon.length === 0) {
            return;
        }
    
        await Promise.all(
            teamsContainingPokemon.map(async (team) => {
                const updatedTeam = team.toObject();
                const index = updatedTeam.pokemon.findIndex((p) => p.pokemonId === pokemon.pokemonId);
    
                if (index !== -1) {
                    updatedTeam.pokemon.splice(index, 1);
                    await this.teamModel.findOneAndUpdate({ teamId: team.teamId }, updatedTeam);
                }
            })
        );
    }
}