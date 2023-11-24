import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { IPokemon, ITeam } from '@pokemon/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TeamService } from '../../team/team.service';

@Component({
  selector: 'pokemon-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemon: IPokemon[] | null = null;
  subscription: Subscription | undefined = undefined;
  teams: ITeam[] | null = null;
  selectedTeam: ITeam | null = null;
  selectedPokemon: IPokemon | null = null; 

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    public teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.subscription = this.pokemonService.list().subscribe((results) => {
        console.log(`results: ${results}`);
      this.pokemon = results;

      this.subscription = this.teamService.list().subscribe((resultss) => {
        console.log(`results: ${resultss}`);
        this.teams = resultss;

        console.log('teamService: ', this.teamService);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  openPopup(pokemon: IPokemon) {
    this.selectedPokemon = pokemon;
    this.teamService.list().subscribe((teams)=>{
        this.teams = teams;
        this.selectedTeam = null;
        this.teamService.openPopup();
    });
  }

  closePopup() {
    this.teamService.closePopup();
  }
}
