export interface IEnvironment {
    production: boolean;
    lclApiUrl: string;
    onlineApiUrl: string;
    MONGO_DB_CONNECTION_STRING: string;
    JWT_SECRET_KEY: string,
}