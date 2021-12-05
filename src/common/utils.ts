import { TOKEN_INFO } from "common/constants";

import { Token } from "common/enums";

/**
 * Format date to nicely render it
 * @param date date object to be formatteed
 * @param withTime if true, the time will be incluede at the end, otherwise the year is included
 * @param short if true, the month and year will be shorted to MM/YY and no time will be shown
 * @returns nicely formatted date
 */
export function formatDate(date: Date, withTime: boolean, short: boolean): string {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const monthIndex = date.getMonth();
	const day = date.getDate();
	const year = date.getFullYear().toString();
	const month = months[monthIndex];

	let formattedDate = "";
	if (short) {
		formattedDate = monthIndex + 1 + "/" + year.slice(0, 2);
	} else {
		if (withTime) {
			const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
			formattedDate += month + " " + day + " " + time;
		} else {
			formattedDate += month + " " + day + ", " + year;
		}
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
export function formatNumber(number: number | string, unit?: string, decimals: number | null = null): string {
	const K = 1000;
	const M = 1000000;
	const B = 1000000000;
	const T = 1000000000000;
	let defaultDecimals = 2;

	let postFix = "";
	let unitPostfix = false;
	let formattedNum = number;

	// If it is represented as a sting, convert to number first
	if (typeof formattedNum === "string") {
		formattedNum = parseFloat(formattedNum);

		if (isNaN(formattedNum)) {
			return number as string; // It isn't a number
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
 * Convert from wei to gwei, 1 gwei = 10^9 wei
 * @param wei the number of wei to be converted
 * @returns the equivilent number of gwei
 */
export function weiToGwei(wei: number): number {
	return wei * 10 ** -9;
}

/**
 * Getter for the ethercan link given a coin address
 * @param address coin address to get the link for
 * @returns etherscan link for the coin address
 */
export function getEtherscanLink(address: string): string {
	return "https://etherscan.io/token/" + address;
}

/**
 * Format an address to a shorter version by adding ... in the middle
 * @param address address to be shortened
 * @returns shortened address
 */
export function shortAddress(address: string): string {
	const len = address.length;
	if (len < 12) return address;
	if (len < 12) {
		return address;
	} else {
		return address.slice(0, 6) + "..." + address.slice(len - 6, len);
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
