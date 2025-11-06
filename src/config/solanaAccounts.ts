// Solana Program Configuration
export const SOLANA_CONFIG = {
  // Your program ID
  PROGRAM_ID: 'GJYzfPqwEdZSLZqAYCGDceUF1PvVs4rfuRyJbT2px4Ks',
  
  // Your SPL token price in USD (fallback if on-chain fetch fails)
  SPL_TOKEN_PRICE_USD: 1.0, // Fallback: $1.00 per token
  
  // Your SPL token address for price fetching
  // This is the token you're distributing (the 20% reward token)
  SPL_TOKEN_ADDRESS: 'A2ZbCHUEiHgSwFJ9EqgdYrFF255RQpAZP2xEC62fpump', // Your token mint address
  
  // Program state PDA (derived from seeds [b"program_state"])
  // You'll need to calculate this or get it from your deployment
  PROGRAM_STATE: 'YOUR_PROGRAM_STATE_PDA', // TODO: Calculate or get from deployment
  
  // SPL Token (the token you're distributing - 20% of purchase)
  SPL_TOKEN_MINT: 'A2ZbCHUEiHgSwFJ9EqgdYrFF255RQpAZP2xEC62fpump', // From your contract
  PROGRAM_SPL_TOKEN_ACCOUNT: 'YOUR_PROGRAM_SPL_TOKEN_ACCOUNT', // TODO: Your program's SPL token account
  
  // Token2022 (the token you're swapping to - 80% of purchase)
  TOKEN2022_MINT: 'ARLSc4xfNURhCfToTtJaXN3v1RZWSMwhV1egf9rvxdqq', // From your contract
  PROGRAM_TOKEN2022_ACCOUNT: 'YOUR_PROGRAM_TOKEN2022_ACCOUNT', // TODO: Your program's Token2022 account
  
  // Raydium AMM accounts for SOL/Token2022 pool
  RAYDIUM_AMM_PROGRAM: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK', // Raydium CPMM program
  AMM_ID: 'YOUR_AMM_ID', // TODO: The Raydium pool ID for SOL/Token2022
  AMM_AUTHORITY: 'YOUR_AMM_AUTHORITY', // TODO: Raydium pool authority
  AMM_OPEN_ORDERS: 'YOUR_AMM_OPEN_ORDERS', // TODO
  AMM_TARGET_ORDERS: 'YOUR_AMM_TARGET_ORDERS', // TODO
  POOL_COIN_TOKEN_ACCOUNT: 'YOUR_POOL_COIN_TOKEN_ACCOUNT', // TODO: Pool's SOL account
  POOL_PC_TOKEN_ACCOUNT: 'YOUR_POOL_PC_TOKEN_ACCOUNT', // TODO: Pool's Token2022 account
  
  // Serum DEX accounts (used by Raydium)
  SERUM_PROGRAM_ID: 'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX', // Serum DEX v3
  SERUM_MARKET: 'YOUR_SERUM_MARKET', // TODO
  SERUM_BIDS: 'YOUR_SERUM_BIDS', // TODO
  SERUM_ASKS: 'YOUR_SERUM_ASKS', // TODO
  SERUM_EVENT_QUEUE: 'YOUR_SERUM_EVENT_QUEUE', // TODO
  SERUM_COIN_VAULT_ACCOUNT: 'YOUR_SERUM_COIN_VAULT', // TODO
  SERUM_PC_VAULT_ACCOUNT: 'YOUR_SERUM_PC_VAULT', // TODO
  SERUM_VAULT_SIGNER: 'YOUR_SERUM_VAULT_SIGNER', // TODO
  
  // Standard Solana programs
  TOKEN_PROGRAM: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  SYSTEM_PROGRAM: '11111111111111111111111111111111',
  
  // Wert's signing account (this is the account that will hold funds and sign the transaction)
  // According to Wert docs, this is the account that signs when using SOL commodity
  WERT_SIGNING_ACCOUNT: 'CYdZAb4i2oaz5CiAvwenMyUVm2DJdd2cWKsekKxxXCQX',
};

/**
 * Fetches current SOL/USD price from a price oracle
 * You can use multiple sources: Jupiter, Pyth, CoinGecko, etc.
 */
export async function getSolUsdPrice(): Promise<number> {
  try {
    // Using CoinGecko API as a simple example
    // In production, consider using Pyth Network or Jupiter for on-chain prices
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    );
    const data = await response.json();
    return data.solana.usd;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    // Fallback price (you should handle this better in production)
    return 150; // Approximate fallback price
  }
}

/**
 * Fetches your SPL token price in USD from on-chain data
 * Uses DexScreener which aggregates prices from all Solana DEXs
 */
