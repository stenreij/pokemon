import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../team.service';
import { Router } from '@angular/router'
import { ITeam } from '@pokemon/shared/api';
import { isEmpty, isNotEmpty } from 'class-validator';

@Component({
  selector: 'pokemon-team-add',
  templateUrl: './team-add.component.html',
  styleUrls: ['./team-add.component.css'],
})
export class TeamAddComponent {
  teamForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private teamService: TeamService, private router: Router) {
    this.teamForm = this.fb.group({
      teamName: [null, [Validators.required, Validators.maxLength(30)]],
      trainer: ['', [Validators.required, Validators.maxLength(30)]],
      teamInfo: ['', [Validators.required, Validators.maxLength(150)]],
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