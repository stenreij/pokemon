import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BackendFeaturesMealModule } from '@pokemon/backend/features';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IEnvironment } from 'libs/shared/util-env/src/lib/environment.interface';

@Module({
  imports: [BackendFeaturesMealModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
