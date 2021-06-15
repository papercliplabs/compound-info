import batSvg from 'assets/coins/BAT.svg';
import compSvg from 'assets/coins/COMP.svg';
import daiSvg from 'assets/coins/DAI.svg';
import ethSvg from 'assets/coins/ETH.svg';
import uniSvg from 'assets/coins/UNI.svg';
import zrxSvg from 'assets/coins/ZRX.svg';
import usdcSvg from 'assets/coins/USDC.svg';
import usdtSvg from 'assets/coins/USDT.svg';
import wbtcSvg from 'assets/coins/WBTC.svg';

export const COINS = [
	{ name: 'BAT', imgSrc: batSvg },
	{ name: 'COMP', imgSrc: compSvg },
	{ name: 'DAI', imgSrc: daiSvg },
	{ name: 'ETH', imgSrc: ethSvg },
	{ name: 'UNI', imgSrc: uniSvg },
	{ name: 'ZRX', imgSrc: zrxSvg },
	{ name: 'USDC', imgSrc: usdcSvg },
	{ name: 'USDT', imgSrc: usdtSvg },
	{ name: 'WBTC', imgSrc: wbtcSvg },
	{ name: 'WBTC2', imgSrc: wbtcSvg },
];

//// General chart config
// Used for chart buttons and data
export const TIME_SELECTORS = [
	{ name: '1D', days: 1 },
	{ name: '1W', days: 7 },
	{ name: '1M', days: 30 },
	{ name: '3M', days: 90 },
	{ name: '1Y', days: 365 },
	{ name: 'All', days: null },
];

//// APY Chart config
// The active coin is always selected, if null there is no active coin (i.e non coin specific plot)
export const APY_DATA_SELECTORS = [
	// key must be consistent with the names for the data table from flipside query
	{ name: 'Supply', key: 'supply' },
	{ name: 'Borrow', key: 'borrow' },
];

//// URL's for API calls
export const URLS = {
	APY_LONG: 'https://api.flipsidecrypto.com/api/v2/queries/ebad7f35-11e0-4561-9346-fa87c88d7598/data/latest',
	APY_SHORT: 'https://api.flipsidecrypto.com/api/v2/queries/dc338ecd-cdce-4c0b-ae9e-ac7978c2469e/data/latest',
	SUMMARY_DATA: 'https://api.compound.finance/api/v2/ctoken',
	PAPERCLIP_HOME: 'https://twitter.com/papercliplabs',
	GAS_NOW: 'https://www.gasnow.org/api/v3/gas/price?utm_source=compoundinfo',
	FLIPSIDE: 'https://www.flipsidecrypto.com/',
	COMPOUND_DOCS: 'https://compound.finance/docs',
	COMPOUND_FINANCE: 'https://compound.finance',
	COMPOUND_GRANTS: 'https://twitter.com/compoundgrants',
};

export const SHORT_TERM_DAYS = 8; // For distinguising between short and long term data, based on the time selector

// Gas Tracker constants
export const SPEED_SELECTORS = [
	{ name: 'Fast', key: 'fast' },
	{ name: 'Standard', key: 'standard' },
];

export const GAS_USED = [
	{ action: 'Supply USDC', gasUsed: 193404 },
	{ action: 'Borrow USDC', gasUsed: 332745 },
];
