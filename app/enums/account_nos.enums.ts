/**
 * currently this is not used.
 */

import { getAccountNos } from '../controllers/account.controller';

/**
 * class for account types
 */
class AccountNo{
    code: string;
    type: string;

    constructor(code: string, type: string) {
        this.code = code;
        this.type = type;
    }
}

export type AccountNos = Array<AccountNo>;