import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsBoolean,
    IsDate
} from 'class-validator';
import {
    ICreateTeam,
    IUpdateTeam,
    IUpsertTeam,
} from '@pokemon/shared/api';

export class CreateTeamDto implements ICreateTeam {
    @IsString()
    @IsNotEmpty()
    teamName!: string;

    @IsString()
    @IsNotEmpty()
    trainer!: string;

    @IsString()
    @IsNotEmpty()
    teamInfo!: string;
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

    @IsString()
    @IsNotEmpty()
    trainer!: string;

    @IsString()
    @IsNotEmpty()
    teamInfo!: string;
}

export class UpdateTeamDto implements IUpdateTeam {
    @IsString()
    @IsNotEmpty()
    teamName?: string;

    @IsNumber()
    @IsNotEmpty()
    rating?: number;

    @IsString()
    @IsNotEmpty()
    trainer?: string;
}
