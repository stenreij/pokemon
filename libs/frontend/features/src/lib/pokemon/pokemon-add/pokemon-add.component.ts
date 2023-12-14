import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PokemonService } from '../pokemon.service';
import { Router } from '@angular/router'
import { IPokemon, IUser } from '@pokemon/shared/api';
import { Type } from '@pokemon/shared/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'pokemon-pokemon-add',
  templateUrl: './pokemon-add.component.html',
  styleUrls: ['./pokemon-add.component.css'],
})
export class PokemonAddComponent {
  pokemonForm: FormGroup;
  loggedInUser: IUser | null = null;

  constructor(private fb: FormBuilder, private pokemonService: PokemonService, private router: Router, private authService: AuthService) {
    this.pokemonForm = this.fb.group({
      name: ['', Validators.required],
      type1: [null, Validators.required],
      type2: [null, Validators.required],
      rating: ['', Validators.required],
      legendary: [false, Validators.required],
      afbeelding: ['', Validators.required],
    });
    this.authService.currentUser$.subscribe((user: IUser | null) => {
      this.loggedInUser = user;
      console.log('Logged in user:', this.loggedInUser);
      this.pokemonForm.get('creator')?.setValue(this.loggedInUser?.userName);
    });
  }

  getTypeOptions(){
    return Object.values(Type);
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