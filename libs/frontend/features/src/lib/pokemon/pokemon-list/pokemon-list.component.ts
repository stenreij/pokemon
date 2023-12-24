import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { IPokemon, ITeam, Role } from '@pokemon/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TeamService } from '../../team/team.service';
import { AuthService } from '../../auth/auth.service';

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
  user= this.authService.currentUser$.value?.userName;

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    public teamService: TeamService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
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

  verwijderPokemon(pokemonId: number): void {
    const bevestigen = window.confirm('Weet je zeker dat je deze Pokémon wilt verwijderen?');
  
    if (bevestigen) {
      this.pokemonService.delete(pokemonId).subscribe(
        () => {
          this.herlaadPokemonLijst();
        },
        (error) => {
          console.log('Er is een fout opgetreden bij het verwijderen van de Pokémon:', error);
        }
      );
    }
  }
  
  private herlaadPokemonLijst(): void {
    this.pokemonService.list().subscribe(
      (resultaten) => {
        this.pokemon = resultaten;
      },
      (error) => {
        console.log('Er is een fout opgetreden bij het ophalen van de Pokémon-lijst:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  openPopup(pokemon: IPokemon) {
    this.selectedPokemon = pokemon;
    this.teamService.list().subscribe((teams) => {
      this.teams = teams;
      this.selectedTeam = null;
      this.teamService.openPopup();
    });
  }

  closePopup() {
    this.teamService.closePopup();
  }

  isAdmin(): boolean {
    const user = this.authService.currentUser$.value;
    return user?.role === Role.ADMIN;
  }
}
