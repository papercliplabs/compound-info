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
import saiSvg from "assets/coins/DAI.svg";
import usdpSvg from "assets/coins/USDP.svg";
import repSvg from "assets/coins/REP.svg";
import feiSvg from "assets/coins/FEI.svg";

import { Token, TimeSelector, ProtocolDataSelector, MarketDataSelector, DataResolution, Unit } from "common/enums";
import {
	TokenInfoList,
	TimeSelectorInfoList,
	ProtocolDataSelectorInfoList,
	MarketDataSelectorInfoList,
} from "common/types";

export const TOKEN_INFO: TokenInfoList = {
	[Token.BAT]: {
		symbol: Token.BAT,
		imgSrc: batSvg,
		desc: `Basic Attention Token (BAT) is a token that powers Brave's blockchain-based digital
		advertising platform.`,
		whitepaper: "https://basicattentiontoken.org/static-assets/documents/BasicAttentionTokenWhitePaper-4.pdf",
		website: "https://basicattentiontoken.org/",
		twitter: "https://twitter.com/attentiontoken",
		coinGecko: "https://www.coingecko.com/coins/basic-attention-token",
	},
	[Token.COMP]: {
		symbol: Token.COMP,
		imgSrc: compSvg,
		desc: `Compound (COMP) is a token that enables community governance of the
		Compound protocol. COMP token holders and their delegates can also debate,
		propose, and vote on changes to the protocol.`,
		whitepaper: "https://compound.finance/documents/Compound.Whitepaper.pdf",
		website: "https://compound.finance/",
		twitter: "https://twitter.com/compoundfinance",
		coinGecko: "https://www.coingecko.com/coins/compound",
	},
	[Token.DAI]: {
		symbol: Token.DAI,
		imgSrc: daiSvg,
		desc: `Dai (DAI) is a decentralized stablecoin that attempts to maintain a
	value of $1.00 USD. Unlike centralized stablecoins, Dai isn't backed by US
	dollars in a bank account. Instead, it’s backed by collateral on the Maker
	platform.`,
		whitepaper: "https://makerdao.com/en/whitepaper/#abstract",
		website: "https://makerdao.com",
		twitter: "https://twitter.com/MakerDAO",
		coinGecko: "https://www.coingecko.com/coins/dai",
	},
	[Token.ETH]: {
		symbol: Token.ETH,
		imgSrc: ethSvg,
		desc: `Ethereum is a decentralized computing platform that uses ETH
		(also called Ether) to pay transaction fees (or “gas”). Developers can use
		Ethereum to run decentralized applications (like Compound) and issue new
		crypto assets, known as Ethereum tokens (ERC-20).`,
		whitepaper: "https://ethereum.org/whitepaper/",
		website: "https://ethereum.org",
		twitter: "https://twitter.com/ethereum",
		coinGecko: "https://www.coingecko.com/coins/ethereum",
	},
	[Token.UNI]: {
		symbol: Token.UNI,
		imgSrc: uniSvg,
		desc: `Uniswap (UNI) is a token that powers governance on Uniswap, an
		automated liquidity provider that’s designed to make it easy to exchange
		Ethereum (ERC-20) tokens.`,
		whitepaper: "https://uniswap.org/whitepaper-v3.pdf",
		website: "http://uniswap.org/",
		twitter: "https://twitter.com/Uniswap",
		coinGecko: "https://www.coingecko.com/coins/uniswap",
	},
	[Token.ZRX]: {
		symbol: Token.ZRX,
		imgSrc: zrxSvg,
		desc: `ZRX is a token that is used to power the 0x protocol.
		The protocol itself is designed to allow Ethereum tokens to be traded at a
		low cost directly from your wallet.`,
		whitepaper: "https://0x.org/pdfs/0x_white_paper.pdf",
		website: "https://0x.org/",
		twitter: "https://twitter.com/0xProject",
		coinGecko: "https://www.coingecko.com/coins/0x",
	},
	[Token.USDC]: {
		symbol: Token.USDC,
		imgSrc: usdcSvg,
		desc: `USD Coin (USDC) is a stablecoin fully backed by the US dollar and
		developed by the CENTRE consortium. USDC can be exchanged for dollars
		1:1 on Coinbase and other exchanges.`,
		whitepaper: "https://f.hubspotusercontent30.net/hubfs/9304636/PDF/centre-whitepaper.pdf",
		website: "https://www.circle.com/usdc",
		twitter: "https://twitter.com/circlepay",
		coinGecko: "https://www.coingecko.com/coins/usd-coin",
	},
	[Token.USDT]: {
		symbol: Token.USDT,
		imgSrc: usdtSvg,
		desc: `Tether (USDT) is a stablecoin that is pegged to the value of a U.S.
		dollar. Tether’s issuer claims that USDT is backed by bank reserves and
		loans which match or exceed the value of USDT in circulation.`,
		whitepaper: "https://tether.to/wp-content/uploads/2016/06/TetherWhitePaper.pdf",
		website: "https://tether.to/",
		twitter: "https://twitter.com/Tether_to",
		coinGecko: "https://www.coingecko.com/en/coins/tether",
	},
	[Token.WBTC]: {
		symbol: Token.WBTC,
		imgSrc: wbtcSvg,
		desc: `Wrapped Bitcoin (WBTC) is an Ethereum token that is intended to 
		represent Bitcoin (BTC) on the Ethereum blockchain.`,
		whitepaper: "https://wbtc.network/assets/wrapped-tokens-whitepaper.pdf",
		website: "https://wbtc.network",
		twitter: "https://twitter.com/wrappedbtc",
		coinGecko: "https://www.coingecko.com/coins/wrapped-bitcoin",
	},
	[Token.WBTCL]: {
		symbol: Token.WBTCL,
		imgSrc: wbtcSvg,
		desc: `Wrapped Bitcoin (WBTC(legacy)) is an Ethereum token that is intended to 
		represent Bitcoin (BTC) on the Ethereum blockchain. This version of WBTC on 
		Compound is no longer being supported, with the community migrating 
		to WBTC.`,
		whitepaper: "https://wbtc.network/assets/wrapped-tokens-whitepaper.pdf",
		website: "https://wbtc.network",
		twitter: "https://twitter.com/wrappedbtc",
		coinGecko: "https://www.coingecko.com/coins/wrapped-bitcoin",
	},
	[Token.AAVE]: {
		symbol: Token.AAVE,
		imgSrc: aaveSvg,
		desc: "Aave (AAVE) is an Ethereum token that powers Aave, a decentralized non-custodial money market protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow cryptocurrencies in exchange for paying a variable interest rate.",
		whitepaper: "https://github.com/aave/aave-protocol/blob/master/docs/Aave_Protocol_Whitepaper_v1_0.pdf",
		website: "https://aave.com",
		twitter: "https://twitter.com/AaveAave",
		coinGecko: "https://www.coingecko.com/coins/aave",
	},
	[Token.MKR]: {
		symbol: Token.MKR,
		imgSrc: mkrSvg,
		desc: `Maker is an Ethereum token that describes itself as “a utility token, governance token, and recapitalization resource of the Maker system.” The purpose of the Maker system is to generate another Ethereum token, called Dai, that seeks to trade on exchanges at a value of exactly US$1.00.`,
		whitepaper: "https://makerdao.com/whitepaper/",
		website: "https://makerdao.com/",
		twitter: "https://twitter.com/MakerDAO",
		coinGecko: "https://www.coingecko.com/coins/maker",
	},
	[Token.SUSHI]: {
		symbol: Token.SUSHI,
		imgSrc: sushiSvg,
		desc: `SushiSwap (SUSHI) is an Ethereum token that powers SushiSwap, a decentralized cryptocurrency exchange and automated market maker built on Ethereum. Holders of SUSHI can participate in community governance and stake their tokens to receive a portion of SushiSwap’s transaction fees.`,
		whitepaper: "https://docs.sushi.com",
		website: "https://sushi.com",
		twitter: "https://twitter.com/sushiswap",
		coinGecko: "https://www.coingecko.com/coins/sushi",
	},
	[Token.TUSD]: {
		symbol: Token.TUSD,
		imgSrc: tusdSvg,
		desc: `TrueUSD is a stablecoin running on Ethereum that attempts to maintain a value of US$1.00. The supply of TUSD is collateralized by US dollars held in escrow by banks. Tokens can be purchased and redeemed for US dollars on the TrustToken website.`,
		whitepaper: "https://www.trusttoken.com",
		website: "https://www.trusttoken.com",
		twitter: "https://twitter.com/TrustToken",
		coinGecko: "https://www.coingecko.com/coins/true-usd",
	},
	[Token.YFI]: {
		symbol: Token.YFI,
		imgSrc: yfiSvg,
		desc: `Yearn.finance (YFI) is an Ethereum token that governs the Yearn.finance platform. The platform is a yield optimizer that moves funds around the decentralized finance (“defi”) ecosystem in an effort to generate a high return.`,
		whitepaper: "https://docs.yearn.finance",
		website: "https://yearn.finance",
		twitter: "https://twitter.com/iearnfinance",
		coinGecko: "https://www.coingecko.com/coins/yearn-finance",
	},
	[Token.LINK]: {
		symbol: Token.LINK,
		imgSrc: linkSvg,
		desc: `Chainlink (LINK) is an Ethereum token that powers the Chainlink decentralized oracle network. This network allows smart contracts on Ethereum to securely connect to external data sources, APIs, and payment systems.`,
		whitepaper: "https://chain.link/whitepaper",
		website: "https://chain.link",
		twitter: "https://twitter.com/chainlink",
		coinGecko: "https://www.coingecko.com/coins/chainlink",
	},
	[Token.SAI]: {
		symbol: Token.SAI,
		imgSrc: saiSvg,
		desc: `Single Collatorilized Dai(SAI) is the predecessor to DAI stable coin. It is a decentralized stablecoin that attempts to maintain a
		value of $1.00 USD. Unlike centralized stablecoins, SAI isn't backed by US
		dollars in a bank account. Instead, it’s backed by collateral on the Maker
		platform. SAI can be converted into DAI using Makers migration.`,
		whitepaper: "https://makerdao.com/en/whitepaper/#abstract",
		website: "https://makerdao.com",
		twitter: "https://twitter.com/MakerDAO",
		coinGecko: "https://www.coingecko.com/coins/sai",
	},
	[Token.USDP]: {
		symbol: Token.USDP,
		imgSrc: usdpSvg,
		desc: `Pax Dollar (USDP) is a US Dollar-backed token while honoring the Paxos brand. Unlike some other “stablecoins,” USDP is regulated and always redeemable one-to-one with USD.`,
		whitepaper: "https://insights.paxos.com/hubfs/USDP-whitepaper.pdf",
		website: "https://paxos.com/usdp/",
		twitter: "https://twitter.com/paxosglobal",
		coinGecko: "https://www.coingecko.com/en/coins/pax-dollar",
	},
	[Token.REP]: {
		symbol: Token.REP,
		imgSrc: repSvg,
		desc: `Augur’s Reputation token (REP) is an Ethereum token designed for reporting and disputing the outcome of events on online prediction markets. Reporters are rewarded for reporting the outcome of events correctly.`,
		whitepaper:
			"https://medium.com/@AugurProject/the-augur-white-paper-a-decentralized-oracle-and-prediction-market-platform-ed8907401c48",
		website: "https://augur.net",
		twitter: "https://twitter.com/AugurProject",
		coinGecko: "https://www.coingecko.com/en/coins/augur",
	},
	[Token.FEI]: {
		symbol: Token.FEI,
		imgSrc: feiSvg,
		desc: `The Fei protocol is a fully decentralized stablecoin project developed by Fei Labs Inc. The project uses a stability mechanism called Protocol Controlled Value (PCV), as well as numerous other mechanisms to keep the Uniswap liquidity pool and FEI, its native stablecoin, close to the exchange rate of the US dollar.`,
		whitepaper: "https://assets.fei.money/docs/whitepaper.pdf",
		website: "https://fei.money",
		twitter: "https://twitter.com/feiprotocol",
		coinGecko: "https://www.coingecko.com/en/coins/fei-usd",
	},
};

