import { MissingFieldError } from "@apollo/client";
import { MARKET_DATA_SELECTOR_INFO, PROTOCOL_DATA_SELECTOR_INFO, TOKEN_INFO } from "common/constants";

import { ProtocolDataSelector, MarketDataSelector, Token, EtherscanLinkType, Length, DateFormat } from "common/enums";
import { maxHeaderSize } from "http";
import { textSpanIntersectsWithTextSpan } from "typescript";

/**
 * Convert unix time in ms to a date
 * @param dateInUnixSec the date represented in seconds since unix epoche
 * @param dateFormat format for the date
 * @returns date in string format (ex: May 10, 2021, 1:00 AM)
 */
export function formatDate(dateInUnixSec: number, dateFormat: DateFormat): string {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const date = new Date(dateInUnixSec * 1000); // date from ms since epoche
	const monthIndex = date.getMonth();
	const day = date.getDate();
	const year = date.getFullYear().toString();
	const month = months[monthIndex];

	let formattedDate = "";
	switch (dateFormat) {
		case DateFormat.DD_YY:
			formattedDate = monthIndex + 1 + "/" + year.slice(2, 4);
			break;
		case DateFormat.MMM_DD_YY:
			formattedDate += month + " " + day + ", " + year;
			break;
		case DateFormat.MMM_DD_TIME:
			const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
			formattedDate += month + " " + day + " " + time;
			break;
		case DateFormat.SINCE_NOW:
			const now = Math.round(Date.now() / 1000); // Unix timestamp in seconds
			const deltaSec = now - dateInUnixSec;
			if (deltaSec < 60) {
				formattedDate = `${deltaSec} sec ago`;
			} else if (deltaSec < 60 * 60) {
				const deltaMin = Math.round(deltaSec / 60);
				formattedDate = `${deltaMin} min ago`;
			} else if (deltaSec < 60 * 60 * 24) {
				const deltaHour = Math.round(deltaSec / (60 * 60));
				formattedDate = `${deltaHour} hr ago`;
			} else if (deltaSec < 60 * 60 * 24 * 31) {
				const deltaDay = Math.round(deltaSec / (60 * 60 * 24));
				const base = deltaDay == 1 ? "day" : "days";
				formattedDate = `${deltaDay} ${base} ago`;
			} else if (deltaSec < 60 * 60 * 24 * 360) {
				const deltaMonth = Math.round(deltaSec / (60 * 60 * 24 * 31));
				const base = deltaMonth == 1 ? "month" : "months";
				formattedDate = `${deltaMonth} ${base} ago`;
			} else {
				const deltaYear = Math.round(deltaSec / (60 * 60 * 24 * 365));
				const base = deltaYear == 1 ? "year" : "years";
				formattedDate = `${deltaYear} ${base} ago`;
			}
			break;
	}

	return formattedDate;
}

/**
 * Format a number so it can nicely be rendered. This ensures the number of digits is 5 or less
 * @param number the number to be formatted, this can be a number or a string representation of a number
 * @param unit the unit of the number, if it is "%" then we
 * @param decimals the number of decimals to keep after formatting, if not specified it will keep 2
 * @returns nicely formatted number, for example if number is 11023 this will return 1.10K
 */
export function formatNumber(num: number | string, unit?: string, decimals: number | null = null): string {
	const K = 1000;
	const M = 1000000;
	const B = 1000000000;
	const T = 1000000000000;
	let defaultDecimals = 2;

	let postFix = "";
	let unitPostfix = false;
	let formattedNum = num;

	// If it is represented as a sting, convert to number first
	if (typeof formattedNum === "string") {
		formattedNum = parseFloat(formattedNum);

		if (isNaN(formattedNum)) {
			return num as string; // It isn't a number
		}
	}

	// Multiply by 100, and set so unit is postfixed
	if (unit === "%") {
		formattedNum *= 100;
		unitPostfix = true;
	}

	// Converting to digestable format
	if (formattedNum > T) {
		formattedNum /= T;
		postFix = "T";
	} else if (formattedNum > B) {
		formattedNum /= B;
		postFix = "B";
	} else if (formattedNum > M) {
		formattedNum /= M;
		postFix = "M";
	} else if (formattedNum > K) {
		formattedNum /= K;
		postFix = "K";
	}

	// If its an interger, flag to rount to whole number
	if (formattedNum % 1 === 0) {
		defaultDecimals = 0;
	}

	// Applying configs
	if (decimals !== null) {
		formattedNum = formattedNum.toFixed(decimals).toString();
	} else {
		formattedNum = formattedNum.toFixed(defaultDecimals).toString();
	}
	formattedNum += postFix;
	formattedNum = unit ? (unitPostfix ? formattedNum + unit : unit + formattedNum) : formattedNum;

	return formattedNum;
}

/**
 * Get the name for the data selector if the meta data exists, otherwise just returns the selector
 * @param selector selector key to get the name for
 */
