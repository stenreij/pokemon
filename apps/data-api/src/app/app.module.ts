import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamModule, UserModule } from '@pokemon/backend/features';
import { PokemonModule } from '@pokemon/backend/features';
import { environment } from '@pokemon/shared/util-env';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TeamModule, PokemonModule,
    MongooseModule.forRoot(environment.MONGO_DB_CONNECTION_STRING, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          Logger.verbose(
            `Mongoose connected to DB ${environment.MONGO_DB_CONNECTION_STRING}`
          );
        });
        connection._events.connected();
        return connection;
      },
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
