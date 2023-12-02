import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IPokemon, Type } from '@pokemon/shared/api';

export type PokemonDocument = Pokemon & Document;

@Schema({ versionKey: false})
export class Pokemon implements IPokemon {
    @Prop({
        type: Number,
        unique: true,
    })
    pokemonId!: number;

    @Prop({ 
        required: true,
        type: String,
     })
     name!: string;

    @Prop({
        required: true,
        type: String,
        default: Type.Normal,
    })
    type1: Type = Type.Normal;

    @Prop({
        required: true,
        type: String,
        default: Type.Normal,
    })
    type2: Type = Type.Normal;

    @Prop({
        required: true,
        type: Number,
    })
    rating: number = 100;

    @Prop({
        required: true,
        type: Boolean,
        default: false,
    })
    legendary!: false;

    @Prop({
        required: true,
        type: String,
    })
    afbeelding!: string;

}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);