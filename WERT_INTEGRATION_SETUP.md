# Wert Integration Setup Guide

This guide explains how to configure your Solana program with Wert for fiat-to-crypto purchases.

## Overview

Your `purchase_with_sol` function has been integrated with Wert. When a user makes a purchase:

1. **80% of SOL** is swapped to Token2022 via Raydium
2. **20% of value** is distributed as SPL tokens to the user

## Configuration Steps

### 1. Derive Program Accounts

Run the helper script to derive your program's PDAs:

```bash
npx ts-node scripts/deriveProgramAccounts.ts
```

This will output:
- Program State PDA
- Program's SPL Token Account (ATA)
- Program's Token2022 Account (ATA)

Update these values in `src/config/solanaAccounts.ts`.

### 2. Configure Raydium Pool Accounts

You need to find or create a Raydium liquidity pool for SOL/Token2022. 

#### Finding an Existing Pool:

1. Go to [Raydium](https://raydium.io/) on devnet
2. Search for your Token2022 mint: `ARLSc4xfNURhCfToTtJaXN3v1RZWSMwhV1egf9rvxdqq`
3. If a SOL/Token2022 pool exists, get these account addresses:
   - AMM ID (the pool address)
   - AMM Authority
   - AMM Open Orders
   - AMM Target Orders
   - Pool Coin Token Account (SOL side)
   - Pool PC Token Account (Token2022 side)

#### Creating a New Pool:

If no pool exists, you'll need to:

1. Visit Raydium and create a new CPMM pool
2. Provide initial liquidity (SOL + Token2022)
3. Note all the pool account addresses

#### Serum Market Accounts:

Raydium uses Serum DEX under the hood. You'll need:
- Serum Market address
- Serum Bids
- Serum Asks
- Serum Event Queue
- Serum Coin Vault
- Serum PC Vault
- Serum Vault Signer

These are typically returned when creating a Raydium pool.

### 3. Update Configuration File

Edit `src/config/solanaAccounts.ts` and replace all the placeholder values:

```typescript
export const SOLANA_CONFIG = {
  PROGRAM_STATE: 'YOUR_DERIVED_PDA', // From step 1
  PROGRAM_SPL_TOKEN_ACCOUNT: 'YOUR_DERIVED_ATA', // From step 1
  PROGRAM_TOKEN2022_ACCOUNT: 'YOUR_DERIVED_ATA', // From step 1
  
  // Raydium accounts from step 2
  AMM_ID: 'YOUR_AMM_ID',
  AMM_AUTHORITY: 'YOUR_AMM_AUTHORITY',
  // ... etc
};
```

### 4. Fund Your Program Accounts

Before going live, you need to:

1. **Create the token accounts** (if they don't exist):
   ```bash
   spl-token create-account <TOKEN_MINT> --owner <PROGRAM_STATE_PDA>
   ```

2. **Fund the SPL token account** with tokens to distribute:
   ```bash
   spl-token transfer <SPL_TOKEN_MINT> <AMOUNT> <PROGRAM_SPL_TOKEN_ACCOUNT>
   ```

3. **Fund the program state PDA** with SOL for transaction fees and swaps

### 5. Configure Pricing Logic

Update the `calculatePurchaseAmounts` function in `src/config/solanaAccounts.ts`:

```typescript
export function calculatePurchaseAmounts(solAmount: number) {
  // Implement proper pricing logic:
  // 1. Get current SOL/USD price
  // 2. Calculate 20% of purchase value in USD
  // 3. Convert to SPL token amount based on your token's price
  // 4. Get Raydium pool quote for 80% SOL -> Token2022
  // 5. Apply slippage protection (e.g., 1-5%)
  
  return {
    totalLamports,
    swapLamports,
    distributionValueLamports,
    splTokenAmount,
    minimumToken2022Out,
  };
}
```

### 6. Environment Variables

Ensure your `.env` file has:

```bash
VITE_WERT_PARTNER_ID=your_partner_id
VITE_WERT_PRIVATE_KEY=your_private_key
```

## How It Works

### Instruction Flow

When a user clicks "BUY" and completes payment with Wert:

1. **Frontend** builds the `purchase_with_sol` instruction with:
   - All required accounts (26 accounts total)
   - Instruction data (amount, recipient, token amounts)
   - Borsh-serialized parameters
   - Anchor discriminator for the function

2. **Instruction is hex-encoded** as JSON according to Wert's spec:
   ```json
   {
     "program_id": "...",
     "accounts": [...],
     "data": "hex_encoded_borsh_data"
   }
   ```

3. **Wert receives the SOL** from the user's card payment

4. **Wert's wallet** (`CYdZAb4i2oaz5CiAvwenMyUVm2DJdd2cWKsekKxxXCQX`) signs and sends the transaction

5. **Your program executes**:
   - Receives SOL from Wert's wallet
   - Swaps 80% to Token2022 via Raydium
   - Sends Token2022 to recipient
   - Sends SPL tokens (worth 20%) to recipient

### Key Points

- **Wert's signing account** must be included in the accounts list with `is_signer: true`
- **All accounts must be in the correct order** matching your Anchor program
- **Instruction discriminator** is calculated as SHA256("global:purchase_with_sol")[0..8]
- **Borsh serialization** must match your Rust types exactly

## Testing

### Before Production:

1. **Test on devnet** with small amounts
2. **Verify account derivations** are correct
3. **Check token account ownership** (must be owned by program PDA)
4. **Simulate transactions** using `solana-cli`:
   ```bash
   solana program simulate <PROGRAM_ID> --accounts <ACCOUNTS> --data <DATA>
   ```

5. **Monitor Raydium swap** to ensure slippage is acceptable

### Common Issues:

- **"Account not found"**: Token accounts not created yet
- **"Insufficient funds"**: Program SPL token account needs more tokens
- **"Invalid instruction"**: Check account order or Borsh serialization
- **"Slippage exceeded"**: Adjust `minimum_token2022_out` calculation

## Security Considerations

1. **Program authority** should be a multisig wallet
2. **Token accounts** should only be writable by your program
3. **Withdraw function** is protected by authority check
4. **Slippage protection** prevents sandwich attacks
5. **Amount validation** ensures no zero-value transfers

## Support

If you encounter issues:

1. Check the browser console for detailed logs
2. Verify all account addresses in `solanaAccounts.ts`
3. Use Solana Explorer to inspect failed transactions
4. Check Raydium pool liquidity and state

## Resources

- [Wert Documentation](https://docs.wert.io/)
- [Raydium Developer Docs](https://docs.raydium.io/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

