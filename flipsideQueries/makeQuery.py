coins = ['BAT', 'COMP', 'DAI', 'ETH', 'UNI', 'USDC', 'USDT', 'WBTC', 'WBTC2', 'ZRX']


select = ''
subtables = ''
where = ''

for coin in coins:
    select += f'''
    {coin}.supply_apy as {coin}_supply_apy,
    {coin}.borrow_apy as {coin}_borrow_apy,
    {coin}.total_supply_apy as {coin}_total_supply_apy,
    {coin}.total_borrow_apy as {coin}_total_borrow_apy,''' 

    subtables += f'''
    (SELECT
        block_hour,
        supply_apy,
        borrow_apy,
        supply_apy + comp_apy_supply as total_supply_apy,
        borrow_apy + comp_apy_borrow as total_borrow_apy
    FROM
        compound.market_stats
    WHERE
        contract_name = 'c{coin}') as {coin},'''

    where += f'''
    {coin}.block_hour = block_time AND'''


# Remove trailing commas
select = select[:-1]
subtables = subtables[:-1]

where = where[:len(where)-3] # Remove last AND


sql = f'''SELECT 
    DAI.block_hour as block_time,'''
sql += select 
sql += '\nFROM' + subtables


sqlLongTerm = sql + '\nWHERE' + '\n    hour(block_time) = 12 AND' + where
sqlLongTerm += '\nORDER BY block_time DESC'


sqlShortTerm = sql + '\nWHERE'  
sqlShortTerm += '''
block_time >= getdate() - interval '90 days' AND'''
sqlShortTerm += where


file = open('queryLongTerm.txt', 'w')
file.write(sqlLongTerm)
file.close()

file = open('queryShortTerm.txt', 'w')
file.write(sqlShortTerm)
file.close()
