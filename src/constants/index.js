import batSvg from 'assets/coins/BAT.svg'
import compSvg from 'assets/coins/COMP.svg'
import daiSvg from 'assets/coins/DAI.svg'
import ethSvg from 'assets/coins/ETH.svg'
import uniSvg from 'assets/coins/UNI.svg'
import zrxSvg from 'assets/coins/ZRX.svg'
import usdcSvg from 'assets/coins/USDC.svg'
import usdtSvg from 'assets/coins/USDT.svg'
import wbtcSvg from 'assets/coins/WBTC.svg'

export const COINS = [
	{name: 'BAT',  imgSrc: batSvg, cAddress: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e'},
	{name: 'COMP', imgSrc: compSvg, cAddress: '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4'},
	{name: 'DAI',  imgSrc: daiSvg, cAddress: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643'},
	{name: 'ETH',  imgSrc: ethSvg, cAddress: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5'},
	{name: 'UNI',  imgSrc: uniSvg, cAddress: '0x35a18000230da775cac24873d00ff85bccded550'},
	{name: 'ZRX',  imgSrc: zrxSvg, cAddress: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407'},
	{name: 'USDC', imgSrc: usdcSvg, cAddress: '0x39aa39c021dfbae8fac545936693ac917d5e7563'},
	{name: 'USDT', imgSrc: usdtSvg, cAddress: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9'},
	{name: 'WBTC', imgSrc: wbtcSvg, cAddress: '0xccf4429db6322d5c611ee964527d42e5d685dd6a'},
	{name: 'WBTC2',imgSrc: wbtcSvg, cAddress: '0xccf4429db6322d5c611ee964527d42e5d685dd6a'},
]


//// General chart config
// Used for chart buttons and data
export const TIME_SELECTORS = [ 
	{name: "1D", days: 1},
	{name: "1W", days: 7},
	{name: "1M", days: 30},
	{name: "3M", days: 90},
	{name: "1Y", days: 365},
	{name: "All", days: null},
];

// The colors used for coin selection, and lines, these will only be this many allowed selected at a time
export const LINE_CHART_COLORS = ['#F9A234', '#FF7EA8', '#0095D5', '#00CDAF', '#885FB1']; 



//// APY Chart config
// The active coin is always selected, if null there is no active coin (i.e non coin specific plot)
export const APY_DATA_SELECTORS = [ // These must be consistent with the names for the data table
	{name: 'Supply'},
	{name: 'Borrow'},
];


//// URL's for API calls
export const URLS = {
	APY_LONG: 'https://api.flipsidecrypto.com/api/v2/queries/ebad7f35-11e0-4561-9346-fa87c88d7598/data/latest' ,
	APY_SHORT: 'https://api.flipsidecrypto.com/api/v2/queries/dc338ecd-cdce-4c0b-ae9e-ac7978c2469e/data/latest'
}

export const SHORT_TERM_DAYS = 8; // For distinguising between short and long term data, based on the time selector
