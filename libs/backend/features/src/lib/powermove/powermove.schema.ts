import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IPowermove, Type } from '@pokemon/shared/api';

export type PowermoveDocument = Powermove & Document;

@Schema({ versionKey: false})
export class Powermove implements IPowermove {
    @Prop({
        type: Number,
        unique: true,
    })
    powermoveId!: number;
    
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
    type: Type = Type.Normal;

    @Prop({
        required: true,
        type: Number,
    })
    power!: number;

    @Prop({
        required: true,
        type: Number,
    })
    accuracy!: number;
}

export const PowermoveSchema = SchemaFactory.createForClass(Powermove);