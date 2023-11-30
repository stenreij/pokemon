 export interface IUserCredentials {
    email: string;
    password: string;
}

export interface IUserRegistration extends IUserCredentials {
    userName: string;
}

export interface IToken {
    token: string;
}