export async function getSplTokenPrice(): Promise<number> {
  try {
    console.log('🔍 Fetching token price from DexScreener API...');
    
    // DexScreener API - works for all DEX-traded tokens on Solana
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${SOLANA_CONFIG.SPL_TOKEN_ADDRESS}`
    );
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get the pair with highest liquidity for most accurate price
    if (data.pairs && data.pairs.length > 0) {
      // Sort by liquidity (USD) and get the most liquid pair
      const sortedPairs = data.pairs.sort((a: any, b: any) => 
        (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
      );
      
      const mostLiquidPair = sortedPairs[0];
      const price = parseFloat(mostLiquidPair.priceUsd);
      
      console.log('✅ Token price from DexScreener:', price, 'USD');
      console.log('   Token:', mostLiquidPair.baseToken?.symbol || 'Unknown');
      console.log('   Liquidity:', mostLiquidPair.liquidity?.usd?.toFixed(2) || 'N/A', 'USD');
      console.log('   DEX:', mostLiquidPair.dexId);
      console.log('   Pair:', mostLiquidPair.pairAddress);
      
      return price;
    } else {
      console.warn('⚠️ No trading pairs found on DexScreener');
      throw new Error('No pairs found');
    }
  } catch (error) {
    console.error('❌ Error fetching SPL token price:', error);
    console.log('⚠️ Using fallback price:', SOLANA_CONFIG.SPL_TOKEN_PRICE_USD, 'USD');
    return SOLANA_CONFIG.SPL_TOKEN_PRICE_USD; // Fallback to configured price
  }
}


/**
 * Calculate SPL token amount based on USD value and token price
 * @param usdValue - USD value to convert to tokens
 * @param tokenPriceUsd - Price of 1 token in USD
 * @param decimals - Token decimals (default 9)
 */
export function calculateTokenAmount(usdValue: number, tokenPriceUsd: number, decimals: number = 9): number {
  const tokenAmount = usdValue / tokenPriceUsd;
  return Math.floor(tokenAmount * Math.pow(10, decimals));
}

/**
 * Calculate amounts for a purchase
 * @param usdAmount - The amount in USD that the user wants to spend
 * @param splTokenPriceUsd - Price of your SPL token in USD (optional, will fetch from chain if not provided)
 * @param solUsdPrice - Current SOL/USD price (optional, will fetch if not provided)
 */
export async function calculatePurchaseAmounts(
  usdAmount: number, 
  splTokenPriceUsd?: number,
  solUsdPrice?: number
) {
  // Fetch prices from on-chain data if not provided
  const solPrice = solUsdPrice || await getSolUsdPrice();
  const splTokenPrice = splTokenPriceUsd || await getSplTokenPrice();
  
  // Convert USD to SOL
  const solAmount = usdAmount / solPrice;
  
  // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
  const lamports = Math.floor(solAmount * 1_000_000_000);
  
  // 80% goes to swap for Token2022, 20% value goes to SPL token distribution
  const swapAmount = Math.floor(lamports * 0.8);
  const distributionValue = lamports - swapAmount;
  
  // Calculate SPL token amount based on 20% of the USD value
  // Using the on-chain token price
  const distributionValueUsd = usdAmount * 0.2;
  const splTokenAmount = calculateTokenAmount(distributionValueUsd, splTokenPrice, 9); // 9 decimals as per your contract
  
  // Minimum Token2022 to receive (slippage protection)
  // You should calculate this based on current pool price and acceptable slippage
  // For now, using a conservative 5% slippage
  // TODO: Query the Raydium pool for actual quote
  const estimatedToken2022Out = Math.floor(swapAmount * 0.95);
  
  console.log('\n💵 ========== PURCHASE CALCULATION ==========');
  console.log('📥 INPUT:');
  console.log('  • USD amount:', usdAmount, 'USD');
  console.log('\n💱 PRICES:');
  console.log('  • SOL price:', solPrice, 'USD');
  console.log('  • SPL token price:', splTokenPrice, 'USD');
  console.log('\n🔄 CONVERSION:');
  console.log('  • USD to SOL:', usdAmount, 'USD /', solPrice, '= ', solAmount.toFixed(6), 'SOL');
  console.log('  • Total lamports:', lamports);
  console.log('\n📊 SPLIT (80/20):');
  console.log('  • Swap amount (80%):', (swapAmount / 1_000_000_000).toFixed(6), 'SOL (', swapAmount, 'lamports )');
  console.log('  • Distribution (20%):', (distributionValue / 1_000_000_000).toFixed(6), 'SOL (', distributionValue, 'lamports )');
  console.log('  • Distribution USD value:', distributionValueUsd.toFixed(2), 'USD');
  console.log('\n🪙 SPL TOKEN CALCULATION:');
  console.log('  • Distribution USD:', distributionValueUsd, 'USD');
  console.log('  • Token price:', splTokenPrice, 'USD');
  console.log('  • Tokens to send:', distributionValueUsd, '/', splTokenPrice, '=', (distributionValueUsd / splTokenPrice).toFixed(2), 'tokens');
  console.log('  • In base units (9 decimals):', splTokenAmount);
  console.log('  • In human readable:', (splTokenAmount / 1_000_000_000).toFixed(6), 'tokens');
  console.log('==========================================\n');
  
  return {
    solAmount, // SOL amount (for Wert commodity_amount)
    totalLamports: lamports,
    swapLamports: swapAmount,
    distributionValueLamports: distributionValue,
    splTokenAmount,
    minimumToken2022Out: estimatedToken2022Out,
  };
}

