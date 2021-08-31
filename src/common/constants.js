import batSvg from "assets/coins/BAT.svg";
import compSvg from "assets/coins/COMP.svg";
import daiSvg from "assets/coins/DAI.svg";
import ethSvg from "assets/coins/ETH.svg";
import uniSvg from "assets/coins/UNI.svg";
import zrxSvg from "assets/coins/ZRX.svg";
import usdcSvg from "assets/coins/USDC.svg";
import usdtSvg from "assets/coins/USDT.svg";
import wbtcSvg from "assets/coins/WBTC.svg";
import aaveSvg from "assets/coins/AAVE.svg";
import mkrSvg from "assets/coins/MKR.svg";
import sushiSvg from "assets/coins/SUSHI.svg";
import tusdSvg from "assets/coins/TUSD.svg";
import yfiSvg from "assets/coins/YFI.svg";
import linkSvg from "assets/coins/LINK.svg";

export const COINS = [
	{
		name: "BAT",
		imgSrc: batSvg,
		desc: `Basic Attention Token (BAT) is a token that powers Brave's blockchain-based digital
		advertising platform.`,
		whitepaper: "https://basicattentiontoken.org/static-assets/documents/BasicAttentionTokenWhitePaper-4.pdf",
		website: "https://basicattentiontoken.org/",
		twitter: "https://twitter.com/attentiontoken",
		coingecko: "https://www.coingecko.com/coins/basic-attention-token",
	},
	{
		name: "COMP",
		imgSrc: compSvg,
		desc: `Compound (COMP) is a token that enables community governance of the
		Compound protocol. COMP token holders and their delegates can also debate,
		propose, and vote on changes to the protocol.`,
		whitepaper: "https://compound.finance/documents/Compound.Whitepaper.pdf",
		website: "https://compound.finance/",
		twitter: "https://twitter.com/compoundfinance",
		coingecko: "https://www.coingecko.com/coins/compound",
	},
	{
		name: "DAI",
		imgSrc: daiSvg,
		desc: `Dai (DAI) is a decentralized stablecoin that attempts to maintain a
		value of $1.00 USD. Unlike centralized stablecoins, Dai isn't backed by US
		dollars in a bank account. Instead, it’s backed by collateral on the Maker
		platform.`,
		whitepaper: "https://makerdao.com/en/whitepaper/#abstract",
		website: "https://makerdao.com",
		twitter: "https://twitter.com/MakerDAO",
		coingecko: "https://www.coingecko.com/coins/dai",
	},
	{
		name: "ETH",
		imgSrc: ethSvg,
		desc: `Ethereum is a decentralized computing platform that uses ETH
		(also called Ether) to pay transaction fees (or “gas”). Developers can use
		Ethereum to run decentralized applications (like Compound) and issue new
		crypto assets, known as Ethereum tokens (ERC-20).`,
		whitepaper: "https://ethereum.org/whitepaper/",
		website: "https://ethereum.org",
		twitter: "https://twitter.com/ethereum",
		coingecko: "https://www.coingecko.com/coins/ethereum",
	},
	{
		name: "UNI",
		imgSrc: uniSvg,
		desc: `Uniswap (UNI) is a token that powers governance on Uniswap, an
		automated liquidity provider that’s designed to make it easy to exchange
		Ethereum (ERC-20) tokens.`,
		whitepaper: "https://uniswap.org/whitepaper-v3.pdf",
		website: "http://uniswap.org/",
		twitter: "https://twitter.com/Uniswap",
		coingecko: "https://www.coingecko.com/coins/uniswap",
	},
	{
		name: "ZRX",
		imgSrc: zrxSvg,
		desc: `ZRX is a token that is used to power the 0x protocol.
		The protocol itself is designed to allow Ethereum tokens to be traded at a
		low cost directly from your wallet.`,
		whitepaper: "https://0x.org/pdfs/0x_white_paper.pdf",
		website: "https://0x.org/",
		twitter: "https://twitter.com/0xProject",
		coingecko: "https://www.coingecko.com/coins/0x",
	},
	{
		name: "USDC",
		imgSrc: usdcSvg,
		desc: `USD Coin (USDC) is a stablecoin fully backed by the US dollar and
		developed by the CENTRE consortium. USDC can be exchanged for dollars
		1:1 on Coinbase and other exchanges.`,
		whitepaper: "https://f.hubspotusercontent30.net/hubfs/9304636/PDF/centre-whitepaper.pdf",
		website: "https://www.circle.com/usdc",
		twitter: "https://twitter.com/circlepay",
		coingecko: "https://www.coingecko.com/coins/usd-coin",
	},
	{
		name: "USDT",
		imgSrc: usdtSvg,
		desc: `Tether (USDT) is a stablecoin that is pegged to the value of a U.S.
		dollar. Tether’s issuer claims that USDT is backed by bank reserves and
		loans which match or exceed the value of USDT in circulation.`,
		whitepaper: "https://tether.to/wp-content/uploads/2016/06/TetherWhitePaper.pdf",
		website: "https://tether.to/",
		twitter: "https://twitter.com/Tether_to",
		coingecko: "https://www.coingecko.com/en/coins/tether",
	},
	{
		name: "WBTC",
		imgSrc: wbtcSvg,
		desc: `Wrapped Bitcoin (WBTC) is an Ethereum token that is intended to 
		represent Bitcoin (BTC) on the Ethereum blockchain. This version of WBTC on 
		Compound is no longer being supported, with the community migrating 
		to WBTC2.`,
		whitepaper: "https://wbtc.network/assets/wrapped-tokens-whitepaper.pdf",
		website: "https://wbtc.network/",
		twitter: "https://twitter.com/wrappedbtc",
		coingecko: "https://www.coingecko.com/coins/wrapped-bitcoin",
	},
	{
		name: "WBTC2",
		imgSrc: wbtcSvg,
		desc: `Wrapped Bitcoin (WBTC2) is an Ethereum token that is intended to 
		represent Bitcoin (BTC) on the Ethereum blockchain. 
		This version of WBTC is still being actively supported on Compound.`,
		whitepaper: "https://wbtc.network/assets/wrapped-tokens-whitepaper.pdf",
		website: "https://wbtc.network",
		twitter: "https://twitter.com/wrappedbtc",
		coingecko: "https://www.coingecko.com/coins/wrapped-bitcoin",
	},
	{
		name: "AAVE",
		imgSrc: aaveSvg,
		desc: "Aave (AAVE) is an Ethereum token that powers Aave, a decentralized non-custodial money market protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow cryptocurrencies in exchange for paying a variable interest rate.",
		whitepaper: "https://github.com/aave/aave-protocol/blob/master/docs/Aave_Protocol_Whitepaper_v1_0.pdf",
		website: "https://aave.com",
		twitter: "https://twitter.com/AaveAave",
		coingecko: "https://www.coingecko.com/coins/aave",
	},
	{
		name: "LINK",
		imgSrc: linkSvg,
		desc: `Chainlink (LINK) is an Ethereum token that powers the Chainlink decentralized oracle network. This network allows smart contracts on Ethereum to securely connect to external data sources, APIs, and payment systems.`,
		whitepaper: "https://chain.link/whitepaper",
		website: "https://chain.link",
		twitter: "https://twitter.com/chainlink",
		coingecko: "https://www.coingecko.com/coins/chainlink",
	},
	{
		name: "MKR",
		imgSrc: mkrSvg,
		desc: `Maker is an Ethereum token that describes itself as “a utility token, governance token, and recapitalization resource of the Maker system.” The purpose of the Maker system is to generate another Ethereum token, called Dai, that seeks to trade on exchanges at a value of exactly US$1.00.`,
		whitepaper: "https://makerdao.com/whitepaper/",
		website: "https://makerdao.com/",
		twitter: "https://twitter.com/MakerDAO",
		coingecko: "https://www.coingecko.com/coins/maker",
	},
	{
		name: "SUSHI",
		imgSrc: sushiSvg,
		desc: `SushiSwap (SUSHI) is an Ethereum token that powers SushiSwap, a decentralized cryptocurrency exchange and automated market maker built on Ethereum. Holders of SUSHI can participate in community governance and stake their tokens to receive a portion of SushiSwap’s transaction fees.`,
		whitepaper: "https://docs.sushi.com",
		website: "https://sushi.com",
		twitter: "https://twitter.com/sushiswap",
		coingecko: "https://www.coingecko.com/coins/sushi",
	},
	{
		name: "TUSD",
		imgSrc: tusdSvg,
		desc: `TrueUSD is a stablecoin running on Ethereum that attempts to maintain a value of US$1.00. The supply of TUSD is collateralized by US dollars held in escrow by banks. Tokens can be purchased and redeemed for US dollars on the TrustToken website.`,
		whitepaper: "https://www.trusttoken.com",
		website: "https://www.trusttoken.com",
		twitter: "https://twitter.com/TrustToken",
		coingecko: "https://www.coingecko.com/coins/true-usd",
	},
	{
		name: "YFI",
		imgSrc: yfiSvg,
		desc: `Yearn.finance (YFI) is an Ethereum token that governs the Yearn.finance platform. The platform is a yield optimizer that moves funds around the decentralized finance (“defi”) ecosystem in an effort to generate a high return.`,
		whitepaper: "https://docs.yearn.finance",
		website: "https://yearn.finance",
		twitter: "https://twitter.com/iearnfinance",
		coingecko: "https://www.coingecko.com/coins/yearn-finance",
	},
];

