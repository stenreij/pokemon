import { Id } from './id.type';
import { Type } from './type.enum';


export interface IPowermove {
    powermoveId: Id;
    name: string;
    type: Type;
    power: number;
    accuracy: number;
    creator: number;
}

export type ICreatePowermove = Pick<
    IPowermove,
    'name' | 'type' | 'power' | 'accuracy'
>;
export type IUpdatePowermove = Partial<Omit<IPowermove, 'powermoveId'>>;
export type IUpsertPowermove = IPowermove;