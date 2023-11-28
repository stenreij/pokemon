/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ITeam, IPokemon } from '@pokemon/shared/api';
import { BehaviorSubject } from 'rxjs';
import { CreateTeamDto } from '@pokemon/backend/dto';
import { Logger } from '@nestjs/common';
import { Type } from 'libs/shared/api/src/lib/models/type.enum';


@Injectable()
export class TeamService {
    TAG = 'TeamService';

    private teams$ = new BehaviorSubject<ITeam[]>([
        {
            teamId: 1,
            teamName: 'Mystic Sparks',
            trainer: 'Ash',
            rating: 0,
            teamInfo: 'This is the best team ever!',
            pokemon: [
                { pokemonId: 150, name: 'Mewtwo', type1: Type.Flying, type2: Type.Normal , rating: 2200, legendary: true, afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png'},
                { pokemonId: 1, name: 'Bulbasaur', type1: Type.Grass, type2: Type.Poison , rating: 100, legendary: false, afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png'},
            ]
        },
        {
            teamId: 2,
            teamName: 'Misty Mariners',
            trainer: 'Misty',
            rating: 0,
            teamInfo: 'Water is the best!',
            pokemon: [
                { pokemonId: 1, name: 'Bulbasaur', type1: Type.Grass, type2: Type.Poison , rating: 100, legendary: false, afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png'},
            ]
        },
        {
            teamId: 3,
            teamName: 'De Stenengooiers',
            trainer: 'Brock',
            rating: 0,
            teamInfo: 'Stenen zijn cool!',
            pokemon: [],
        },
        {
            teamId: 4,
            teamName: 'Crimson Vipers',
            trainer: 'Jessie',
            rating: 0,
            teamInfo: 'Crimson Vipers are the best!',
            pokemon: [],
        },
        {
            teamId: 5,
            teamName: 'Gentleman Ghosts',
            trainer: 'James',
            rating: 0,
            teamInfo: 'Ghosts are the best!',
            pokemon: [
                { pokemonId: 3, name: 'Venusaur', type1: Type.Grass, type2: Type.Poison , rating: 300, legendary: false, afbeelding: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png'},
            ],
        },
    ]);

    getAll(): ITeam[] {
        Logger.log('getAll', this.TAG);
        this.teams$.value.forEach((team) => {
            team.rating = 0;
            team.pokemon.forEach((pokemonId) => {             
                team.rating += pokemonId.rating;
            });
        });
        return this.teams$.value.sort((a, b) => a.teamId - b.teamId);
    }

    getOne(id: number): ITeam {
        Logger.log(`getOne(${id})`, this.TAG);
        const team = this.teams$.value.find((team) => team.teamId === +id);
        Logger.log(`Team => ${JSON.stringify(team)}`, this.TAG);
        this.teams$.value.forEach((team) => {
            team.rating = 0;
            team.pokemon.forEach((pokemonId) => {             
                team.rating += pokemonId.rating;
            });
        });
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
            pokemon: [],
            rating: 0,
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