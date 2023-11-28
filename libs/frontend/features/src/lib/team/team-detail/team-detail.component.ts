import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  team: ITeam | null = null;
  pokemon: IPokemon[] | undefined;
  subscription: Subscription | undefined = undefined;

  constructor(private route: ActivatedRoute, private teamService: TeamService, private pokemonService: PokemonService, private router: Router) { }

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

  verwijderTeam(teamId: number): void {
    this.teamService.delete(teamId).subscribe(
      () => {
        this.team = null;
        this.router.navigateByUrl('/');
      },
      (error) => {
        console.log('Er is een fout opgetreden:', error);
      }
    )
  }

  loadPokemonList(): void {
    if (this.team) {
      this.pokemonService.list().subscribe((allPokemon) => {
        this.pokemon = allPokemon?.filter((p) => this.team?.pokemon.map(tp => tp.pokemonId).includes(p.pokemonId));
      });
    }
  }

  removePokemon(pokemonId: IPokemon): void {
    if (this.team) {
      this.team.pokemon = this.team.pokemon.filter((p) => p !== pokemonId);
      this.teamService.editTeam(this.team).subscribe((team) => {
        this.team = team;
        team.rating -= pokemonId.rating;
        this.loadPokemonList();
      });
    }
  }
}