import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../team.service';
import { ITeam } from '@pokemon/shared/api';

@Component({
  selector: 'pokemon-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.css'],
})
export class TeamEditComponent implements OnInit {
  teamForm: FormGroup;
  team: ITeam | undefined;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      trainer: ['', Validators.required],
      teamInfo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
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
    if (this.teamForm.valid && this.team) {
      const newTeam: ITeam = this.teamForm.value as ITeam;
      newTeam.teamId = this.team.teamId;
      this.teamService.editTeam(newTeam).subscribe(
        (editedTeam: ITeam) => {
          console.log('Bewerkt team:', editedTeam);
          this.router.navigateByUrl('/');
        },
        (error: any) => {
          console.error('Fout bij het bewerken van het team:', error);
        }
      );
    }
  }
}
