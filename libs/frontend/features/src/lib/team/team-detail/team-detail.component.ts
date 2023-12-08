import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPokemon, ITeam } from '@pokemon/shared/api';
import { AuthService } from '../../auth/auth.service';
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

  constructor(private route: ActivatedRoute, private teamService: TeamService, private pokemonService: PokemonService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if(!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
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
      this.pokemonService.list().subscribe((pokemon) => {
        this.pokemon = pokemon?.filter((p) => this.team!.pokemon.some((tp) => tp.pokemonId === p.pokemonId));
      });
    }
  }
  

  removePokemon(pokemon: IPokemon): void {
    if (this.team) {
      const idToUse = pokemon.pokemonId;
      this.team.pokemon = this.team.pokemon.filter((pokemon) => pokemon.pokemonId !== idToUse);
      this.teamService.editTeam(this.team).subscribe(
        (team) => {
          this.team = team;
          this.loadPokemonList();
        },
        (error) => {
          console.log('Er is een fout opgetreden:', error);
        }
      );
    }
    this.loadPokemonList();
  }
}