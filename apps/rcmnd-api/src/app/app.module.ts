import { Module } from '@nestjs/common';
import { Neo4jModule } from '@pokemon/shared/api';
import { RecommendationModule } from '../rcmnd.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [RecommendationModule, Neo4jModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
