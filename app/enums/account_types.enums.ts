/**
 * class for account types
 */
class AccountType{
    type: string;

    constructor(type: string) {
        this.type = type;
    }
}

export type AccountTypes = Array<AccountType>;

export const ACCOUNTTYPES: AccountTypes = [
    new AccountType(''),
    new AccountType('open'),
    new AccountType('rsp'),
    new AccountType('tfsa'),
    new AccountType('resp'),
    new AccountType('joint')
];
