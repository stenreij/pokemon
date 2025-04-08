import{
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsDate,
    IsArray,
}from 'class-validator';
import{
    ICreateUser,
    ITeam,
    IUpdateUser,
    IUpsertUser,
    Role,
    Id,
}from '@pokemon/shared/api';
export class CreateUserDto implements ICreateUser{
    @IsString()
    @IsNotEmpty()
    userName!:string;

    @IsString()
    @IsNotEmpty()
    email!:string;

    @IsString()
    @IsNotEmpty()
    password!:string;

    @IsString()
    @IsNotEmpty()
    role!:Role;

    @IsDate()
    @IsNotEmpty()
    birthDate!:Date;
}
export class UpdateUserDto implements IUpdateUser{
    @IsOptional()
    @IsString()
    userName?:string;

    @IsOptional()
    @IsString()
    email?:string;

    @IsOptional()
    @IsString()
    password?:string;

    @IsOptional()
    @IsString()
    role?:Role;

    @IsOptional()
    @IsDate()
    birthDate?:Date;
}
export class UpsertUserDto implements IUpsertUser{
    @IsNumber()
    @IsNotEmpty()
    userId!: Id;

    @IsString()
    @IsNotEmpty()
    userName!:string;

    @IsString()
    @IsNotEmpty()
    email!:string;
    
    @IsString()
    @IsNotEmpty()
    password!:string;

    @IsString()
    @IsNotEmpty()
    role!:Role;

    @IsDate()
    @IsNotEmpty()
    birthDate!:Date;

    @IsArray()
    @IsNotEmpty()
    teams!:ITeam[];

}
