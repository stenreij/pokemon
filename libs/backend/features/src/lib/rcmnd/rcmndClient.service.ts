import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecommendationClientService {
  private readonly logger = new Logger(RecommendationClientService.name);

  constructor(private readonly httpService: HttpService) {}

  async getRecommendationsByType(type: string, excludeId?: string) {
    try {
      const url = `http://localhost:3100/api/recommendations/type/${type}${excludeId ? `?excludeId=${excludeId}`: ''}`;

      this.logger.debug(`Fetching recommendations from: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 5000,
        })
      );

      this.logger.debug(`Recommendations response: ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (error) {
      const error2 = error as any;
      this.logger.error(`Error fetching recommendations: ${error2.message}`);
      return [];
    }
  }


  async getRecommendationsByTypeAndMoveAndRating(type: string, move: string, rating: number, excludeId?: string) {
    try {
      let url = `http://localhost:3100/api/recommendations/type-and-move-with-rating?type=${type}&move=${move}&rating=${rating}`;

      if (excludeId) {
        url += `&excludeId=${excludeId}`;
      }

      this.logger.debug(`Fetching recommendations from: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 5000,
        })
      );

      this.logger.debug(`Recommendations response: ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (error) {
      const error2 = error as any;
      this.logger.error(`Error fetching recommendations: ${error2.message}`);
      return [];
    }
  }


  async getRecommendationsByTypeAndMove(type: string, move: string,excludeId?: string) {
    try {
      let url = `http://localhost:3100/api/recommendations/type-and-move?type=${type}&move=${move}`;

      if (excludeId) {
        url += `&excludeId=${excludeId}`;
      }

      this.logger.debug(`Fetching recommendations from: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 5000,
        })
      );

      this.logger.debug(`Recommendations response: ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (error) {
      const error2 = error as any;
      this.logger.error(`Error fetching recommendations: ${error2.message}`);
      return [];
    }
  }
}