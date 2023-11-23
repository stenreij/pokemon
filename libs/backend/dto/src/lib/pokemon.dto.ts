import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsBoolean,
    IsDate
} from 'class-validator';
import {
    ICreatePokemon,
    IUpdatePokemon,
    IUpsertPokemon,
} from '@pokemon/shared/api';

export class CreatePokemonDto implements ICreatePokemon {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    type1!: string;

    @IsString()
    @IsNotEmpty()
    type2!: string;

    @IsNumber()
    @IsNotEmpty()
    rating!: number;

    @IsBoolean()
    @IsNotEmpty()
    legendary!: boolean;

    @IsString()
    @IsNotEmpty()
    img!: string;
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
    type1!: string;

    @IsString()
    @IsNotEmpty()
    type2!: string;

    @IsNumber()
    @IsNotEmpty()
    rating!: number;

    @IsBoolean()
    @IsNotEmpty()
    legendary!: boolean;

    @IsString()
    @IsNotEmpty()
    img!: string;
}

export class UpdatePokemonDto implements IUpdatePokemon {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    type1?: string;

    @IsString()
    @IsNotEmpty()
    type2?: string;

    @IsNumber()
    @IsNotEmpty()
    rating?: number;

    @IsBoolean()
    @IsNotEmpty()
    legendary?: boolean;

    @IsString()
    @IsNotEmpty()
    img?: string;
}
