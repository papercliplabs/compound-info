import { COINS } from 'constants/index';

// Formats a javascript date object as the month and day.
// If withTime, also adds the time of day
export function formatDate(date, withTime) {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	let formattedDate = months[date.getMonth()] + ' ' + date.getDate();
	if (withTime) {
		const timeOptions = {
			hour: 'numeric',
			minute: 'numeric',
		};
		const time = date.toLocaleTimeString('en-US', timeOptions);
		formattedDate += ' ' + time;
	}

	return formattedDate;
}

export function formatNumber(number, unit, decimals = null) {
	const K = 1000;
	const M = 1000000;
	const B = 1000000000;
	const T = 1000000000000;
	let defaultDecimals = 2;

	let postFix = '';
	let unitPostfix = false;
	let formattedNum = number;
	let isInt = false;

	// If it is represented as a sting, convert to number first
	if (typeof number === 'string') {
		formattedNum = parseFloat(formattedNum);
		if (isNaN(formattedNum)) {
			return number; // It isn't a number
		}
	}

	// Multiply by 100, and set so unit is postfixed
	if (unit === '%') {
		formattedNum *= 100;
		unitPostfix = true;
	}

	// Converting to digestable format
	if (formattedNum > T) {
		formattedNum /= T;
		postFix = 'T';
	} else if (formattedNum > B) {
		formattedNum /= B;
		postFix = 'B';
	} else if (formattedNum > M) {
		formattedNum /= M;
		postFix = 'M';
	} else if (formattedNum > K) {
		formattedNum /= K;
		postFix = 'K';
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

export function weiToGwei(wei) {
	return wei * 10 ** -9;
}

export function getCoinInfo(coinName) {
	const coin = COINS.filter((coin) => coin.name === coinName);
	return !coin || coin.length !== 1 ? null : coin[0];
}

export function getEtherscanLink(address) {
	return 'https://etherscan.io/token/' + address;
}

export function shortAddress(address) {
	const len = address.length;
	if (len < 12) return address;
	if (len < 12) {
		return address;
	} else {
		return address.slice(0, 6) + '...' + address.slice(len - 6, len);
	}
}

export function getCoinImgSource(coinName) {
	const coinInfo = getCoinInfo(coinName);
	return coinInfo.imgSrc;
}

export function getCoinList() {
	return COINS.map((coin) => coin.name);
}

export function camelCaseToSentenceCase(camel) {
	let sentenceCase = camel.replace(/([A-Z])/g, ' $1');
	sentenceCase = sentenceCase.charAt(0).toUpperCase() + sentenceCase.slice(1);
	return sentenceCase;
}
