import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamModule } from '@pokemon/backend/features';
import { PokemonModule } from '@pokemon/backend/features';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IEnvironment } from 'libs/shared/util-env/src/lib/environment.interface';

@Module({
  imports: [TeamModule, PokemonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