export function getDataSelectorName(selector: string): string {
	if (selector in MarketDataSelector) {
		return MARKET_DATA_SELECTOR_INFO[selector as MarketDataSelector].name;
	} else if (selector in ProtocolDataSelector) {
		return PROTOCOL_DATA_SELECTOR_INFO[selector as ProtocolDataSelector].name;
	} else {
		return selector;
	}
}

/**
 * Get the unit for the data selector if the meta data exists, otherwise just returns empty string
 * @param selector selector key to get the unit for
 */
export function getDataSelectorUnit(selector: string): string {
	if (selector in MarketDataSelector) {
		return MARKET_DATA_SELECTOR_INFO[selector as MarketDataSelector].unit;
	} else if (selector in ProtocolDataSelector) {
		return PROTOCOL_DATA_SELECTOR_INFO[selector as ProtocolDataSelector].unit;
	} else {
		return "";
	}
}

/**
 * Get the description for the data selector if the meta data exists, otherwise just returns empty string
 * @param selector selector key to get the unit for
 */
export function getDataSelectorDescription(selector: string): string {
	if (selector in MarketDataSelector) {
		return MARKET_DATA_SELECTOR_INFO[selector as MarketDataSelector].description;
	} else if (selector in ProtocolDataSelector) {
		return PROTOCOL_DATA_SELECTOR_INFO[selector as ProtocolDataSelector].description;
	} else {
		return "";
	}
}

/**
 * Convert from wei to gwei, 1 gwei = 10^9 wei
 * @param wei the number of wei to be converted
 * @returns the equivilent number of gwei
 */
export function weiToGwei(wei: number): number {
	return wei * 10 ** -9;
}

/**
 * Getter for the ethercan link given a coin address
 * @param address token, wallet or contract address
 * @param linkType type of the link
 * @returns etherscan link for the coin address
 */
export function getEtherscanLink(address: string, linkType: EtherscanLinkType): string {
	return "https://etherscan.io/" + linkType + "/" + address;
}

/**
 * Format an address to a shorter version by adding ... in the middle
 * @param address address to be shortened
 * @param length the length to shorten the address to
 * @returns shortened address
 */
export function shortAddress(address: string, length: Length): string {
	const len = address.length;
	let keepLen = 12;
	switch (length) {
		case Length.SHORT:
			keepLen = 6;
			break;
		case Length.MEDIUM:
			keepLen = 12;
			break;
		case Length.LONG:
			keepLen = 20;
			break;
	}
	if (len < keepLen) {
		return address;
	} else {
		return address.slice(0, keepLen / 2) + "..." + address.slice(len - Math.max(4, keepLen / 2), len);
	}
}

/**
 * Saturate val at the max and min values
 * @param val value to saturate
 * @param min lower bound for saturation
 * @param max upper bound for saturation
 * @return saturated val
 */
export function saturate(val: number, min: number, max: number): number {
	return Math.max(Math.min(val, max), min);
}

/**
 * Get the Token corresponding to the underlying symbol
 * @param underlyingSymbol underlying symbol to get the token for
 * @return Token if it exists for the underlying symbol, otherwise undefined
 */
export function getTokenForUnderlyingSymbol(underlyingSymbol: string): Token | undefined {
	if (underlyingSymbol in Token) {
		const token = underlyingSymbol as Token;
		return token;
	} else {
		return undefined;
	}
}

/**
 * Getter for the list of coin names
 * @returns list of coin names
 */
// export function getCoinNameList(): string[] {
// 	return COIN_INFO.map((info) => info.name);
// }

// /**
//  * Getter for the list of all time series data selector keys
//  * @returns list of all time series data selector keys
//  */
// export function getTimeSeriesDataSelectorKeyList(): string[] {
// 	return TIME_SERIES_DATA_SELECTOR_INFO.map((info) => info.key);
// }

/**
 * Get the coin with the given coin name
 * @param coinName the coin name to get the coin for
 * @returns the coin for the coin name, or null if none exists
 */
// export function getCoinForCoinName(coinName: string): coin_E | null {
// 	const filteredCoinInfo = COIN_INFO.filter((info) => info.name == coinName);
// 	const coinInfo = filteredCoinInfo.length === 1 ? filteredCoinInfo[0] : null;
// 	let coin: coin_E | null = null;
// 	if (coinInfo !== null) {
// 		coin = COIN_INFO.indexOf(coinInfo) as coin_E;
// 	}

// 	return coin;
// }

/**
 * Converts a camelCaseWord to SCREAMING_SNAKE_CASE
 * @param camelCaseWord the camel case word to be converted
 * @returns the screaming snake case of the word
 */
export function camelToScreamingSnakeCase(camelCaseWord: string): string {
	const scremingSnakeCaseWord = camelCaseWord.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`); // snake_case

	return scremingSnakeCaseWord.toUpperCase(); // SCREAMING_SNAKE_CASE
}
