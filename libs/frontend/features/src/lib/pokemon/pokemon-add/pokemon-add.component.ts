import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PokemonService } from '../pokemon.service';
import { Router } from '@angular/router'
import { IPokemon, IPowermove, IUser } from '@pokemon/shared/api';
import { Type } from '@pokemon/shared/api';
import { AuthService } from '../../auth/auth.service';
import { PowermoveService } from '../../powermove/powermove.service';

@Component({
  selector: 'pokemon-pokemon-add',
  templateUrl: './pokemon-add.component.html',
  styleUrls: ['./pokemon-add.component.css'],
})
export class PokemonAddComponent {
  pokemonForm: FormGroup;
  loggedInUser: IUser | null = null;
  powermoves: IPowermove[] | undefined;

  constructor(
    private fb: FormBuilder, 
    private pokemonService: PokemonService, 
    private router: Router, 
    private authService: AuthService,
    private powermoveService: PowermoveService
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
    this.authService.currentUser$.subscribe((user: IUser | null) => {
      this.loggedInUser = user;
      console.log('Logged in user:', this.loggedInUser);
      this.pokemonForm.get('creator')?.setValue(this.loggedInUser?.userName);
    });

    this.loadPowermoves();
  }

  getTypeOptions(){
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

  addPokemon(): void {
    if (!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
    if (this.pokemonForm.valid) {
      if (this.loggedInUser) {
        const newPokemon: IPokemon = { ...this.pokemonForm.value, creator: this.loggedInUser.userName } as IPokemon;
  
        this.pokemonService.addPokemon(newPokemon).subscribe(
          (addedPokemon: IPokemon) => {
            console.log('Toegevoegd pokémon:', addedPokemon);
            this.router.navigateByUrl('/pokemon');
          },
          (error: any) => {
            console.error('Fout bij het toevoegen van pokémon:', error);
          }
        );
      }
    }
  }
}