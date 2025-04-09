import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendationService } from './rcmnd.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

@Get('type/:type')
async getByGenre(
  @Param('type') type: string,
  @Query('excludeId') excludeId?: string
) {
  return this.recommendationService.getPokemonByType(type, excludeId);
}
}