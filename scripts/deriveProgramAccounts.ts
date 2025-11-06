import { PublicKey } from '@solana/web3.js';

// Your program ID from the Anchor program
const PROGRAM_ID = 'GJYzfPqwEdZSLZqAYCGDceUF1PvVs4rfuRyJbT2px4Ks';

/**
 * Derive the program state PDA
 * This matches the seeds in your Anchor program: seeds = [b"program_state"]
 */
async function deriveProgramState() {
  const programId = new PublicKey(PROGRAM_ID);
  
  const [programState, bump] = await PublicKey.findProgramAddress(
    [Buffer.from('program_state')],
    programId
  );
  
  console.log('Program State PDA:', programState.toBase58());
  console.log('Bump:', bump);
  
  return { programState: programState.toBase58(), bump };
}

/**
 * Helper to derive Associated Token Account (ATA)
 */
async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
  const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
  
  const [address] = await PublicKey.findProgramAddress(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return address;
}

async function main() {
  console.log('=== Deriving Program Accounts ===\n');
  
  // 1. Derive Program State PDA
  const { programState, bump } = await deriveProgramState();
  console.log('\n');
  
  // 2. Derive Program's SPL Token Account
  const splTokenMint = new PublicKey('9SK3ztJaAfi6nxW6UhjmbCnaiqixzWFS1H4YbGJ7GPjJ');
  const programStatePubkey = new PublicKey(programState);
  const programSplTokenAccount = await getAssociatedTokenAddress(splTokenMint, programStatePubkey);
  console.log('Program SPL Token Account:', programSplTokenAccount.toBase58());
  
  // 3. Derive Program's Token2022 Account
  const token2022Mint = new PublicKey('ARLSc4xfNURhCfToTtJaXN3v1RZWSMwhV1egf9rvxdqq');
  const programToken2022Account = await getAssociatedTokenAddress(token2022Mint, programStatePubkey);
  console.log('Program Token2022 Account:', programToken2022Account.toBase58());
  
  console.log('\n=== Update your solanaAccounts.ts with these values ===');
  console.log(`PROGRAM_STATE: '${programState}',`);
  console.log(`PROGRAM_SPL_TOKEN_ACCOUNT: '${programSplTokenAccount.toBase58()}',`);
  console.log(`PROGRAM_TOKEN2022_ACCOUNT: '${programToken2022Account.toBase58()}',`);
}

main().catch(console.error);

