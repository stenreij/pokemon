import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IPokemon, ITeam } from '@pokemon/shared/api';

export type TeamDocument = Team & Document;

@Schema({ versionKey: false})
export class Team implements ITeam {
    @Prop({
        type: Number,
        unique: true,
    })
    teamId!: number;

    @Prop({ 
        required: true,
        type: String,
     })
     teamName!: string;

    @Prop({
        required: true,
        type: String,
    })
    teamInfo!: string;

    @Prop({
        required: true,
    })
    trainer!: number;

    @Prop({
        required: true,
        type: Number,
        default: 0,
    })
    rating!: number;

    @Prop({
        required: true,
        type: [],
    })
    pokemon!: IPokemon[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);