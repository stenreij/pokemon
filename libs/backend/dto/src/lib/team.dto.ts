import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsBoolean,
    IsDate,
    IsArray,
    ArrayMinSize,
    ArrayMaxSize
} from 'class-validator';
import {
    ICreateTeam,
    IPokemon,
    IUpdateTeam,
    IUpsertTeam,
} from '@pokemon/shared/api';

export class CreateTeamDto implements ICreateTeam {
    @IsString()
    @IsNotEmpty()
    teamName!: string;

    @IsString()
    @IsOptional()
    trainer!: number;

    @IsNumber()
    @IsNotEmpty()
    teamInfo!: string;
    
    @IsArray()
    @ArrayMinSize(0)
    @ArrayMaxSize(6)
    pokemon!: Array<IPokemon>;
}

export class UpsertTeamDto implements IUpsertTeam {
    @IsNumber()
    @IsNotEmpty()
    teamId!: number;

    @IsString()
    @IsNotEmpty()
    teamName!: string;

    @IsNumber()
    @IsNotEmpty()
    rating!: number;

    @IsNumber()
    @IsOptional()
    trainer!: number;

    @IsString()
    @IsNotEmpty()
    teamInfo!: string;

    @IsArray()
    @ArrayMinSize(0)
    @ArrayMaxSize(6)
    pokemon!: Array<IPokemon>;
}

export class UpdateTeamDto implements IUpdateTeam {
    @IsString()
    @IsNotEmpty()
    teamName?: string;

    @IsNumber()
    @IsNotEmpty()
    rating?: number;

    @IsNumber()
    @IsOptional()
    trainer?: number;
}
