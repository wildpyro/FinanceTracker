import { Schema } from 'mongoose';

export interface IPerformance {
    symbol: string;
    yahooSymbol: string;
    lastUpdated: Date;
    created: Date;
    user: string;
    fiftyDayMovingAverage: Number;
    twoHundredDayMovingAverage: Number;
    percentChangeFromTwoHundredDayMVA: Number;
    percentChangeFromFiftyDayMVA: Number;
}
