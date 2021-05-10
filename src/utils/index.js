

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
