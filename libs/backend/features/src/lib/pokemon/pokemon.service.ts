import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPokemon, Neo4jService } from '@pokemon/shared/api';
import { CreatePokemonDto, UpdatePokemonDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon as PokemonModel, PokemonDocument } from './pokemon.schema';
import { Team as TeamModel, TeamDocument } from '../team/team.schema';
import { TokenBlacklistService } from '../user/blacklist.service';
import { User as UserModel, UserDocument } from '../user/user.schema';
import { RecommendationClientService } from '../rcmnd/rcmndClient.service';

@Injectable()
export class PokemonService {
    TAG = 'PokemonService';
    private readonly logger: Logger = new Logger(PokemonService.name);

    constructor(
        @InjectModel(PokemonModel.name) private readonly pokemonModel: Model<PokemonDocument>,
        @InjectModel(TeamModel.name) private readonly teamModel: Model<TeamDocument>,
        @InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,
        private readonly tokenBlackListService: TokenBlacklistService,
        private readonly neo4jService: Neo4jService,
        private readonly recommendationClientService: RecommendationClientService,
    ) { }

    async findAll(): Promise<IPokemon[]> {
        this.logger.log(`findAll()`);
        const items = await this.pokemonModel.find().exec();
        return items.sort((a, b) => a.pokemonId - b.pokemonId);
    }

    async findOne(pokemonId: number) {
        this.logger.log(`findOne(${pokemonId})`);
        const item = await this.pokemonModel.findOne({ pokemonId }).lean().exec();
        if (!item) {
            this.logger.log(`findOne(${pokemonId}) not found`);
            return null;
        }

        const recType = item.type1.toString();
        const recommendations = await this.recommendationClientService.getRecommendationsByType(recType, item.pokemonId.toString());
        return {
            ...item, suggestions: recommendations,
        };
    }

    async create(pokemon: CreatePokemonDto, userId: string): Promise<IPokemon> {
        this.logger.log(`create(${pokemon})`);
        const user = await this.userModel.findOne({ userId: userId }).lean().exec();
        this.logger.log(`userId: ` + userId, `User: ` + user);

        if (!user) {
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

        // Sync naar Neo4j
        await this.neo4jService.runQuery(
            `
            MERGE (pm:Move {name: $powermove})
            MERGE (t:Type {name: $type})
            MERGE (p:Pokémon {pokemonId: $pokemonId})
            SET p.name = $name, p.powermove = $powermove, p.rating = $rating
            MERGE (p)-[:HAS_MOVE]->(pm)
            MERGE (p)-[:HAS_TYPE]->(t)
            `,
            {
              pokemonId: createdItem.pokemonId,
              name: createdItem.name,
              type: createdItem.type1,
              rating: createdItem.rating,
              powermove: createdItem.powermove,
            });
        return createdItem;
    }

    async update(userId: string, pokemonId: number, pokemon: UpdatePokemonDto): Promise<IPokemon | null> {
        this.logger.log(`Update pokémon ${pokemon.name}`);

        const existingPokemon = await this.pokemonModel.findOne({ pokemonId }).lean().exec();
        const user = await this.userModel.findOne({ userId }).lean().exec();

        if (!existingPokemon || !user) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: 'Not Found', message: 'Pokémon or user not found' },
                HttpStatus.NOT_FOUND
            );
        }

        if (user.role !== 'Admin' && user.userId !== existingPokemon.creator) {
            throw new HttpException(
                { status: HttpStatus.UNAUTHORIZED, error: 'Unauthorized', message: 'You do not have permission to update this pokémon' },
                HttpStatus.UNAUTHORIZED
            );
        }

        const updatedPokemon = await this.pokemonModel.findOneAndUpdate({ pokemonId }, pokemon, { new: true }).exec();
        if (!updatedPokemon) return null;

        return updatedPokemon;
    }

    async delete(userId: string, pokemonId: number): Promise<IPokemon | null> {
        this.logger.log(`Delete pokemon ${pokemonId}`);
        const pokemon = await this.pokemonModel.findOne({ pokemonId }).lean().exec();
        const user = await this.userModel.findOne({ userId: userId }).lean().exec();

        if (!pokemon || !user) {
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
        if (user?.role !== 'Admin' && user?.userId !== pokemon?.creator) {
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
        if (!deletedPokemon) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Pokémon with id ${pokemonId} not found for deletion`
                },
                HttpStatus.NOT_FOUND
            );
        }

        await this.neo4jService.runQuery(
            `
            MATCH (p:Pokémon {pokemonId:$pokemonId})
            DETACH DELETE p
            `,
            { pokemonId }
        );

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