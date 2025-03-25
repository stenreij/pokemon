import { forwardRef, Module } from '@nestjs/common';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './team/team.schema';
import { PokemonModule } from './pokemon.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema }
    ]),
    forwardRef(() => PokemonModule),
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})

export class TeamModule {}
