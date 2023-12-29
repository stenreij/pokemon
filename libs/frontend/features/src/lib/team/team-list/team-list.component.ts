import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { TeamService } from '../team.service';
import { ITeam, IUser } from '@pokemon/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'
import { AuthService } from '../../auth/auth.service';


@Component({
    selector: 'pokemon-team-list',
    templateUrl: './team-list.component.html',
    styleUrls: ['./team-list.component.css'],
})

export class TeamListComponent implements OnInit, OnDestroy {
    teams: ITeam[] | null = null;
    subscription: Subscription | undefined = undefined;
    loggedInUser: IUser | null = null;
    user= this.authService.currentUser$.value!;

    constructor(private teamService: TeamService, private router: Router, private authService: AuthService) { }

    ngOnInit(): void {
      if (!this.authService.isAuthenticated()) {
        this.router.navigateByUrl('/login');
      }
  
      this.authService.currentUser$.subscribe((user: IUser | null) => {
        this.loggedInUser = user;
        console.log('Logged in user:', this.loggedInUser);
  
        if (this.loggedInUser) {
          this.loadTeams();
        }
      });
    }
      
    loadTeams(): void {
      this.subscription = this.teamService.list().subscribe((allTeams) => {
        this.teams = allTeams!.filter(
          (team) => team.trainer === this.loggedInUser?.userName
        );
        console.log('Filtered Teams:', this.teams);
      });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

    verwijderTeam(teamId: number): void {
      const bevestigen = window.confirm('Weet je zeker dat je dit team wilt verwijderen?');
      
      if (bevestigen) {
        this.teamService.delete(teamId).subscribe(
          () => {
            this.loadTeams();
          },
          (error) => {
            console.log('Er is een fout opgetreden bij het verwijderen van het team:', error);
          }
        );
      }
    }
}