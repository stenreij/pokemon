import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../pokemon.service';
import { IPokemon, IPowermove } from '@pokemon/shared/api';
import { AuthService } from '../../auth/auth.service';
import { Type, Role } from '@pokemon/shared/api';
import { PowermoveService } from '../../powermove/powermove.service';

@Component({
  selector: 'pokemon-pokemon-edit',
  templateUrl: './pokemon-edit.component.html',
  styleUrls: ['./pokemon-edit.component.css'],
})
export class PokemonEditComponent implements OnInit {
  pokemonForm: FormGroup;
  pokemon: IPokemon | undefined;
  powermoves: IPowermove[] | undefined;

  constructor(
    private fb: FormBuilder,
    private pokemonService: PokemonService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private powermoveService: PowermoveService,
  ) {
    this.pokemonForm = this.fb.group({
      name: ['', Validators.required],
      type1: [null, Validators.required],
      type2: [null, Validators.required],
      rating: ['', Validators.required],
      legendary: [false, Validators.required],
      afbeelding: ['', Validators.required],
      powermove: [null, Validators.required],
    });
  }

  getTypeOptions() {
    return Object.values(Type);
  }

  loadPowermoves() {
    this.powermoveService.list().subscribe(
      (powermoves: IPowermove[] | null) => {
        this.powermoves = powermoves!;
      },
      (error: any) => {
        console.error('Error loading powermoves:', error);
      }
    );
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
    this.loadPowermoves();
    this.route.paramMap.subscribe((params) => {
      const pokemonId = params.get('id');
      if (pokemonId) {
        this.pokemonService.read(pokemonId).subscribe((pokemon) => {
          this.pokemon = pokemon;
          this.pokemonForm.patchValue({
            name: pokemon.name,
            type1: pokemon.type1,
            type2: pokemon.type2,
            rating: pokemon.rating,
            legendary: pokemon.legendary,
            afbeelding: pokemon.afbeelding,
            powermove: pokemon.powermove,
          });
          if (this.authService.currentUser$.value?.role !== Role.ADMIN && this.authService.currentUser$.value?.userName !== pokemon.creator) {
            this.router.navigateByUrl('/pokemon'); 
            console.log(this.authService.currentUser$.value?.role + ", " + this.authService.currentUser$.value?.userName + ": " + pokemon.creator)
          }
        });
      }
    });
  }

  editPokemon(): void {
    if (this.pokemonForm.valid && this.pokemon) {
      const newPokemon: IPokemon = this.pokemonForm.value as IPokemon;
      newPokemon.pokemonId = this.pokemon.pokemonId;
      this.pokemonService.editPokemon(newPokemon).subscribe(
        (editedPokemon: IPokemon) => {
          console.log('Bewerkt pokemon:', editedPokemon);
          this.router.navigateByUrl('/pokemon/' + editedPokemon.pokemonId);
        },
        (error: any) => {
          console.error('Fout bij het bewerken van de pokémon:', error);
        }
      );
    }
  }
}
