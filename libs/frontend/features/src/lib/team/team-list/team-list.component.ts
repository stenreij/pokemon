import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamService } from '../team.service';
import { ITeam } from '@pokemon/shared/api';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pokemon-team-list',
    templateUrl: './team-list.component.html',
    styleUrls: ['./team-list.component.css'],
})
export class TeamListComponent implements OnInit, OnDestroy {
    teams: ITeam[] | null = null;
    subscription: Subscription | undefined = undefined;

    constructor(private teamService: TeamService) {}

    ngOnInit(): void {
        this.subscription = this.teamService.list().subscribe((results) => {
            console.log(`results: ${results}`);
            this.teams = results;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
