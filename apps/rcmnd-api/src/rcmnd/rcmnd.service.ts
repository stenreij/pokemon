import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@pokemon/shared/api';

@Injectable()
export class RecommendationService {
  constructor(private readonly neo4jService: Neo4jService) {}

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
}