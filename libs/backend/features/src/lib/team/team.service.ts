import { Injectable, NotFoundException } from '@nestjs/common';
import { IPokemon, ITeam } from '@pokemon/shared/api';
import { CreateTeamDto, UpdateTeamDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team as teamModel, TeamDocument } from './team.schema';

@Injectable()
export class TeamService {
    TAG = 'TeamService';
    private readonly logger: Logger = new Logger(TeamService.name);

    constructor(
        @InjectModel(teamModel.name) private teamModel: Model<TeamDocument>
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

    async create(team: CreateTeamDto): Promise<ITeam> {
        this.logger.log(`create(${team})`);
        const lowestAvailableId = await this.getLowestAvailableTeamId();
        const teamWithId = { ...team, teamId: lowestAvailableId };
        const createdItem = this.teamModel.create(teamWithId);
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

    async delete(teamId: number): Promise<ITeam | null> {
        this.logger.log(`Delete team ${teamId}`);
        const deletedItem = await this.teamModel.findOneAndDelete({ teamId }, {}).exec();
        return deletedItem;
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