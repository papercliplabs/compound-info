export const COINS = [
	{name: 'BAT', cAddress: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e'},
	{name: 'COMP', cAddress: '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4'},
	{name: 'DAI', cAddress: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643'},
	{name: 'ETH', cAddress: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5'},
	{name: 'UNI', cAddress: '0x35a18000230da775cac24873d00ff85bccded550'},
	{name: 'ZRX', cAddress: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407'},
	{name: 'USDC', cAddress: '0x39aa39c021dfbae8fac545936693ac917d5e7563'},
	{name: 'USDT', cAddress: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9'},
	{name: 'WBTC', cAddress: '0xccf4429db6322d5c611ee964527d42e5d685dd6a'},
	{name: 'WBTC2', cAddress: '0xccf4429db6322d5c611ee964527d42e5d685dd6a'},
]

// Used for chart buttons and data
export const TIME_SELECTORS = [ 
	{name: "1D", days: 1},
	{name: "1W", days: 7},
	{name: "1M", days: 30},
	{name: "3M", days: 90},
	{name: "1Y", days: 365},
	{name: "All", days: null},
];


export const URLS = {
	APY_LONG: 'https://api.flipsidecrypto.com/api/v2/queries/ebad7f35-11e0-4561-9346-fa87c88d7598/data/latest' ,
	APY_SHORT: 'https://api.flipsidecrypto.com/api/v2/queries/dc338ecd-cdce-4c0b-ae9e-ac7978c2469e/data/latest'
}
