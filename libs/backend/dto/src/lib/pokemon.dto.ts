import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsBoolean,
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

    @IsString()
    @IsNotEmpty()
    creator!: string;

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

    @IsString()
    @IsNotEmpty()
    creator!: string;

    @IsString()
    @IsNotEmpty()
    powermove!: IPowermove;
}

export class UpdatePokemonDto implements IUpdatePokemon {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    type1?: Type;

    @IsString()
    @IsNotEmpty()
    type2?: Type;

    @IsNumber()
    @IsNotEmpty()
    rating?: number;

    @IsBoolean()
    @IsNotEmpty()
    legendary?: boolean;

    @IsString()
    @IsNotEmpty()
    afbeelding?: string;
}
