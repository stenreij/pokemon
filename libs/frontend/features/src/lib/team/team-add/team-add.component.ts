import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../team.service';
import { Router } from '@angular/router'
import { ITeam } from '@pokemon/shared/api';

@Component({
  selector: 'pokemon-team-add',
  templateUrl: './team-add.component.html',
  styleUrls: ['./team-add.component.css'],
})
export class TeamAddComponent {
  teamForm: FormGroup;

  constructor(private fb: FormBuilder, private teamService: TeamService, private router: Router) {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      trainer: ['', Validators.required],
      teamInfo: ['', Validators.required],
    });
  }

  addTeam():void {
    if (this.teamForm.valid) {
      const newTeam: ITeam = this.teamForm.value as ITeam;
      this.teamService.addTeam(newTeam).subscribe(
        (addedTeam: ITeam) => {
          console.log('Toegevoegd team:', addedTeam);
          this.router.navigateByUrl('/');
        },
        (error: any) => {
          console.error('Fout bij het toevoegen van het team:', error);
        }
      );
    }
  }
}