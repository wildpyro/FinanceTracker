import * as _ from 'lodash';

/**
 * class to hold various transaction types and what they map to in the import layouts
 */
class TxnType {
    type: string;
    iTrade: string;

    constructor(type: string, iTrade: string) {
        this.type = type;
        this.iTrade = iTrade;
    }
}

export type TxnTypes = Array<TxnType>;

export const TXNTYPES: TxnTypes = [
    new TxnType('buy', 'BUY'),
    new TxnType('Sell', 'SELL'),
    new TxnType('Dividend', 'STOCKDIV'),
    new TxnType('Drip', 'Drip')
];

export function getTypes(): TxnTypes {
    return TXNTYPES;
};

/**
 * Get type by ITradeType
 */
export function getByITrade(iTradeCode: string): string {

    let iTradeType = _.filter(TXNTYPES, function (i) {
        if (i.ITrade === iTradeCode) {
            return i;
        }
    });

    let returnVal = '';
    if (iTradeType !== undefined && iTradeType.length > 0) {
        returnVal = iTradeType[0].type;
    }

    return returnVal;
};
