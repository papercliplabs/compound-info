coins = ['BAT', 'COMP', 'DAI', 'ETH', 'UNI', 'USDC', 'USDT', 'WBTC', 'WBTC2', 'ZRX']
baseCoin = 'DAI'
shortTermDays = 8 # Threshold to get finer data (hourly)
longTermHour = 12 # Grab date on this hour for every day



subtables = 'WITH'
select = f'''\nSELECT
    {baseCoin}.block_hour as block_time,'''
join = f'\nFROM {baseCoin}'

for coin in coins:
    subtables += f'''
    {coin} as (SELECT
        block_hour,
        supply_apy,
        borrow_apy,
        supply_apy + comp_apy_supply as total_supply_apy,
        borrow_apy + comp_apy_borrow as total_borrow_apy
    FROM
        compound.market_stats
    WHERE
        contract_name = 'c{coin}'),'''

    select += f'''
    {coin}.supply_apy as {coin}_supply_apy,
    {coin}.borrow_apy as {coin}_borrow_apy,
    {coin}.total_supply_apy as {coin}_total_supply_apy,
    {coin}.total_borrow_apy as {coin}_total_borrow_apy,''' 

    if coin != baseCoin:
        join += f'''\n   full outer join {coin} on {coin}.block_hour = {baseCoin}.block_hour'''


# Remove trailing commas
subtables = subtables[:-1]
select = select[:-1]


sql = subtables 
sql += select 
sql += join



sqlLongTerm = sql + f'\nWHERE\n    hour(block_time) = {longTermHour}'
sqlLongTerm += '\nORDER BY block_time ASC'

sqlShortTerm = sql + f"\nWHERE\n    block_time >= getdate() - interval '{shortTermDays} days'"  
sqlShortTerm += '\nORDER BY block_time ASC'


file = open('queryLongTerm2.txt', 'w')
file.write(sqlLongTerm)
file.close()

file = open('queryShortTerm2.txt', 'w')
file.write(sqlShortTerm)
file.close()