//// General chart config
// Used for chart buttons and data
export const TIME_SELECTORS = [
	{ name: "1D", days: 1 },
	{ name: "1W", days: 7 },
	{ name: "1M", days: 30 },
	{ name: "3M", days: 90 },
	{ name: "1Y", days: 365 },
	{ name: "All", days: null },
];

//// APY Chart config
// The active coin is always selected, if null there is no active coin (i.e non coin specific plot)
export const APY_DATA_SELECTORS = [
	// key must be consistent with the names for the data table from flipside query
	{ name: "Supply", key: "supply" },
	{ name: "Borrow", key: "borrow" },
];

//// URL's for API calls
export const URLS = {
	APY_LONG: "https://api.flipsidecrypto.com/api/v2/queries/ebad7f35-11e0-4561-9346-fa87c88d7598/data/latest",
	APY_SHORT: "https://api.flipsidecrypto.com/api/v2/queries/dc338ecd-cdce-4c0b-ae9e-ac7978c2469e/data/latest",
	SUMMARY_DATA: "https://api.compound.finance/api/v2/ctoken",
	PAPERCLIP_HOME: "https://twitter.com/papercliplabs",
	GAS_NOW: "https://www.gasnow.org/api/v3/gas/price?utm_source=compoundinfo",
	FLIPSIDE: "https://www.flipsidecrypto.com/",
	COMPOUND_DOCS: "https://compound.finance/docs",
	COMPOUND_FINANCE: "https://compound.finance",
	COMPOUND_GRANTS: "https://twitter.com/compoundgrants",
	GITHUB: "https://github.com/papercliplabs/compound-info",
};

export const SHORT_TERM_DAYS = 8; // For distinguising between short and long term data, based on the time selector

// Gas Tracker constants
export const SPEED_SELECTORS = [
	{ name: "Fast", key: "fast" },
	{ name: "Standard", key: "standard" },
];

export const GAS_USED = [
	{ action: "Supply USDC", gasUsed: 193404 },
	{ action: "Borrow USDC", gasUsed: 332745 },
];
