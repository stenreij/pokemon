import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPokemon } from '@pokemon/shared/api';
import { CreatePokemonDto, UpdatePokemonDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon as PokemonModel, PokemonDocument } from './pokemon.schema';
import { Team as TeamModel, TeamDocument } from '../team/team.schema';
import { TokenBlacklistService } from '../user/blacklist.service';
import { User as UserModel, UserDocument } from '../user/user.schema';

@Injectable()
export class PokemonService {
    TAG = 'PokemonService';
    private readonly logger: Logger = new Logger(PokemonService.name);

  constructor(
        @InjectModel(PokemonModel.name) private pokemonModel: Model<PokemonDocument>,
        @InjectModel(TeamModel.name) private teamModel: Model<TeamDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
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

    async create(pokemon: CreatePokemonDto, userId: string): Promise<IPokemon> {
        this.logger.log(`create(${pokemon})`);
        const user = await this.userModel.findOne({userId: userId}).lean().exec();
        this.logger.log(`userId: ` + userId, `User: ` + user);

        if(!user){
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'User not found',
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        const lowestAvailableId = await this.getLowestAvailablePokemonId();
        const pokemonWithId = { ...pokemon, pokemonId: lowestAvailableId, creator: Number(userId) }; 
        pokemon.creator = user.userId;
        const createdItem = await this.pokemonModel.create(pokemonWithId);
        return createdItem;
    }

    async update(userId: string, pokemonId: number, pokemon: UpdatePokemonDto): Promise<IPokemon | null> {
        this.logger.log(`Update pokémon ${pokemon.name}`);

        const existingPokemon = await this.pokemonModel.findOne({pokemonId}).lean().exec();
        const user = await this.userModel.findOne({userId}).lean().exec();

        if(!existingPokemon || !user){
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: 'Not Found', message: 'Pokémon or user not found' },
                HttpStatus.NOT_FOUND
            );
        }

        if(user.role !== 'Admin' && user.userId !== existingPokemon.creator){
            throw new HttpException(
                { status: HttpStatus.UNAUTHORIZED, error: 'Unauthorized', message: 'You do not have permission to update this pokémon' },
                HttpStatus.UNAUTHORIZED
            );
        }
        
        const updatedPokemon = await this.pokemonModel.findOneAndUpdate({pokemonId}, pokemon, { new: true}).exec();
        if(!updatedPokemon) return null;

        return updatedPokemon;
    }

    async delete(userId: string, pokemonId: number): Promise<IPokemon | null> {
        this.logger.log(`Delete pokemon ${pokemonId}`);
        const pokemon = await this.pokemonModel.findOne({pokemonId}).lean().exec();
        const user = await this.userModel.findOne({userId: userId}).lean().exec();

        if(!pokemon || !user){
            this.logger.warn(`Pokémon or user not found`);
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Pokémon or user not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        if(user?.role !== 'Admin' && user?.userId !== pokemon?.creator){
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to delete this pokémon',
                },
                HttpStatus.UNAUTHORIZED
            ); 
        }
        const deletedPokemon = await this.pokemonModel.findOneAndDelete({ pokemonId }, {}).exec();
        if(!deletedPokemon){
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Pokémon with id ${pokemonId} not found for deletion`
                },
                HttpStatus.NOT_FOUND
            );
        }
        this.logger.log(`Deleted pokémon with id ${pokemonId}`);
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