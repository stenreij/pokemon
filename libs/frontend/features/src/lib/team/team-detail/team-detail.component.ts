import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPokemon, ITeam } from '@pokemon/shared/api';
import { Subscription } from 'rxjs';
import { PokemonService } from '../../pokemon/pokemon.service';
import { TeamService } from '../team.service';

@Component({
  selector: 'pokemon-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css'],
})
export class TeamDetailComponent implements OnInit {
  team: ITeam | undefined;
  pokemon: IPokemon[] | undefined;
  subscription: Subscription | undefined = undefined;

  constructor(private route: ActivatedRoute, private teamService: TeamService, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const teamId = params.get('id');
      if (teamId) {
        this.teamService.read(teamId).subscribe((team) => {
          this.team = team;

          this.loadPokemonList();
        });
      }
    });
  }

  loadPokemonList(): void {
    if (this.team) {
      this.pokemonService.list().subscribe((pokemon) => {
        this.pokemon = pokemon?.filter((p) => this.team?.pokemon.includes(p.pokemonId));
      });
    }
  }

  removePokemon(pokemonId: number): void {
    if (this.team) {
      this.team.pokemon = this.team.pokemon.filter((p) => p !== pokemonId);
      this.teamService.editTeam(this.team).subscribe((team) => {
        this.team = team;
        this.loadPokemonList();
      });
    }
  }
}