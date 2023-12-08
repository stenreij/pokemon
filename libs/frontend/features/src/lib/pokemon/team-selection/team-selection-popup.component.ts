import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPokemon, ITeam } from '@pokemon/shared/api';
import { TeamService } from '../../team/team.service';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'pokemon-team-selection-popup',
  templateUrl: './team-selection-popup.component.html',
  styleUrls: ['./team-selection-popup.component.css']
})
export class PopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Input() selectedPokemon: IPokemon | null = null;
  @Output() selectedTeam: ITeam | null = null;
  teams: ITeam[] | null = null;
  team: ITeam | null = null;
  errorMessage: string | null = null;

  constructor(public teamService: TeamService, private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    if(!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
    this.teamService.list().subscribe((teams) => {
      this.teams = teams;
      console.log('teamService POPUP: ', this.teamService);
    });
  }

  addPokemonToTeam() {
    if (this.selectedTeam && this.selectedPokemon) {
      const selectedPokemon: IPokemon = this.selectedPokemon;  
      if (this.selectedTeam.pokemon.length < 6) {
        const isPokemonAlreadyInTeam = this.selectedTeam.pokemon.find(pokemon => pokemon.pokemonId === selectedPokemon.pokemonId);
        if (!isPokemonAlreadyInTeam) {
          this.selectedTeam.pokemon.push(selectedPokemon);
          this.teamService.editTeam(this.selectedTeam).subscribe(
            (team) => {
              this.selectedTeam = team;
  
              console.log('Pokemon in team:', this.selectedTeam.pokemon);
              console.log('Geselecteerde team:', this.selectedTeam.teamName);
              console.log('Geselecteerde Pokémon:', this.selectedPokemon?.name);
  
              this.teamService.closePopup();
              this.router.navigate(['/team', this.selectedTeam.teamId]);
            },
            (error) => {
              console.error('Fout bij het bijwerken van het team:', error);
              this.errorMessage = 'Fout bij het bijwerken van het team!';        }
          );
        } else {
          console.error('Deze Pokémon zit al in dit team!');
          this.errorMessage = 'Deze Pokémon zit al in dit team!';
        }
      } else {
        console.error('Het maximale aantal Pokémon in dit team is bereikt!');
        this.errorMessage = 'Het maximale aantal Pokémon in dit team is bereikt!';
      }
    }
  }  

  close() {
    this.teamService.closePopup();
  }
}
