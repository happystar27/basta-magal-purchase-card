import { Buffer } from 'buffer';
import { PublicKey } from '@solana/web3.js';

// Manual Borsh encoding for the instruction parameters
// Layout: [u64 amount][32 bytes recipient_address][u64 spl_token_amount][u64 minimum_token2022_out]
function encodePurchaseWithSolParams(
  amount: bigint,
  recipientAddress: Uint8Array,
  splTokenAmount: bigint,
  minimumToken2022Out: bigint
): Buffer {
  // Total size: 8 + 32 + 8 + 8 = 56 bytes
  const buffer = Buffer.alloc(56);
  let offset = 0;
  
  // Write amount as u64 (little-endian)
  buffer.writeBigUInt64LE(amount, offset);
  offset += 8;
  
  // Write recipient_address (32 bytes)
  buffer.set(recipientAddress, offset);
  offset += 32;
  
  // Write spl_token_amount as u64 (little-endian)
  buffer.writeBigUInt64LE(splTokenAmount, offset);
  offset += 8;
  
  // Write minimum_token2022_out as u64 (little-endian)
  buffer.writeBigUInt64LE(minimumToken2022Out, offset);
  
  return buffer;
}

// Calculate the instruction discriminator for Anchor programs
// Anchor uses the first 8 bytes of SHA256("global:instruction_name")
async function getInstructionDiscriminator(instructionName: string): Promise<Buffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`global:${instructionName}`);
  
  // Use Web Crypto API (available in browsers)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(hashBuffer).slice(0, 8);
}

export interface PurchaseWithSolParams {
  programId: string;
  programState: string;
  payer: string;
  programSplTokenAccount: string;
  recipientSplTokenAccount: string;
  splTokenMint: string;
  programToken2022Account: string;
  recipientToken2022Account: string;
  recipientAddress: string;
  raydiumAmmProgram: string;
  ammId: string;
  ammAuthority: string;
  ammOpenOrders: string;
  ammTargetOrders: string;
  poolCoinTokenAccount: string;
  poolPcTokenAccount: string;
  serumProgramId: string;
  serumMarket: string;
  serumBids: string;
  serumAsks: string;
  serumEventQueue: string;
  serumCoinVaultAccount: string;
  serumPcVaultAccount: string;
  serumVaultSigner: string;
  tokenProgram: string;
  systemProgram: string;
  // Instruction parameters
  amount: number; // in lamports
  splTokenAmount: number;
  minimumToken2022Out: number;
}

export async function buildPurchaseWithSolInstruction(params: PurchaseWithSolParams): Promise<string> {
  // Create the instruction discriminator
  const discriminator = await getInstructionDiscriminator('purchase_with_sol');
  
  // Convert recipient address to bytes
  const recipientPubkey = new PublicKey(params.recipientAddress);
  
  // Manually encode the instruction parameters using Borsh format
  const encodedParams = encodePurchaseWithSolParams(
    BigInt(params.amount),
    recipientPubkey.toBytes(),
    BigInt(params.splTokenAmount),
    BigInt(params.minimumToken2022Out)
  );
  
  // Combine discriminator + encoded params
  const data = Buffer.concat([discriminator, encodedParams]);
  
  // Build the instruction object according to Wert's expected format
  const instruction = {
    program_id: params.programId,
    accounts: [
      // program_state - The PDA that holds program state
      {
        address: params.programState,
        is_signer: false,
        is_writable: true,
      },
      // payer - The Wert wallet that pays and signs (must include this as per Wert docs)
      {
        address: params.payer,
        is_signer: true,
        is_writable: true,
      },
      // program_spl_token_account - Program's SPL token account to send from
      {
        address: params.programSplTokenAccount,
        is_signer: false,
        is_writable: true,
      },
      // recipient_spl_token_account - Recipient's SPL token account
      {
        address: params.recipientSplTokenAccount,
        is_signer: false,
        is_writable: true,
      },
      // spl_token_mint - The SPL token mint
      {
        address: params.splTokenMint,
        is_signer: false,
        is_writable: false,
      },
      // program_token2022_account - Program's Token2022 account
      {
        address: params.programToken2022Account,
        is_signer: false,
        is_writable: true,
      },
      // recipient_token2022_account - Recipient's Token2022 account
      {
        address: params.recipientToken2022Account,
        is_signer: false,
        is_writable: true,
      },
      // recipient_address - The recipient's wallet address
      {
        address: params.recipientAddress,
        is_signer: false,
        is_writable: false,
      },
      // raydium_amm_program - Raydium AMM program ID
      {
        address: params.raydiumAmmProgram,
        is_signer: false,
        is_writable: false,
      },
      // amm_id - Raydium pool ID
      {
        address: params.ammId,
        is_signer: false,
        is_writable: true,
      },
      // amm_authority - Raydium pool authority
      {
        address: params.ammAuthority,
        is_signer: false,
        is_writable: false,
      },
      // amm_open_orders - Raydium open orders
      {
        address: params.ammOpenOrders,
        is_signer: false,
        is_writable: true,
      },
      // amm_target_orders - Raydium target orders
      {
        address: params.ammTargetOrders,
        is_signer: false,
        is_writable: true,
      },
      // pool_coin_token_account - Pool's coin (SOL) account
      {
        address: params.poolCoinTokenAccount,
        is_signer: false,
        is_writable: true,
      },
      // pool_pc_token_account - Pool's PC (Token2022) account
      {
        address: params.poolPcTokenAccount,
        is_signer: false,
        is_writable: true,
      },
      // serum_program_id - Serum DEX program
      {
        address: params.serumProgramId,
        is_signer: false,
        is_writable: false,
      },
      // serum_market - Serum market
      {
        address: params.serumMarket,
        is_signer: false,
        is_writable: true,
      },
      // serum_bids - Serum bids
      {
        address: params.serumBids,
        is_signer: false,
        is_writable: true,
      },
      // serum_asks - Serum asks
      {
        address: params.serumAsks,
        is_signer: false,
        is_writable: true,
      },
      // serum_event_queue - Serum event queue
      {
        address: params.serumEventQueue,
        is_signer: false,
        is_writable: true,
      },
      // serum_coin_vault_account - Serum coin vault
      {
        address: params.serumCoinVaultAccount,
        is_signer: false,
        is_writable: true,
      },
      // serum_pc_vault_account - Serum PC vault
      {
        address: params.serumPcVaultAccount,
        is_signer: false,
        is_writable: true,
      },
      // serum_vault_signer - Serum vault signer
      {
        address: params.serumVaultSigner,
        is_signer: false,
        is_writable: false,
      },
      // token_program - SPL Token program
      {
        address: params.tokenProgram,
        is_signer: false,
        is_writable: false,
      },
      // system_program - System program
      {
        address: params.systemProgram,
        is_signer: false,
        is_writable: false,
      },
    ],
    data: data.toString('hex'),
  };
  
  // Convert to JSON string and then hex encode (as per Wert's requirements)
  const jsonString = JSON.stringify(instruction);
  const hexEncoded = Buffer.from(jsonString, 'utf-8').toString('hex');
  
  return hexEncoded;
}

// Helper to convert SOL to lamports
export function solToLamports(sol: number): number {
  return Math.floor(sol * 1_000_000_000);
}
