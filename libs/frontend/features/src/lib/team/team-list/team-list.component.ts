import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { TeamService } from '../team.service';
import { ITeam } from '@pokemon/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'


@Component({
    selector: 'pokemon-team-list',
    templateUrl: './team-list.component.html',
    styleUrls: ['./team-list.component.css'],
})

export class TeamListComponent implements OnInit, OnDestroy {
    teams: ITeam[] | null = null;
    subscription: Subscription | undefined = undefined;

    constructor(private teamService: TeamService, private router: Router) { }

    ngOnInit(): void {
        this.subscription = this.teamService.list().subscribe((results) => {
            console.log(`results: ${results}`);
            this.teams = results;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

    verwijderTeam(teamId: number): void {
        this.teamService.delete(teamId).subscribe(() => {
            this.teamService.list().subscribe((results) => {
                this.teams = results;
            });
        });
    }
}