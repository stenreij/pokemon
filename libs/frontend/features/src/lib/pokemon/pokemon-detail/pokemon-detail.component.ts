import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPokemon, ITeam, Role } from '@pokemon/shared/api';
import { PokemonService } from '../pokemon.service';
import { TeamService } from '../../team/team.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css'],
})
export class PokemonDetailComponent implements OnInit {
  pokemon: IPokemon | undefined;
  teams: ITeam[] | null = null;
  selectedTeam: ITeam | null = null;
  selectedPokemon: IPokemon | null = null;
  user= this.authService.currentUser$.value?.userName;

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService, public teamService: TeamService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if(!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
    this.route.paramMap.subscribe((params) => {
      const pokemonId = params.get('id');
      if (pokemonId) {
        this.pokemonService.read(pokemonId).subscribe((pokemon) => {
          this.pokemon = pokemon;
        });
      }
    });
  }

  verwijderPokemon(pokemonId: number): void {
    this.pokemonService.delete(pokemonId).subscribe(
      () => {
        this.pokemon = undefined;
        this.router.navigateByUrl('/pokemon');
      },
      (error) => {
        console.log('Er is een fout opgetreden:', error);
      }
    )
  }

  isAdmin(): boolean {
    const user = this.authService.currentUser$.value;
    return user?.role === Role.ADMIN;
  }

  openPopup() {
    if (this.pokemon) {
      this.selectedPokemon = this.pokemon;
      this.teamService.list().subscribe((teams) => {
        this.teams = teams;
        this.selectedTeam = null;
        this.teamService.openPopup();
      });
    }
  }  
}