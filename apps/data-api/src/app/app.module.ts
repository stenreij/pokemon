import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamModule, UserModule } from '@pokemon/backend/features';
import { PokemonModule } from '@pokemon/backend/features';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TeamModule, PokemonModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
