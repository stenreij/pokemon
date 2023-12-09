import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../team.service';
import { Router } from '@angular/router';
import { ITeam, IUser } from '@pokemon/shared/api';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'pokemon-team-add',
  templateUrl: './team-add.component.html',
  styleUrls: ['./team-add.component.css'],
})
export class TeamAddComponent {
  teamForm: FormGroup;
  errorMessage: string | null = null;
  users: IUser[] | null = null;
  loggedInUser: IUser | null = null;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {

    this.teamForm = this.fb.group({
      teamName: [null, [Validators.required, Validators.maxLength(30)]],
      trainer: [null, [Validators.required]],
      teamInfo: ['', [Validators.required, Validators.maxLength(150)]],
    });
    this.authService.currentUser$.subscribe((user: IUser | null) => {
      this.loggedInUser = user;
      console.log('Logged in user:', this.loggedInUser);
      this.teamForm.get('trainer')?.setValue(this.loggedInUser?.userName);
    });
  }

  addTeam(): void {
    const newTeam: ITeam = this.teamForm.value as ITeam;
    const user = this.loggedInUser as IUser;
    this.teamService.addTeam(newTeam).subscribe(
      (addedTeam: ITeam) => {
        this.loggedInUser?.teams.push(addedTeam);
        this.userService.editUser(user).subscribe(
          (user: IUser) => {
            console.log('Gebruiker bijgewerkt met nieuw team:', user);
            this.router.navigateByUrl('/');
          },
          (error: any) => {
            console.error('Fout bij het bijwerken van de gebruiker:', error);
          }
        );
      },
      (error: any) => {
        console.error('Fout bij het toevoegen van het team:', error);
      }
    );
  }
}
