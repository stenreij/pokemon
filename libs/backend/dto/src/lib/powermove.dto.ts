import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsBoolean,
    IsOptional,
} from 'class-validator';
import {
    ICreatePowermove,
    IPowermove,
    IUpdatePowermove,
    IUpsertPowermove
}from '@pokemon/shared/api';
import { Type } from '@pokemon/shared/api';

export class CreatePowermoveDto implements ICreatePowermove {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    type!: Type;

    @IsNumber()
    @IsNotEmpty()
    power!: number;

    @IsNumber()
    @IsNotEmpty()
    accuracy!: number;

    @IsString()
    @IsOptional()
    creator!: number;
}

export class UpsertPowermoveDto implements IUpsertPowermove {
    @IsNumber()
    @IsNotEmpty()
    powermoveId!: number;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    type!: Type;

    @IsNumber()
    @IsNotEmpty()
    power!: number;

    @IsNumber()
    @IsNotEmpty()
    accuracy!: number;

    @IsNumber()
    @IsOptional()
    creator!: number;
}

export class UpdatePowermoveDto implements IUpdatePowermove {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    type?: Type;

    @IsNumber()
    @IsNotEmpty()
    power?: number;

    @IsNumber()
    @IsNotEmpty()
    accuracy?: number;
}