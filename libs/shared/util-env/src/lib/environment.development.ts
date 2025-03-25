import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: true,
    lclApiUrl: 'http://localhost:3000/api',
    //onlineApiUrl: 'https://pokemon-cswf.azurewebsites.net',
    onlineApiUrl: 'http://localhost:3000/api',
    MONGO_DB_CONNECTION_STRING: 'mongodb+srv://sten:Anstjo94!@pokemon.disyksv.mongodb.net/',
}