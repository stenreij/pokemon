import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { environment } from '@pokemon/shared/util-env'
//import { Neo4jBackendModule } from '@pokemon/backend/neo4j'
//import { Neo4jModule } from 'nest-neo4j/dist'

@Module({
  imports: [
    //Neo4jModule.forRoot({
      //scheme: 'neo4j+s',
      //host: environment.NEO4J_DB_HOST,
      //port: environment.NEO4J_DB_PORT,
      //username: environment.NEO4J_DB_USER,
      //password: environment.NEO4J_DB_PASSWORD,
    //}),
    //Neo4jBackendModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
