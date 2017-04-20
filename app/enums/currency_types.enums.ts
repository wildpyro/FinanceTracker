/**
 * class to hold different currencies
 */
class CurrencyType{
    code: string;

    constructor(code: string) {
        this.code = code;
    }
}

export type CurrencyTypes = Array<CurrencyType>;

export const CURRENCYTYPES: CurrencyTypes = [
    new CurrencyType('CAD'),
    new CurrencyType('USD')
];