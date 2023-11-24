import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPokemon, ITeam } from '@pokemon/shared/api';
import { TeamService } from '../../team/team.service';

@Component({
  selector: 'pokemon-team-selection-popup',
  templateUrl: './team-selection-popup.component.html',
  styleUrls: ['./team-selection-popup.component.css']
})
export class PopupComponent implements OnInit{
  @Output() closePopup = new EventEmitter<void>();
  teams: ITeam[] | null = null;
  selectedTeam: any;

  constructor(public teamService: TeamService) {
  }
  ngOnInit(): void {
    this.teamService.list().subscribe((teams) => {
      this.teams = teams;

      console.log('teamService POPUP: ', this.teamService);
    });
  }


  close() {
    this.teamService.closePopup();
  }
}