export const TIME_SELECTOR_INFO: TimeSelectorInfoList = {
	[TimeSelector.ONE_DAY]: {
		name: TimeSelector.ONE_DAY,
		days: 1,
		resolution: DataResolution.HOUR, // 24 points
	},
	[TimeSelector.ONE_WEEK]: {
		name: TimeSelector.ONE_WEEK,
		days: 7,
		resolution: DataResolution.HOUR, // 168 points
	},
	[TimeSelector.ONE_MONTH]: {
		name: TimeSelector.ONE_MONTH,
		days: 30,
		resolution: DataResolution.DAY, // 30 points
	},
	[TimeSelector.THREE_MONTHS]: {
		name: TimeSelector.THREE_MONTHS,
		days: 90,
		resolution: DataResolution.DAY, // 90 points
	},
	[TimeSelector.ONE_YEAR]: {
		name: TimeSelector.ONE_YEAR,
		days: 365,
		resolution: DataResolution.WEEK, // 52 points
	},
	[TimeSelector.ALL]: {
		name: TimeSelector.ALL,
		days: undefined,
		resolution: DataResolution.WEEK,
	},
};

export const PROTOCOL_DATA_SELECTOR_INFO: ProtocolDataSelectorInfoList = {
	[ProtocolDataSelector.TOTAL_SUPPLY_USD]: {
		key: ProtocolDataSelector.TOTAL_SUPPLY_USD,
		name: "Supply",
		description: "total supplied in USD",
		unit: Unit.USD,
	},
	[ProtocolDataSelector.TOTAL_BORROW_USD]: {
		key: ProtocolDataSelector.TOTAL_BORROW_USD,
		name: "Borrow",
		description: "total borrowed in USD",
		unit: Unit.USD,
	},
	[ProtocolDataSelector.TOTAL_RESERVES_USD]: {
		key: ProtocolDataSelector.TOTAL_RESERVES_USD,
		name: "Reserves",
		description: "total reserves in USD",
		unit: Unit.USD,
	},
	[ProtocolDataSelector.UTILIZATION]: {
		key: ProtocolDataSelector.UTILIZATION,
		name: "Utalization",
		description: "utilization (supply / borrow)",
		unit: Unit.PERCENT,
	},
};

