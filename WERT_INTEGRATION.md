# Wert Integration Configuration

This document explains how to configure the Wert payment integration for your Solana token purchase program.

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

### Wert Configuration
```
VITE_WERT_PARTNER_ID=your_wert_partner_id
VITE_WERT_PRIVATE_KEY=your_wert_private_key
```

### Magic Link (Wallaneer Wallet)
```
VITE_MAGIC_API_KEY=your_magic_api_key
```

### Solana Program Addresses

#### Core Program
```
VITE_SOLANA_PROGRAM_ID=GJYzfPqwEdZSLZqAYCGDceUF1PvVs4rfuRyJbT2px4Ks
```

#### Program State and Token Accounts
```
VITE_PROGRAM_STATE=<Your Program State PDA>
VITE_PROGRAM_SPL_TOKEN_ACCOUNT=<Program's SPL Token Account>
VITE_SPL_TOKEN_MINT=<SPL Token Mint Address>
VITE_PROGRAM_TOKEN2022_ACCOUNT=<Program's Token2022 Account>
```

#### Raydium AMM Pool Addresses
```
VITE_RAYDIUM_AMM_PROGRAM=675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8
VITE_AMM_ID=<Raydium AMM Pool ID>
VITE_AMM_AUTHORITY=<AMM Authority>
VITE_AMM_OPEN_ORDERS=<AMM Open Orders Account>
VITE_AMM_TARGET_ORDERS=<AMM Target Orders Account>
VITE_POOL_COIN_TOKEN_ACCOUNT=<Pool Coin Token Account>
VITE_POOL_PC_TOKEN_ACCOUNT=<Pool PC Token Account>
```

#### Serum Market Addresses
```
VITE_SERUM_PROGRAM_ID=srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX
VITE_SERUM_MARKET=<Serum Market Address>
VITE_SERUM_BIDS=<Serum Bids Account>
VITE_SERUM_ASKS=<Serum Asks Account>
VITE_SERUM_EVENT_QUEUE=<Serum Event Queue>
VITE_SERUM_COIN_VAULT_ACCOUNT=<Serum Coin Vault>
VITE_SERUM_PC_VAULT_ACCOUNT=<Serum PC Vault>
VITE_SERUM_VAULT_SIGNER=<Serum Vault Signer>
```

## Important Notes

### 1. Instruction Discriminator
The current implementation uses a placeholder discriminator:
```typescript
const discriminator = Buffer.from([0x9d, 0x13, 0x5e, 0x0a, 0x8d, 0x7f, 0x3f, 0x73]);
```

**You need to calculate the correct discriminator for your `purchaseWithSol` instruction.**

For Anchor programs, the discriminator is the first 8 bytes of the SHA256 hash of `"global:purchaseWithSol"`.

You can calculate it using:
```typescript
import { sha256 } from 'js-sha256';
const discriminator = Buffer.from(sha256.digest("global:purchaseWithSol")).slice(0, 8);
```

### 2. Token Amount Calculation
The current implementation uses placeholder calculations:
- **SPL Token Amount**: 50% of the purchase amount
- **Minimum Token2022 Out**: 95% of the remaining amount (5% slippage)

**You should implement proper token amount calculations based on:**
- Current token prices
- Pool ratios from Raydium
- Your tokenomics
- Proper slippage tolerance

Consider fetching these values from your backend or calculating them based on real-time pool data.

### 3. Recipient Token Accounts
The code currently uses the user's public key as placeholders for:
- `recipientSplTokenAccount`
- `recipientToken2022Account`

**You need to derive the proper Associated Token Accounts (ATAs) for the recipient:**

```typescript
import { getAssociatedTokenAddress } from '@solana/spl-token';

const recipientSplTokenAccount = await getAssociatedTokenAddress(
  new PublicKey(SPL_TOKEN_MINT),
  new PublicKey(publicKey)
);

const recipientToken2022Account = await getAssociatedTokenAddress(
  new PublicKey(TOKEN2022_MINT),
  new PublicKey(publicKey),
  false,
  TOKEN_2022_PROGRAM_ID
);
```

Or, if you're using PDAs, derive them according to your program's logic.

### 4. Getting Account Addresses

To find your program's account addresses, you can:

1. **Check your program deployment logs** - When you deployed your Solana program, it should have logged all the account addresses.

2. **Use Solana CLI**:
   ```bash
   solana program show <PROGRAM_ID>
   ```

3. **Query your program state**:
   ```bash
   solana account <PROGRAM_STATE_ADDRESS>
   ```

4. **For Raydium and Serum addresses**, you'll need to:
   - Identify which pool you're using on Raydium
   - Get the pool information from Raydium's API or on-chain data
   - Extract all the required account addresses

### 5. Testing

Before going to production:

1. **Test on Devnet first** with test SOL
2. **Verify all account addresses** are correct
3. **Test the token amount calculations** with small amounts
4. **Check the discriminator** matches your program's IDL
5. **Ensure the Borsh serialization** matches your program's expectations

### 6. Security Notes

- **Never commit your `.env` file** to version control
- **Keep your `VITE_WERT_PRIVATE_KEY` secure** - ideally, this should be on a backend server, not in the frontend
- **Validate all user inputs** before creating transactions
- **Implement proper error handling** for failed transactions

## How It Works

1. User enters an amount and connects their wallet (Wallaneer)
2. The frontend calculates the required token amounts
3. Creates a Solana instruction for `purchaseWithSol` with all required accounts
4. Encodes the instruction data using Borsh serialization
5. Converts the instruction to JSON and then to hex
6. Signs the data with Wert's private key
7. Opens the Wert widget for the user to complete the payment
8. Wert processes the payment and executes the Solana transaction

## Support

For issues specific to:
- **Wert Integration**: Check [Wert Documentation](https://docs.wert.io)
- **Solana Development**: Check [Solana Documentation](https://docs.solana.com)
- **Anchor Framework**: Check [Anchor Documentation](https://www.anchor-lang.com)

