import { COINS } from './constants'

//// General chart config
// The colors used for coin selection, and lines, these will only be this many allowed selected at a time
export const SELECTED_COIN_COLORS = ['green', 'blue', 'red', 'orange', 'pink']; 


//// APY Chart config
// The active coin is always selected, if null there is no active coin (i.e non coin specific plot)
export const ACTIVE_COIN = COINS[5]; 
//export const ACTIVE_COIN = null; 

export const APY_CHART_TITLE = 'Market APY';

// These must be consistent with the names for the data table
export const APY_DATA_SELECTOR = [ 
	{name: 'Supply'},
	{name: 'Borrow'},
];