export const MARKET_DATA_SELECTOR_INFO: MarketDataSelectorInfoList = {
	[MarketDataSelector.SUPPLY_APY]: {
		key: MarketDataSelector.SUPPLY_APY,
		name: "Supply APY",
		description: "supply APY excluding COMP",
		unit: Unit.PERCENT,
	},
	[MarketDataSelector.BORROW_APY]: {
		key: MarketDataSelector.BORROW_APY,
		name: "Borrow APY",
		description: "borrow APY excluding COMP",
		unit: Unit.PERCENT,
	},
	[MarketDataSelector.TOTAL_SUPPLY_APY]: {
		key: MarketDataSelector.TOTAL_SUPPLY_APY,
		name: "Supply APY",
		description: "supply APY including COMP",
		unit: Unit.PERCENT,
	},
	[MarketDataSelector.TOTAL_BORROW_APY]: {
		key: MarketDataSelector.TOTAL_BORROW_APY,
		name: "Borrow APY",
		description: "borrow APY including COMP",
		unit: Unit.PERCENT,
	},
	[MarketDataSelector.TOTAL_SUPPLY]: {
		key: MarketDataSelector.TOTAL_SUPPLY,
		name: "Supply",
		description: "total tokens supplied",
		unit: Unit.UNITLESS,
	},
	[MarketDataSelector.TOTAL_SUPPLY_USD]: {
		key: MarketDataSelector.TOTAL_SUPPLY_USD,
		name: "Supply",
		description: "total supplied in USD",
		unit: Unit.USD,
	},
	[MarketDataSelector.TOTAL_BORROW]: {
		key: MarketDataSelector.TOTAL_BORROW,
		name: "Borrow",
		description: "total tokens borrowed",
		unit: Unit.UNITLESS,
	},
	[MarketDataSelector.TOTAL_BORROW_USD]: {
		key: MarketDataSelector.TOTAL_BORROW_USD,
		name: "Borrow",
		description: "total borrowed in USD",
		unit: Unit.USD,
	},
	[MarketDataSelector.TOTAL_RESERVES]: {
		key: MarketDataSelector.TOTAL_RESERVES,
		name: "Reserves",
		description: "total tokens in reserves",
		unit: Unit.UNITLESS,
	},
	[MarketDataSelector.TOTAL_RESERVES_USD]: {
		key: MarketDataSelector.TOTAL_RESERVES_USD,
		name: "Reserves",
		description: "total reserves in USD",
		unit: Unit.USD,
	},
	[MarketDataSelector.UTILIZATION]: {
		key: MarketDataSelector.UTILIZATION,
		name: "Utalization",
		description: "utilization (supply / borrow)",
		unit: Unit.PERCENT,
	},
	[MarketDataSelector.USDC_PER_UNDERLYING]: {
		key: MarketDataSelector.USDC_PER_UNDERLYING,
		name: "USD per underlying",
		description: "value of the underlying asset in USDC",
		unit: Unit.USD,
	},
	[MarketDataSelector.USDC_PER_ETH]: {
		key: MarketDataSelector.USDC_PER_ETH,
		name: "USD per ETH",
		description: "value of ETH in USDC",
		unit: Unit.USD,
	},
};

