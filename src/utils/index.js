import { COINS } from 'constants/index'

// Formats a javascript date object as the month and day.
// If withTime, also adds the time of day
export function formatDate(date, withTime) {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	let formattedDate = months[date.getMonth()] + ' ' + date.getDate();
	if(withTime) {
		const timeOptions = {
			hour: "numeric",
			minute: "numeric",
		}
		const time = date.toLocaleTimeString("en-US", timeOptions);
		formattedDate += ' ' + time;
	}

	return formattedDate;
}

// Formats a number represented as percent (x%), includes this % symbol if includeUnit
export function formatPercent(percent, includeUnit=true) {
	return percent.toFixed(2).toString() + (includeUnit ? '%' : '')
}

export function getCoinInfo(coinName) {
	const coin = COINS.filter((coin) => coin.name === coinName);
	return (!coin || coin.length !== 1) ? null : coin[0];
}

export function getEtherscanLink(address) {
	return 'https://etherscan.io/token/' + address;
}

export function shortAddress(address) {
	const len = address.length;
	if(len < 12) return address;
	if(len < 12) {
		return address;
	} else {
		return address.slice(0, 6) + '...' + address.slice(len-6, len)
	}
}
