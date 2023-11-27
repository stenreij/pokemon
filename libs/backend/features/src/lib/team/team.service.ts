import { Injectable, NotFoundException } from '@nestjs/common';
import { ITeam, IPokemon } from '@pokemon/shared/api';
import { BehaviorSubject } from 'rxjs';
import { CreateTeamDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class TeamService {
    TAG = 'TeamService';

    private teams$ = new BehaviorSubject<ITeam[]>([
        {
            teamId: 1,
            teamName: 'Mystic Sparks',
            trainer: 'Ash',
            rating: 99999,
            teamInfo: 'This is the best team ever!',
            pokemon: [700, 6, 3, 9],
        },
        {
            teamId: 2,
            teamName: 'Misty Mariners',
            trainer: 'Misty',
            rating: 1200,
            teamInfo: 'Water is the best!',
            pokemon: [1]
        },
        {
            teamId: 3,
            teamName: 'De Stenengooiers',
            trainer: 'Brock',
            rating: 1000,
            teamInfo: 'Stenen zijn cool!',
            pokemon: [],
        },
        {
            teamId: 4,
            teamName: 'Crimson Vipers',
            trainer: 'Jessie',
            rating: 0,
            teamInfo: 'Crimson Vipers are the best!',
            pokemon: [4, 5],
        },
        {
            teamId: 5,
            teamName: 'Gentleman Ghosts',
            trainer: 'James',
            rating: 0,
            teamInfo: 'Ghosts are the best!',
            pokemon: [3, 2, 1],
        },
    ]);

  
    getAll(): ITeam[] {
        Logger.log('getAll', this.TAG);
        return this.teams$.value.sort((a, b) => a.teamId - b.teamId);
    }

    getOne(id: number): ITeam {
        Logger.log(`getOne(${id})`, this.TAG);
        const team = this.teams$.value.find((team) => team.teamId === +id);
        Logger.log(`Team => ${JSON.stringify(team)}`, this.TAG);

        if (!team) {
            throw new NotFoundException(`Team could not be found!`);
        }
        return team;
    }

    create(team: Pick<ITeam, 'teamName' | 'trainer' | 'teamInfo'>): ITeam {
        Logger.log('create', this.TAG);
        const current = this.teams$.value;
    
        const newTeam: ITeam = {
            teamId: Math.floor(Math.random() * 1000),
            ...team,
            rating: 0,
            pokemon: []
        };
    
        this.teams$.next([...current, newTeam]);
        return newTeam;
    }

    update(id: number, team: Pick<ITeam, 'teamName' | "trainer" | "teamInfo">): ITeam {
        Logger.log('update', this.TAG);
        const current = this.teams$.value;
        const teamToUpdate = this.getOne(id);
        const updatedTeam: ITeam = {
            ...teamToUpdate,
            ...team,
        };
        this.teams$.next([
            ...current.filter((team) => team.teamId !== teamToUpdate.teamId),
            updatedTeam,
        ]);
        return updatedTeam;
    }

    delete(id: number): ITeam {
        Logger.log('delete', this.TAG);
        const current = this.teams$.value;
        const teamToDelete = this.getOne(id);
        this.teams$.next([
            ...current.filter((team) => team.teamId !== teamToDelete.teamId),
        ]);
        return teamToDelete;
    }
}
