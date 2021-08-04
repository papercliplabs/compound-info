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
	{
		name: 'BAT',
		imgSrc: batSvg,
		desc: `Basic Attention Token (BAT) is a token that powers Brave's blockchain-based digital 
		advertising platform.
		`,
	},
	{
		name: 'COMP',
		imgSrc: compSvg,
		desc: `Compound (COMP) is a token that enables community governance of the
		Compound protocol. COMP token holders and their delegates can also debate,
		propose, and vote on changes to the protocol.
		`,
	},
	{
		name: 'DAI',
		imgSrc: daiSvg,
		desc: `Dai (DAI) is a decentralized stablecoin that attempts to maintain a
		value of $1.00 USD. Unlike centralized stablecoins, Dai isn't backed by US
		dollars in a bank account. Instead, it’s backed by collateral on the Maker
		platform.`,
	},
	{
		name: 'ETH',
		imgSrc: ethSvg,
		desc: `Ethereum is a decentralized computing platform that uses ETH
		(also called Ether) to pay transaction fees (or “gas”). Developers can use
		Ethereum to run decentralized applications (like Compound) and issue new
		crypto assets, known as Ethereum tokens (ERC-20).
		`,
	},
	{
		name: 'UNI',
		imgSrc: uniSvg,
		desc: `Uniswap (UNI) is a token that powers governance on Uniswap, an
		automated liquidity provider that’s designed to make it easy to exchange
		Ethereum (ERC-20) tokens.
		`,
	},
	{
		name: 'ZRX',
		imgSrc: zrxSvg,
		desc: `ZRX is a token that is used to power the 0x protocol.
		The protocol itself is designed to allow Ethereum tokens to be traded at a
		low cost directly from your wallet.
		`,
	},
	{
		name: 'USDC',
		imgSrc: usdcSvg,
		desc: `USD Coin (USDC) is a stablecoin fully backed by the US dollar and
		developed by the CENTRE consortium. USDC can be exchanged for dollars
		1:1 on Coinbase and other exchanges`,
	},
	{
		name: 'USDT',
		imgSrc: usdtSvg,
		desc: `Tether (USDT) is a stablecoin that is pegged to the value of a U.S.
		dollar. Tether’s issuer claims that USDT is backed by bank reserves and
		loans which match or exceed the value of USDT in circulation.
		`,
	},
	{
		name: 'WBTC',
		imgSrc: wbtcSvg,
		desc: `Wrapped Bitcoin (WBTC) is an Ethereum token that is intended to 
		represent Bitcoin (BTC) on the Ethereum blockchain. This version of WBTC on 
		Compound is no longer being supported, with the community migrating 
		to WBTC2.
		`,
	},
	{
		name: 'WBTC2',
		imgSrc: wbtcSvg,
		desc: `Wrapped Bitcoin (WBTC2) is an Ethereum token that is intended to 
		represent Bitcoin (BTC) on the Ethereum blockchain. 
		This version of WBTC is still being actively supported on Compound.
		`,
	},
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
	GITHUB: 'https://github.com/papercliplabs/compound-info',
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
