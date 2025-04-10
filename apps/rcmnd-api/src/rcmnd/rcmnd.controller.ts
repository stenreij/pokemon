import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendationService } from './rcmnd.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) { }

  @Get('type/:type')
  async getByGenre(
    @Param('type') type: string,
    @Query('excludeId') excludeId?: string
  ) {
    return this.recommendationService.getPokemonByType(type, excludeId);
  }

  @Get('move/:move')
  async getByMove(
    @Param('move') move: string,
    @Query('excludeId') excludeId?: string
  ) {
    return this.recommendationService.getPokemonByMove(move, excludeId);
  }

  @Get('type-and-move')
  async getByTypeAndMove(
    @Query('type') type: string,
    @Query('move') move: string,
    @Query('excludeId') excludeId?: string
  ) {
    return this.recommendationService.getPokemonByTypeAndMove(type, move, excludeId);
  }

  @Get('type-and-move-with-rating')
  async getByTypeAndMoveWithRating(
    @Query('type') type: string,
    @Query('move') move: string,
    @Query('rating') rating: string,
    @Query('excludeId') excludeId?: string
  ) {
    return this.recommendationService.getPokemonByTypeAndMoveAndRating(type, move, rating, excludeId);
  }

}