//// URL's for API calls
export const URLS = {
	// TRANSACTIONS: process.env.REACT_APP_TRANACTIONS_URL as string,
	TRANSACTIONS: "https://api.flipsidecrypto.com/api/v2/queries/b61e144f-e705-4c22-951e-e3ca6626cb16/data/latest",
	SUMMARY_DATA: "https://api.compound.finance/api/v2/ctoken",
	PAPERCLIP_HOME: "https://twitter.com/papercliplabs",
	GAS_NOW: "https://www.gasnow.org/api/v3/gas/price?utm_source=compoundinfo",
	FLIPSIDE: "https://www.flipsidecrypto.com/",
	COMPOUND_DOCS: "https://compound.finance/docs",
	COMPOUND_FINANCE: "https://compound.finance",
	COMPOUND_GRANTS: "https://twitter.com/compoundgrants",
	GITHUB: "https://github.com/papercliplabs/compound-info",
	SUBGRAPH_API: `https://gateway.thegraph.com/api/${process.env.REACT_APP_COMPOUND_INFO_SUBGRAPH_API_KEY}/deployments/id/Qma2AGkEDaTqkvHC8kABTjezh3WXqgPJCAdXGQKBX1srMf`,
	// SUBGRAPH_API: "https://api.thegraph.com/subgraphs/name/papercliplabs/compound-info",
	SUBGRAPH_FRONT_END: "https://thegraph.com/hosted-service/subgraph/papercliplabs/compound-info?version=current",
};

// ID where the protocol mapping
export const PROTOCOL_ID = 1;

export const DATA_BEHIND_TIME_THRESHOLD_S = 60 * 60 * 24 * 1; // 1 day

export const TRANSACTIONS_WITHIN_DAYS = 7;
export const NUM_TOP_ACCOUNT_FOR_USER_DOMINANCE = 10;
