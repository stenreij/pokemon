import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsEnum,
    IsOptional,
    IsBoolean,
    IsDate
} from 'class-validator';
import {
    ICreatePokemon,
    IUpdatePokemon,
    IUpsertPokemon,
} from '@pokemon/shared/api';
import { Type } from '@pokemon/shared/api';

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
