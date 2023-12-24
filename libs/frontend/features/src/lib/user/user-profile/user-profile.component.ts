import { Component, OnInit, OnDestroy } from '@angular/core';
import { IUser } from '@pokemon/shared/api';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router'
import { UserService } from '../user.service';
import { AuthService } from '../../auth/auth.service';
import { TeamService } from '../../team/team.service';


@Component({
    selector: 'pokemon-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
})

export class ProfileComponent implements OnInit, OnDestroy {
    user: IUser | null = null;
    subscription: Subscription | undefined = undefined;

    constructor(private userService: UserService, private router: Router, private authService: AuthService, private route: ActivatedRoute, private teamService: TeamService
    ) { }

    ngOnInit(): void {
        if (!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
        this.route.paramMap.subscribe((params) => {
            const userId = params.get('id');
            if (userId) {
                this.userService.read(userId).subscribe((user) => {
                    this.user = user;
                });
            }
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

    formatDate(dateString: Date): Date {
        const originalDate = new Date(dateString);
        return originalDate.toLocaleDateString('nl-NL') as unknown as Date;
    }

    deleteUser(): void {
        const bevestigen = window.confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?');
      
        if (bevestigen && this.user) {
          this.userService.delete(this.user.userId).subscribe(
            (response) => {
              console.log('Verwijder gebruiker:', response);
              this.verwijderGerelateerdeTeams();
            },
            (error) => {
              console.log('Er is een fout opgetreden bij het verwijderen van de gebruiker:', error);
            }
          );
        }
      }
      
      private verwijderGerelateerdeTeams(): void {
        this.teamService.list().subscribe(
          (teams) => {
            teams?.forEach((team) => {
              if (team.trainer === this.user?.userName) {
                this.verwijderTeam(team.teamId);
              }
            });
            this.authService.logout();
            this.router.navigateByUrl('/');
          },
          (error) => {
            console.log('Er is een fout opgetreden bij het ophalen van de teams:', error);
          }
        );
      }
      
      private verwijderTeam(teamId: number): void {
        this.teamService.delete(teamId).subscribe(
          (response) => {
            console.log('Verwijder team:', response);
          },
          (error) => {
            console.log('Er is een fout opgetreden bij het verwijderen van het team:', error);
          }
        );
      }
      
}