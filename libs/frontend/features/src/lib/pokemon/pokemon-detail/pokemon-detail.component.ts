import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPokemon } from '@pokemon/shared/api';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css'],
})
export class PokemonDetailComponent implements OnInit {
  pokemon: IPokemon | undefined;

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const pokemonId = params.get('id');
      if (pokemonId) {
        this.pokemonService.read(pokemonId).subscribe((pokemon) => {
          this.pokemon = pokemon;
        });
      }
    });
  }
}