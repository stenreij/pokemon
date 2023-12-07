import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ITeam, IUser, Role } from '@pokemon/shared/api';

export type UserDocument = User & Document;

@Schema({ versionKey: false})
export class User implements IUser {
    @Prop({
        type: Number,
        unique: true,
        default: () => Math.floor(Math.random() * 1000000),
    })
    userId!: number;

    @Prop({ 
        required: true,
        type: String,
     })
     userName!: string;

    @Prop({
        required: true,
        select: false,
        type: String,
    })
    password!: '';

    @Prop({
        required: true,
        type: String,
        select: true,
        unique: true
    })
    email!: string;

    @Prop({
        required: true,
        type: String,
        default: Role.TRAINER,
    })
    role: Role = Role.TRAINER;

    @Prop({
        required: true,
        type: Date,
    })
    birthDate!: Date;

    @Prop({
        default: [],
        type: [MongooseSchema.Types.ObjectId],
        ref: 'ITeam',
    })
    teams: ITeam[] = [];

}

export const UserSchema = SchemaFactory.createForClass(User);