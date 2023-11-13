import { Injectable, NotFoundException } from '@nestjs/common';
import { ITeam } from '@pokemon/shared/api';
import { BehaviorSubject } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class TeamService {
    TAG = 'TeamService';

    private teams$ = new BehaviorSubject<ITeam[]>([
        {
            teamId: 1,
            teamName: 'Team 1',
            rating: 1,
            trainer: 'Ash',
        },
    ]);

    getAll(): ITeam[] {
        Logger.log('getAll', this.TAG);
        return this.teams$.value;
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

    create(team: Pick<ITeam, 'teamName' | "trainer" | 'rating'>): ITeam {
        Logger.log('create', this.TAG);
        const current = this.teams$.value;

        const newTeam: ITeam = {       
            teamId: this.teams$.value.length + 1,
            ...team,
        };
        this.teams$.next([...current, newTeam]);
        return newTeam;
    }
}
