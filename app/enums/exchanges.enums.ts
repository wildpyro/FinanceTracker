import * as _ from 'lodash';

/**
 * class to hold stock exchange to yahoo exchange sybmol
 */
class Exchange {
	exchange: string;
	yahooExchange: string;

	constructor(exchange: string, yahooExchange: string) {
		this.exchange = exchange;
		this.yahooExchange = yahooExchange;
	}
}

export type Exchanges = Array<Exchange>;

export const EXCHANGES: Exchanges = [
	new Exchange('', ''),
	new Exchange('TSX', 'TO'),
	new Exchange('TSX-V', 'V'),
	new Exchange('NYSE', ''),
	new Exchange('Funds', '')
];

/**
 * Get exchange by yahoo code
 * @param yahooCode
 */
export function getByYahooCode(yahooCode: string): string {

	let foundExchange = _.filter(EXCHANGES, function (i) {
		if (i.yahooExchange === yahooCode) {
			return i;
		}
	});

	let returnVal = '';
	if (foundExchange !== undefined && foundExchange.length > 0) {
		returnVal = foundExchange[0].exchange;
	}

	return returnVal;
};

/**
 * Get by exchange code
 * @param exchangeCode
 */
export function getByExchangeCode(exchangeCode: string): string {

	let foundExchange = _.filter(EXCHANGES, function (i) {
		if (i.exchange === exchangeCode) {
			return i;
		}
	});

	let returnVal = '';
	if (foundExchange !== undefined && foundExchange.length > 0) {
		returnVal = foundExchange[0].yahooExchange;
	}

	return returnVal;
};
