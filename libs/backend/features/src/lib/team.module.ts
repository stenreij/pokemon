import { Module } from '@nestjs/common';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})

export class BackendFeaturesMealModule {}
