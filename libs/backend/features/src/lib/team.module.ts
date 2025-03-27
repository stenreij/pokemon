import { forwardRef, Module } from '@nestjs/common';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './team/team.schema';
import { PokemonModule } from './pokemon.module';
import { UserModule } from './user.module';
import { TokenBlacklistService } from './user/blacklist.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema }
    ]),
    forwardRef(() => PokemonModule),
    UserModule
  ],
  controllers: [TeamController],
  providers: [TeamService, TokenBlacklistService],
  exports: [TeamService],
})

export class TeamModule {}
