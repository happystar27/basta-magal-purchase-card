import { Connection, PublicKey } from '@solana/web3.js';

// Your Token2022 mint address
const TOKEN2022_MINT = 'ARLSc4xfNURhCfToTtJaXN3v1RZWSMwhV1egf9rvxdqq';
const SOL_MINT = 'So11111111111111111111111111111111111111112'; // Wrapped SOL

// Raydium CPMM Program ID
const RAYDIUM_CPMM_PROGRAM = 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK';

// RPC endpoint (use your own or a public one)
const RPC_ENDPOINT = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

/**
 * Fetch Raydium pool information from DexScreener API
 * This is the easiest way to find pool addresses
 */
async function fetchPoolFromDexScreener() {
  console.log('🔍 Searching for Raydium pool on DexScreener...\n');
  
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/solana/${TOKEN2022_MINT}`
    );
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.pairs || data.pairs.length === 0) {
      console.log('❌ No pools found for this token pair.');
      console.log('💡 You may need to create a new Raydium pool first.');
      return null;
    }
    
    // Filter for Raydium pools with SOL
    const raydiumPools = data.pairs.filter((pair: any) => 
      pair.dexId === 'raydium' && 
      (pair.quoteToken?.address === SOL_MINT || pair.baseToken?.address === SOL_MINT)
    );
    
    if (raydiumPools.length === 0) {
      console.log('❌ No Raydium pools found for SOL/Token2022 pair.');
      console.log('💡 You may need to create a new Raydium pool first.');
      return null;
    }
    
    // Get the pool with highest liquidity
    const bestPool = raydiumPools.sort((a: any, b: any) => 
      (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
    )[0];
    
    console.log('✅ Found Raydium pool:');
    console.log('   Pool Address:', bestPool.pairAddress);
    console.log('   Liquidity:', bestPool.liquidity?.usd?.toFixed(2), 'USD');
    console.log('   Price:', bestPool.priceUsd, 'USD');
    console.log('\n');
    
    return bestPool.pairAddress;
  } catch (error) {
    console.error('❌ Error fetching from DexScreener:', error);
    return null;
  }
}

/**
 * Fetch pool account data from on-chain
 * Note: This requires the pool address (AMM_ID)
 */
async function fetchPoolAccountsFromChain(ammId: string) {
  console.log('🔍 Fetching pool accounts from chain...\n');
  
  try {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const poolPubkey = new PublicKey(ammId);
    
    // Fetch the pool account data
    const accountInfo = await connection.getAccountInfo(poolPubkey);
    
    if (!accountInfo) {
      console.log('❌ Pool account not found on chain.');
      return null;
    }
    
    console.log('✅ Pool account found!');
    console.log('   Owner:', accountInfo.owner.toBase58());
    console.log('   Data length:', accountInfo.data.length, 'bytes');
    console.log('\n');
    console.log('⚠️  Note: Extracting all pool accounts requires parsing the account data.');
    console.log('💡 For CPMM pools, you can use Raydium SDK or check the pool creation transaction.');
    console.log('💡 Alternatively, use the Raydium UI to find pool details.');
    
    return accountInfo;
  } catch (error) {
    console.error('❌ Error fetching pool from chain:', error);
    return null;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('=== Raydium Pool Finder ===\n');
  console.log('Token2022 Mint:', TOKEN2022_MINT);
  console.log('SOL Mint:', SOL_MINT);
  console.log('\n');
  
  // Try to find pool from DexScreener
  const poolAddress = await fetchPoolFromDexScreener();
  
  if (poolAddress) {
    console.log('📋 Next Steps:');
    console.log('1. Use the pool address above as AMM_ID');
    console.log('2. To get all pool accounts, you can:');
    console.log('   a) Check the pool on Raydium UI: https://raydium.io/');
    console.log('   b) Use Raydium SDK to parse pool data');
    console.log('   c) Check the pool creation transaction on Solscan');
    console.log('\n');
    console.log('3. For Serum market accounts, check the pool\'s associated market');
    console.log('   (Raydium CPMM pools may not use Serum markets)');
    console.log('\n');
    console.log('⚠️  IMPORTANT:');
    console.log('   - Make sure you\'re using the correct network (mainnet/devnet)');
    console.log('   - Verify all account addresses match your network');
    console.log('   - CPMM pools have different structure than legacy AMM pools');
  } else {
    console.log('\n💡 How to create a new Raydium pool:');
    console.log('1. Go to https://raydium.io/');
    console.log('2. Navigate to "Create Pool" or "Liquidity"');
    console.log('3. Create a new CPMM pool for SOL/Token2022');
    console.log('4. After creation, note down all the pool account addresses');
    console.log('5. Update your solanaAccounts.ts with these addresses');
  }
}

main().catch(console.error);

