import { forwardRef, Module } from '@nestjs/common';
import { PokemonController } from './pokemon/pokemon.controller';
import { PokemonService } from './pokemon/pokemon.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './pokemon/pokemon.schema';
import { TeamModule } from './team.module';
import { Team, TeamSchema } from './team/team.schema';
import { UserModule } from './user.module';
import { Neo4jService } from '@pokemon/shared/api';
import { RecommendationClientService } from './rcmnd/rcmndClient.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pokemon.name, schema: PokemonSchema },
      { name: Team.name, schema: TeamSchema}
    ]),
    forwardRef(() => TeamModule),
    UserModule, HttpModule
  ],
  controllers: [PokemonController],
  providers: [PokemonService, Neo4jService, RecommendationClientService],
  exports: [PokemonService, MongooseModule],
})

export class PokemonModule {}
