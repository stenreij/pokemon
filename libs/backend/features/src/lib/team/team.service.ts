import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { IPokemon, ITeam } from '@pokemon/shared/api';
import { CreateTeamDto, UpdateTeamDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team as teamModel, TeamDocument } from './team.schema';
import { Pokemon as pokemonModel, PokemonDocument } from '../pokemon/pokemon.schema';
import { User as userModel, UserDocument } from '../user/user.schema';
import { TokenBlacklistService } from '../user/blacklist.service';

@Injectable()
export class TeamService {
    TAG = 'TeamService';
    private readonly logger: Logger = new Logger(TeamService.name);

    constructor(
        @InjectModel(teamModel.name) private teamModel: Model<TeamDocument>,
        @InjectModel(pokemonModel.name) private pokemonModel: Model<PokemonDocument>,
        @InjectModel(userModel.name) private userModel: Model<UserDocument>,
        private readonly tokenBlackListService: TokenBlacklistService
    ) { }

    async findAll(): Promise<ITeam[]> {
        this.logger.log(`findAll()`);
        const items = await this.teamModel.find().exec();
        const updateTeamRatingsPromises = items.map(async (item) => {
            const rating = await this.calculateTeamrating(item);
            item.rating = rating;
        });

        await Promise.all(updateTeamRatingsPromises);

        return items.sort((a, b) => a.teamId - b.teamId);
    }

    async findOne(teamId: number): Promise<ITeam | null> {
        this.logger.log(`findOne(${teamId})`);
        const item = await this.teamModel.findOne({ teamId }).exec();

        if (!item) {
            this.logger.log(`findOne(${teamId}) not found`);
            return null;
        }

        const rating = await this.calculateTeamrating(item);
        item.rating = rating;

        return item;
    }

    async create(team: CreateTeamDto, userId: string): Promise<ITeam> {
        this.logger.log(`create(${team})`);
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
        const lowestAvailableId = await this.getLowestAvailableTeamId();
        const teamWithId = { ...team, teamId: lowestAvailableId, trainer: user.userId };
        team.trainer = user.userId;
        const createdItem = await this.teamModel.create(teamWithId);
        return createdItem;
    }

    async update(teamId: number, team: UpdateTeamDto): Promise<ITeam | null> {
        this.logger.log(`Update team ${team.teamName}`);
        const updatedTeam = await this.teamModel.findOneAndUpdate({ teamId }, team, { new: true }).exec();
    
        if (!updatedTeam) {
            return null;
        }
    
        const rating = await this.calculateTeamrating(updatedTeam);
        updatedTeam.rating = rating;
    
        return updatedTeam;
    }

    async delete(userId: string, teamId: number): Promise<ITeam | null> {
        this.logger.log(`Delete team ${teamId}`);
        const team = await this.teamModel.findOne({teamId}).lean().exec();
        const user = await this.userModel.findOne({userId: userId}).lean().exec();

        if(!team || !user){
            this.logger.warn(`Team or user not found`);
        }
        if (user?.role !== 'Admin' && user?.userId !== team?.trainer) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to delete this verzameling',
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        const deletedItem = await this.teamModel.findOneAndDelete({teamId}).lean().exec();
        if (!deletedItem) {
            this.logger.warn(`Team with id ${teamId} not found for deletion`);
            return null;
        }
        this.logger.log(`Deleted team with id ${teamId}`);
        return deletedItem as ITeam;
    }
    
    async addPokemonToTeam(pokemonId: number, teamId: number): Promise<string> {
        this.logger.log(`addPokemonToTeam called with pokemon ${pokemonId} and teamId ${teamId}`);
    
        const pokemon = await this.pokemonModel.findOne({ pokemonId }).lean();
        const team = await this.teamModel.findOne({ teamId });
    
        if (!pokemon || !team) {
            this.logger.warn(`Pokemon or team not found (pokemonId: ${pokemonId}, teamId: ${teamId})`);
            return 'Pokemon or team not found';
        }
    
        if (team.pokemon.some((p: any) => p.pokemonId === pokemon.pokemonId)) {
            this.logger.warn(`Pokemon ${pokemonId} already exists in team ${teamId}`);
            return 'Pokemon is already in this team';
        }
    
        team.pokemon.push(pokemon);
    
        await team.save();
    
        this.logger.log(`Successfully added pokemon ${pokemonId} to team ${teamId}`);
        return 'Pokemon added to the team';
    }

    async removePokemonFromTeam(pokemonId: number, teamId: number): Promise<string> {
        this.logger.log(`removePokemonFromTeam called with pokemonId ${pokemonId} and teamId ${teamId}`);
    
        const pokemon = await this.pokemonModel.findOne({ pokemonId }).lean();
        const team = await this.teamModel.findOne({ teamId });
    
        if (!pokemon || !team) {
            this.logger.warn(`Pokemon or team not found (pokemonId: ${pokemonId}, teamId: ${teamId})`);
            return 'Pokemon or team not found';
        }
    
        this.logger.log('team.pokemon array: ', team.pokemon);
    
        const pokemonIndex = team.pokemon.findIndex((p: IPokemon) => Number(p.pokemonId) === Number(pokemonId));
        this.logger.log(`pokemonIndex: ` + pokemonIndex);
    
        if (pokemonIndex === -1) {
            this.logger.warn(`Pokemon ${pokemonId} does not exist in team ${teamId}`);
            return 'Pokemon does not exist in this team';
        }
    
        team.pokemon.splice(pokemonIndex, 1);
        await team.save();
    
        this.logger.log(`Successfully removed pokemon ${pokemonId} from team ${teamId}`);
        return 'Pokemon removed from the team';
    }
    
    private async getLowestAvailableTeamId(): Promise<number> {
        const usedIds = (await this.teamModel.distinct('teamId').exec()) as number[];
        let lowestId = 1;
        while (usedIds.includes(lowestId)) {
            lowestId++;
        }
        return lowestId;
    }

    private async calculateTeamrating(team: ITeam): Promise<number> {
        let teamRating = 0;
        team.pokemon.forEach((pokemon) => {
            teamRating += pokemon.rating;
        });

        return teamRating;
    }
}