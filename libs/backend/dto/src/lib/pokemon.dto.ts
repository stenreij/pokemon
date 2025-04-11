import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsBoolean,
    IsOptional,
} from 'class-validator';
import {
    ICreatePokemon,
    IPowermove,
    IUpdatePokemon,
    IUpsertPokemon,
} from '@pokemon/shared/api';
import { Type } from '@pokemon/shared/api';
import { StringExpressionOperatorReturningBoolean } from 'mongoose';

export class CreatePokemonDto implements ICreatePokemon {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    type1!: Type;

    @IsString()
    @IsNotEmpty()
    type2!: Type;

    @IsNumber()
    @IsNotEmpty()
    rating!: number;

    @IsBoolean()
    @IsNotEmpty()
    legendary!: boolean;

    @IsString()
    @IsNotEmpty()
    afbeelding!: string;

    @IsNumber()
    @IsOptional()
    creator!: number;

    @IsString()
    powermove!: IPowermove;
}

export class UpsertPokemonDto implements IUpsertPokemon {
    @IsNumber()
    @IsNotEmpty()
    pokemonId!: number;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    type1!: Type;

    @IsString()
    @IsNotEmpty()
    type2!: Type;

    @IsNumber()
    @IsNotEmpty()
    rating!: number;

    @IsBoolean()
    @IsNotEmpty()
    legendary!: boolean;

    @IsString()
    @IsNotEmpty()
    afbeelding!: string;

    @IsNumber()
    @IsOptional()
    creator!: number;

    @IsString()
    @IsNotEmpty()
    powermove!: IPowermove;
}

export class UpdatePokemonDto implements IUpdatePokemon {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    type1?: Type;

    @IsString()
    @IsOptional()
    type2?: Type;

    @IsNumber()
    @IsOptional()
    rating?: number;

    @IsBoolean()
    @IsOptional()
    legendary?: boolean;

    @IsString()
    @IsOptional()
    afbeelding?: string;

    @IsString()
    @IsOptional()
    powermove?: IPowermove;
}
