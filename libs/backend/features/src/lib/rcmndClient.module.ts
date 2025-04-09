import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RecommendationClientService } from '../lib/rcmnd/rcmndClient.service';

@Module({
  imports: [HttpModule], 
  providers: [RecommendationClientService],
  exports: [RecommendationClientService], 
})
export class RcmndClientModule {}