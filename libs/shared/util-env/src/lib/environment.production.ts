import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: true,
    lclApiUrl: 'http://localhost:3000/api',
    onlineApiUrl: 'https://pokemon-cswf.azurewebsites.net/api',
}