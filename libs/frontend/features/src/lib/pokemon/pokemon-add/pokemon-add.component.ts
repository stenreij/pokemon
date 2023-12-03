import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PokemonService } from '../pokemon.service';
import { Router } from '@angular/router'
import { IPokemon } from '@pokemon/shared/api';
import { Type } from 'libs/shared/api/src/lib/models/type.enum';

@Component({
  selector: 'pokemon-pokemon-add',
  templateUrl: './pokemon-add.component.html',
  styleUrls: ['./pokemon-add.component.css'],
})
export class PokemonAddComponent {
  pokemonForm: FormGroup;

  constructor(private fb: FormBuilder, private pokemonService: PokemonService, private router: Router) {
    this.pokemonForm = this.fb.group({
      name: ['', Validators.required],
      type1: [null, Validators.required],
      type2: [null, Validators.required],
      rating: ['', Validators.required],
      legendary: [false, Validators.required],
      afbeelding: ['', Validators.required],
    });
  }

  getTypeOptions(){
    return Object.values(Type);
  }

  addPokemon():void {
    if (this.pokemonForm.valid) {
      const newPokemon: IPokemon = this.pokemonForm.value as IPokemon;
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