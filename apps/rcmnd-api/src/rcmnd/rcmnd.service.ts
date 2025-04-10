import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@pokemon/shared/api';

@Injectable()
export class RecommendationService {
  constructor(private readonly neo4jService: Neo4jService) { }

  async getPokemonByTypeAndMove(type: string, move: string, excludeId?: string) {
    let query = `
      MATCH (pokemon:Pokémon)-[:HAS_TYPE]->(t:Type {name: $type})
      MATCH (pokemon)-[:HAS_MOVE]->(m:Move {name: $move})
    `;

    if (excludeId) {
      query += `
        WHERE pokemon.pokemonId <> toInteger($excludeId)
      `;
    }

    query += `
      RETURN pokemon.pokemonId as id, pokemon.name as name, pokemon.rating as rating, m.name as powermove, t.name as type
      LIMIT 5
    `;

    const params: any = { type, move };
    if (excludeId) {
      params.excludeId = excludeId;
    }

    const result = await this.neo4jService.runQuery(query, params);

    return result?.map(record => ({
      id: record.get('id'),
      name: record.get('name'),
      type: record.get('type'),
      powermove: record.get('powermove'),
      rating: record.get('rating'),

    })) || [];
  }

  async getPokemonByTypeAndMoveAndRating(type: string, move: string, rating: string, excludeId?: string) {
    const numericRating = parseFloat(rating);
  
    let query = `
      MATCH (pokemon:Pokémon)-[:HAS_TYPE]->(t:Type {name: $type})
      MATCH (pokemon)-[:HAS_MOVE]->(m:Move {name: $move})
      WHERE pokemon.rating >= $rating - 200 AND pokemon.rating <= $rating + 200
    `;
  
    if (excludeId) {
      query += ` AND pokemon.pokemonId <> toInteger($excludeId) `;
    }
  
    query += `
      RETURN pokemon.pokemonId as id, pokemon.name as name, pokemon.rating as rating, m.name as powermove, t.name as type
      LIMIT 5
    `;
  
    const params: any = { type, move, rating: numericRating };
    if (excludeId) {
      params.excludeId = excludeId;
    }
  
    const result = await this.neo4jService.runQuery(query, params);
    return result?.map(record => ({
      id: record.get('id'),
      name: record.get('name'),
      type: record.get('type'),
      powermove: record.get('powermove'),
      rating: record.get('rating'),
    })) || [];
  }
  

  async getPokemonByType(type: string, excludeId?: string) {
    let query = `
      MATCH (similar:Pokémon)-[:HAS_TYPE]->(t:Type {name: $type})
      `;
    ;

    if (excludeId) {
      query += `
      WHERE similar.pokemonId <> toInteger($excludeId)
      `
        ;
    }

    query += `
    RETURN similar.pokemonId as id, similar.name as name, similar.powermove as powermove, similar.rating as rating, t.name as type
      LIMIT 5
      `;

    const params: any = { type };
    if (excludeId) {
      params.excludeId = excludeId;
    }

    const result = await this.neo4jService.runQuery(query, params);



    return result?.map(record => ({
      id: record.get('id'),
      name: record.get('name'),
      type: record.get('type'),
      powermove: record.get('powermove'),
      rating: record.get('rating'),
    })) || [];
  }


  async getPokemonByMove(move: string, excludeId?: string) {
    let query = `
      MATCH (pokemon:Pokémon)-[:HAS_MOVE]->(m:Move {name: $move})
      `;

    if (excludeId) {
      query += `
      WHERE pokemon.pokemonId <> toInteger($excludeId)
      `;
    }

    query += `
      RETURN pokemon.pokemonId as id, pokemon.name as name, pokemon.rating as rating, m.name as powermove
      LIMIT 5
    `;

    const params: any = { move };
    if (excludeId) {
      params.excludeId = excludeId;
    }

    const result = await this.neo4jService.runQuery(query, params);

    return result?.map(record => ({
      id: record.get('id'),
      name: record.get('name'),
      powermove: record.get('powermove'),
      rating: record.get('rating'),
    })) || [];
  }

}