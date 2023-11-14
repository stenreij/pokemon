import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: false,
    lclApiUrl: 'http://localhost:3000/api/team',
    onlineApiUrl: 'https://pokemon-cswf.azurewebsites.net/api/team',
};