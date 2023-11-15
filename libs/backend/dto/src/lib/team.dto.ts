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

    @IsNumber()
    @IsNotEmpty()
    rating!: number;

    @IsString()
    @IsNotEmpty()
    trainer!: string;
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
