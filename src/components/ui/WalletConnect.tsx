import React, { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import WertWidget from "@wert-io/widget-initializer";
import { signSmartContractData } from "@wert-io/widget-sc-signer";
import { v4 as uuidv4 } from "uuid";
import { Buffer } from 'buffer';
import { PublicKey } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { buildPurchaseWithSolInstruction, solToLamports } from '../../utils/solanaInstructionBuilder';
import { SOLANA_CONFIG, calculatePurchaseAmounts } from '../../config/solanaAccounts';
import { deriveRecipientTokenAccounts } from '../../utils/deriveATAs';
import PaymentSuccessDialog from './PaymentSuccessDialog';

// Needed to use signSmartContractData in browser
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

interface WalletConnectProps {
  amount?: string;
}

// Wert Configuration for Solana
const WERT_PARTNER_ID = import.meta.env.VITE_WERT_PARTNER_ID || "";
const WERT_PRIVATE_KEY = import.meta.env.VITE_WERT_PRIVATE_KEY || "";
const WERT_ORIGIN = "https://widget.wert.io";

const WalletConnect: React.FC<WalletConnectProps> = ({ amount }) => {
  const { connect, disconnect, isConnected, publicKey, isLoading } = useWallet();
  const [warning, setWarning] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string | undefined>();

  // Clear warning when amount changes
  useEffect(() => {
    if (warning && amount && amount.trim() !== '' && Number(amount) > 0 && !isNaN(Number(amount))) {
      setWarning('');
    }
  }, [amount, warning]);

  // Open Wert widget when wallet is connected
  useEffect(() => {
    if (isConnected && publicKey && amount && !isProcessing) {
      console.log('✅ Wallet connected successfully!');
      console.log('📍 Public Key:', publicKey);
      console.log('💰 Amount:', amount ? `$${amount} USD` : 'Not specified');
      console.log('🔗 Wallet Address:', publicKey);
      
      // Open Wert widget for Solana
      openWertWidget();
    } else if (!isConnected && !isLoading) {
      console.log('🔌 Wallet disconnected');
    }
  }, [isConnected, publicKey, amount, isLoading]);

  const openWertWidget = async () => {
    if (!amount || !publicKey) return;
    
    setIsProcessing(true);
    
    try {
      const usdAmount = Number(amount);
      
      console.log("💰 Opening Wert widget for purchase:");
      console.log("  Amount (USD):", usdAmount);
      console.log("  Recipient:", publicKey);
      console.log("  Program ID:", SOLANA_CONFIG.PROGRAM_ID);
      
      // Calculate purchase amounts - converts USD to SOL and calculates 80/20 split
      // Token price will be fetched from Jupiter/DexScreener automatically
      const amounts = await calculatePurchaseAmounts(usdAmount);
      
      console.log("📊 Purchase breakdown:");
      console.log("  SOL amount:", amounts.solAmount, "SOL");
      console.log("  Total lamports:", amounts.totalLamports);
      console.log("  Swap amount (80%):", amounts.swapLamports / 1_000_000_000, "SOL");
      console.log("  Distribution value (20%):", amounts.distributionValueLamports / 1_000_000_000, "SOL");
      console.log("  SPL tokens to send:", amounts.splTokenAmount);
      console.log("  Min Token2022 to receive:", amounts.minimumToken2022Out);
      
      // Derive recipient's Associated Token Accounts (ATAs)
      const { splTokenAccount: recipientSplTokenAccount, token2022Account: recipientToken2022Account } = 
        await deriveRecipientTokenAccounts(
          publicKey,
          SOLANA_CONFIG.SPL_TOKEN_MINT,
          SOLANA_CONFIG.TOKEN2022_MINT
        );
      
      console.log("📝 Derived recipient token accounts:");
      console.log("  SPL Token Account:", recipientSplTokenAccount);
      console.log("  Token2022 Account:", recipientToken2022Account);
      
      // Build the purchase_with_sol instruction
      const scInputData = await buildPurchaseWithSolInstruction({
        programId: SOLANA_CONFIG.PROGRAM_ID,
        programState: SOLANA_CONFIG.PROGRAM_STATE,
        payer: SOLANA_CONFIG.WERT_SIGNING_ACCOUNT, // Wert's signing account
        programSplTokenAccount: SOLANA_CONFIG.PROGRAM_SPL_TOKEN_ACCOUNT,
        recipientSplTokenAccount,
        splTokenMint: SOLANA_CONFIG.SPL_TOKEN_MINT,
        programToken2022Account: SOLANA_CONFIG.PROGRAM_TOKEN2022_ACCOUNT,
        recipientToken2022Account,
        recipientAddress: publicKey,
        raydiumAmmProgram: SOLANA_CONFIG.RAYDIUM_AMM_PROGRAM,
        ammId: SOLANA_CONFIG.AMM_ID,
        ammAuthority: SOLANA_CONFIG.AMM_AUTHORITY,
        ammOpenOrders: SOLANA_CONFIG.AMM_OPEN_ORDERS,
        ammTargetOrders: SOLANA_CONFIG.AMM_TARGET_ORDERS,
        poolCoinTokenAccount: SOLANA_CONFIG.POOL_COIN_TOKEN_ACCOUNT,
        poolPcTokenAccount: SOLANA_CONFIG.POOL_PC_TOKEN_ACCOUNT,
        serumProgramId: SOLANA_CONFIG.SERUM_PROGRAM_ID,
        serumMarket: SOLANA_CONFIG.SERUM_MARKET,
        serumBids: SOLANA_CONFIG.SERUM_BIDS,
        serumAsks: SOLANA_CONFIG.SERUM_ASKS,
        serumEventQueue: SOLANA_CONFIG.SERUM_EVENT_QUEUE,
        serumCoinVaultAccount: SOLANA_CONFIG.SERUM_COIN_VAULT_ACCOUNT,
        serumPcVaultAccount: SOLANA_CONFIG.SERUM_PC_VAULT_ACCOUNT,
        serumVaultSigner: SOLANA_CONFIG.SERUM_VAULT_SIGNER,
        tokenProgram: SOLANA_CONFIG.TOKEN_PROGRAM,
        systemProgram: SOLANA_CONFIG.SYSTEM_PROGRAM,
        amount: amounts.totalLamports,
        splTokenAmount: amounts.splTokenAmount,
        minimumToken2022Out: amounts.minimumToken2022Out,
      });
      
      console.log("🔧 Built sc_input_data (hex):", scInputData.substring(0, 100) + "...");
      
      // Sign the smart contract data with Wert
      const signedData = signSmartContractData(
        {
          address: SOLANA_CONFIG.WERT_SIGNING_ACCOUNT, // Wert's signing account that holds funds
          commodity: "SOL",
          network: "solana",
          commodity_amount: amounts.solAmount, // SOL amount (not USD)
          sc_address: SOLANA_CONFIG.PROGRAM_ID, // Your Solana program ID
          sc_input_data: scInputData, // Hex-encoded instruction
        },
        WERT_PRIVATE_KEY
      );

      console.log("✅ Wert signedData:", signedData);

      const otherWidgetOptions = {
        partner_id: WERT_PARTNER_ID,
        click_id: uuidv4(), // unique id of purchase
        origin: WERT_ORIGIN,
        listeners: {
          close: () => {
            setIsProcessing(false);
            console.log("Wert widget closed");
          },
          error: (error: any) => {
            setIsProcessing(false);
            console.error("Wert error:", error);
            alert("An error occurred with the payment. Please try again.");
          },
          loaded: () => {
            console.log("Wert widget loaded");
          },
          "payment-status": (data: any) => {
            console.log("Payment status:", data);
            if (data.status === "success") {
              console.log("✅ Payment successful!");
              console.log("Payment data:", JSON.stringify(data, null, 2));
              
              // Extract transaction signature from various possible fields
              const txSignature = 
                data.tx_id || 
                data.transaction_id || 
                data.signature || 
                data.tx_hash ||
                data.transaction_hash ||
                data.txId ||
                data.transactionId;
              
              if (txSignature) {
                console.log("Transaction signature:", txSignature);
                setTransactionSignature(txSignature);
              } else {
                console.warn("No transaction signature found in payment data");
              }
              
              setIsProcessing(false);
              setShowSuccessDialog(true);
            } else if (data.status === "error" || data.status === "failed") {
              setIsProcessing(false);
              console.error("Payment failed:", data);
              alert("Payment failed. Please try again.");
            }
          },
        },
      };

      const wertWidget = new WertWidget({
        ...signedData,
        ...otherWidgetOptions,
      });

      wertWidget.open();
      console.log("🚀 Wert widget opened");
    } catch (error) {
      console.error("Error opening Wert widget:", error);
      setIsProcessing(false);
      alert("Failed to open payment widget: " + (error as Error).message);
    }
  };

  const handleClick = () => {
    console.log('🖱️ Wallet button clicked!');
    console.log('isConnected:', isConnected);
    console.log('isLoading:', isLoading);
    console.log('Amount:', amount);
    
    if (isConnected) {
      //disconnect();
      openWertWidget();
      setWarning('');
    } else {
      // Check if amount is entered
      if (!amount || amount.trim() === '' || Number(amount) <= 0 || isNaN(Number(amount))) {
        setWarning('Please enter a valid amount to buy');
        return;
      }
      
      setWarning('');
      connect();
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Connecting...';
    // if (isConnected && publicKey) {
    //   return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
    // }
    return 'BUY';
  };

  return (
    <>
      <div className="wallet-adapter-button-wrapper">
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="w-full flex items-center justify-center cursor-pointer border-none text-white font-semibold uppercase disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
          style={{
            fontFamily: 'DM Sans, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            minHeight: '44px',
            height: 'auto',
            lineHeight: '1.2',
            padding: '10px 20px',
            borderRadius: '4px',
            backgroundColor: '#1f2937',
            textTransform: 'uppercase',
            boxShadow: '3px 5px #6b72804d',
            whiteSpace: 'nowrap',
          }}
        >
          {isLoading && (
            <svg className="inline-block mr-2 -ml-1 w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {getButtonText()}
        </button>
        {warning && (
          <p className="mt-2 text-sm text-red-500 text-center">{warning}</p>
        )}
      </div>

      {/* Payment Success Dialog */}
      <PaymentSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          setTransactionSignature(undefined);
        }}
        {...(transactionSignature ? { transactionSignature } : {})}
        {...(amount ? { amount } : {})}
        {...(publicKey ? { walletAddress: publicKey } : {})}
      />
    </>
  );
};

export default WalletConnect;