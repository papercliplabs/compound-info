import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { URLS, COINS, SHORT_TERM_DAYS } from '../constants'


// Fetch the data using the URL's pointing to flipside queries
export async function fetchApyData() {
	const shortTermUrl = URLS.APY_SHORT;
	const longTermUrl = URLS.APY_LONG;
	let ret = {};	

	// Custom compare function for sorting to handle the case where one is a substring of the other, this is for WBTC and WBTC2
	function compareFn(a, b) {
		if(a.includes(b)) {
			return -1;
		} else if(b.includes(a)) {
			return 1;
		} else {
			return [a, b].sort()[0] === a ? -1 : 1; // default sort 
		}
	}

	const coins = COINS.map(coin => coin.name).sort(compareFn)
	
	// Sending parallel api requests, and manipulating it in an easy to consume manor
	await Promise.all(([['shortTerm', shortTermUrl], ['longTerm', longTermUrl]]).map(([type, url]) => 
		fetch(url)
			.then(response => response.json())
			.then(data => {
				let keys = Object.keys(data[0]).filter(key => key !== 'BLOCK_TIME') // Table keys without block time 
				keys.sort(compareFn); // 0|i => borrow, 1|i => supply, 2|i => total borrow, 3|i => total supply 	
				const max = keys.length + 1; // len: keys.len + 1

				data = data.map(entry => {
					let newEntry = {
						'blockTime': entry.BLOCK_TIME,
						'values': {
							'borrow': {},
							'supply': {},
							'totalBorrow': {},
							'totalSupply': {},
						}
					}

					for(let i = 0; i < max / 4 - 1; i++) {
						newEntry.values['borrow'][coins[i]] = entry[keys[4*i]];
						newEntry.values['supply'][coins[i]] = entry[keys[4*i+1]];
						newEntry.values['totalBorrow'][coins[i]] = entry[keys[4*i+2]];
						newEntry.values['totalSupply'][coins[i]] = entry[keys[4*i+3]];
					}

					return newEntry;
				})
				ret[type] = data;
			})
			.catch(error => console.log(error))
		))
		.catch(error => console.log(error))

	return ret 
}

export function parseApyData(rawData, dataSelector, timeSelector) {
	// Grab short term, or long term and create a copy
	let data = timeSelector.days !== null && timeSelector.days <= SHORT_TERM_DAYS ? rawData.shortTerm.slice() : rawData.longTerm.slice();

	let startTime = new Date();
	if(timeSelector.days === null) {
		startTime = new Date(1700, 1, 1); // smallest date
	} else {
		startTime.setDate(startTime.getDate() - timeSelector.days);
	}

	// Filter on dataSelector
	data = data.map(entry => {
		return	Object.assign(entry.values[dataSelector.name.toLowerCase()], {'blockTime': entry.blockTime});
	})

	// Filter on timeSelector
	data = data.filter(entry => {
		const blockStartTime = new Date(entry.blockTime);
		return blockStartTime >= startTime;
	});

	return data;
}
