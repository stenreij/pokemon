import { Module } from '@nestjs/common';
import { Neo4jService } from '@pokemon/shared/api';
import { RecommendationController } from './rcmnd/rcmnd.controller';
import { RecommendationService } from './rcmnd/rcmnd.service';

@Module({
  controllers: [RecommendationController],
  providers: [RecommendationService, Neo4jService],
})
export class RecommendationModule {}