import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon/pokemon.controller';
import { PokemonService } from './pokemon/pokemon.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './pokemon/pokemon.schema';
import { TeamModule } from './team.module';
import { Team, TeamSchema } from './team/team.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pokemon.name, schema: PokemonSchema },
      { name: Team.name, schema: TeamSchema}
    ]),
    TeamModule,
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [PokemonService],
})

export class PokemonModule {}
