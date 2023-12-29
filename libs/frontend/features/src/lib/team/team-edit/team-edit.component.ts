import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../team.service';
import { ITeam, IUser } from '@pokemon/shared/api';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'pokemon-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.css'],
})
export class TeamEditComponent implements OnInit {
  teamForm: FormGroup;
  team: ITeam | undefined;
  loggedInUser: IUser | null = null;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      trainer: ['', Validators.required],
      teamInfo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');

    this.authService.currentUser$.subscribe((user: IUser | null) => {
      this.loggedInUser = user;
    });

    this.route.paramMap.subscribe((params) => {
      const teamId = params.get('id');
      if (teamId) {
        this.teamService.read(teamId).subscribe((team) => {
          this.team = team;
          this.teamForm.patchValue({
            teamName: team.teamName,
            trainer: team.trainer,
            teamInfo: team.teamInfo,
          });
        });
      }
    });
  }

  editTeam(): void {
    if (this.teamForm.valid && this.team && this.loggedInUser) {
      const newTeam: ITeam = this.teamForm.value as ITeam;
      newTeam.teamId = this.team.teamId;
  
      newTeam.rating = this.team.rating;
      newTeam.pokemon = this.team.pokemon;
  
      const foundTeamIndex = this.loggedInUser.teams.findIndex(t => t.teamId === this.team?.teamId);
      if (foundTeamIndex !== -1) {
        this.loggedInUser.teams[foundTeamIndex] = { ...newTeam };
      }
  
      this.teamService.editTeam(newTeam).subscribe(
        (editedTeam: ITeam) => {
          console.log('Bewerkt team:', editedTeam);
  
          this.userService.editUser(this.loggedInUser as IUser).subscribe();
  
          this.router.navigateByUrl('/team/' + editedTeam.teamId);
        },
        (error: any) => {
          console.error('Fout bij het bewerken van het team:', error);
        }
      );
    }
  }  
}
