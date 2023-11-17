import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITeam } from '@pokemon/shared/api';
import { TeamService } from '../team.service';

@Component({
  selector: 'pokemon-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css'],
})
export class TeamDetailComponent implements OnInit {
  team: ITeam | undefined;

  constructor(private route: ActivatedRoute, private teamService: TeamService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const teamId = params.get('id');
      if (teamId) {
        this.teamService.read(teamId).subscribe((team) => {
          this.team = team;
        });
      }
    });
  }
}