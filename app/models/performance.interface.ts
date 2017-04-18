import { Schema } from 'mongoose';

export interface IPerformance {
    symbol?: string;
    yahooSymbol?: string;
    lastUpdated: Date;
    created: Date;
    user: String;
    fiftyDayMovingAverage: Number;
    twoHundredDayMovingAverage: Number;
    percentChangeFromTwoHundredDayMVA: Number;
    percentChangeFromFiftyDayMVA: Number;
}
