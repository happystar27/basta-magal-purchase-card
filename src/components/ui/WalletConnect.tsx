import React, { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import WertWidget from "@wert-io/widget-initializer";
import { signSmartContractData } from "@wert-io/widget-sc-signer";
import { v4 as uuidv4 } from "uuid";
import { Buffer } from 'buffer';
import '@solana/wallet-adapter-react-ui/styles.css';

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

// Your Solana program ID
const SOLANA_PROGRAM_ID = "GJYzfPqwEdZSLZqAYCGDceUF1PvVs4rfuRyJbT2px4Ks";

const WalletConnect: React.FC<WalletConnectProps> = ({ amount }) => {
  const { connect, disconnect, isConnected, publicKey, isLoading } = useWallet();
  const [warning, setWarning] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
      const amountValue = Number(amount);
      
      console.log("💰 Opening Wert widget for purchase:");
      console.log("  Amount (USD):", amountValue);
      console.log("  Recipient:", publicKey);
      console.log("  Program ID:", SOLANA_PROGRAM_ID);
      
      // For Solana, Wert expects a simple program call
      // The sc_input_data should be the recipient wallet address
      const signedData = signSmartContractData(
        {
          address: publicKey, // Recipient Solana address
          commodity: "SOL",
          network: "solana",
          commodity_amount: amountValue,
          sc_address: SOLANA_PROGRAM_ID, // Your Solana program ID
          sc_input_data: publicKey, // Pass recipient address as input
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
              // Handle successful payment
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
    if (isConnected && publicKey) {
      return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
    }
    return 'BUY';
  };

  return (
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
  );
};

export default WalletConnect;