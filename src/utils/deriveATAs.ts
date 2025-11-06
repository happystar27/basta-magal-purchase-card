import { PublicKey } from '@solana/web3.js';

// SPL Token Program IDs
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

/**
 * Derives the Associated Token Account (ATA) address for a given wallet and mint
 * This is a synchronous version that doesn't require network calls
 */
export async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): Promise<PublicKey> {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) {
    throw new Error('Owner cannot sign');
  }

  const [address] = await PublicKey.findProgramAddress(
    [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
    associatedTokenProgramId
  );

  return address;
}

/**
 * Helper to derive ATAs for both SPL and Token2022 tokens for a recipient
 */
export async function deriveRecipientTokenAccounts(
  recipientAddress: string,
  splTokenMint: string,
  token2022Mint: string
): Promise<{
  splTokenAccount: string;
  token2022Account: string;
}> {
  const recipient = new PublicKey(recipientAddress);
  const splMint = new PublicKey(splTokenMint);
  const token2022MintKey = new PublicKey(token2022Mint);

  // Derive ATA for SPL token
  const splTokenAccount = await getAssociatedTokenAddress(
    splMint,
    recipient
  );

  // Derive ATA for Token2022
  const token2022Account = await getAssociatedTokenAddress(
    token2022MintKey,
    recipient
  );

  return {
    splTokenAccount: splTokenAccount.toBase58(),
    token2022Account: token2022Account.toBase58(),
  };
}

