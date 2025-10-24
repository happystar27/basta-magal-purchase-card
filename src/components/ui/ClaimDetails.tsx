import React, { useState } from 'react';
import { FaCoins, FaCalendarAlt, FaReceipt, FaExternalLinkAlt, FaShoppingCart, FaCopy, FaCheck } from 'react-icons/fa';
import type { ClaimerInfo } from '../../types/claimer';
import { useWallet } from '../../contexts/WalletContext';
import { signSmartContractData } from '@wert-io/widget-sc-signer';
import { v4 as uuidv4 } from 'uuid';

interface ClaimDetailsProps {
  claimerInfo: ClaimerInfo | null;
  isLoading?: boolean;
}

// Wert Configuration - Replace with your actual values
const WERT_PARTNER_ID = import.meta.env.VITE_WERT_PARTNER_ID || 'your_partner_id';
const WERT_URL = 'https://widget.wert.io';
const WERT_CONTRACT_ADDRESS = import.meta.env.VITE_WERT_CONTRACT_ADDRESS || '0x...';
const DEFAULT_EOA_ADDRESS = import.meta.env.VITE_DEFAULT_EOA_ADDRESS || '0x...';
const WERT_PRIVATE_KEY = import.meta.env.VITE_WERT_PRIVATE_KEY || '';

const ClaimDetails: React.FC<ClaimDetailsProps> = ({ claimerInfo, isLoading = false }) => {
  const { isConnected, publicKey } = useWallet();
  const [buyAmount, setBuyAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Token data
  const tokens = [
    {
      name: 'MAGAL',
      symbol: 'MAGAL',
      icon: '/assets/logo.png',
      address: 'A2ZbCHUEiHgSwFJ9EqgdYrFF255RQpAZP2xEC62fpump',
      status: 'active',
      description: 'Magallaneer native token'
    },
    {
      name: 'BASTA',
      symbol: 'BASTA', 
      icon: '/assets/Logo-basta.png',
      address: 'Coming Soon',
      status: 'coming-soon',
      description: 'Basta protocol token'
    }
  ];
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTransactionHash = (hash: string) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const handleBuyTokens = () => {
    const amountToBuy = Number(buyAmount);
    
    if (amountToBuy <= 0 || isNaN(amountToBuy)) {
      alert('Please enter a valid amount');
      return;
    }

    if (!isConnected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare smart contract data - adjust according to your contract
      const wertData = publicKey; // You may need to adjust this based on your contract

      const signedData = signSmartContractData(
        {
          address: DEFAULT_EOA_ADDRESS,
          commodity: "USDT", // USDT on mainnet
          network: "bsc",
          commodity_amount: amountToBuy,
          sc_address: WERT_CONTRACT_ADDRESS,
          sc_input_data: wertData,
        },
        WERT_PRIVATE_KEY
      );

      console.log("signedData", signedData);

      const otherWidgetOptions = {
        partner_id: WERT_PARTNER_ID,
        click_id: uuidv4(), // unique id of purchase in your system
        origin: WERT_URL,
        listeners: {
          close: () => {
            setIsProcessing(false);
            console.log('Wert widget closed');
          },
          error: (error: any) => {
            setIsProcessing(false);
            console.error("Wert error: ", error);
            alert('An error occurred. Please try again.');
          },
          loaded: () => console.log('Wert widget loaded'),
        },
      };

      // Use global WertWidget from script
      const WertWidget = (window as any).WertWidget;
      
      if (!WertWidget) {
        console.error('WertWidget not loaded');
        setIsProcessing(false);
        alert('Payment widget not loaded. Please refresh the page.');
        return;
      }

      const wertWidget = new WertWidget({
        ...signedData,
        ...otherWidgetOptions,
      });

      wertWidget.open();
    } catch (error) {
      console.error('Error opening Wert widget:', error);
      setIsProcessing(false);
      alert('Failed to open payment widget');
    }
  };;


  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 className="text-gray-800 dark:text-white font-semibold text-lg mb-4">Buy Tokens</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-amber-500/30 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
      
      <div className="space-y-4">
      
        {/* Buy Tokens Section - Only show when wallet is connected */}
        {isConnected && (
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <FaShoppingCart className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h4 className="text-gray-800 dark:text-white font-semibold">Buy Tokens</h4>
        </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="buyAmount" className="block text-gray-700 dark:text-gray-400 text-sm mb-2">
                  Amount (USDT)
                </label>
                <input
                  type="number"
                  id="buyAmount"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  disabled={isProcessing}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                />
              </div>

              <button
                onClick={handleBuyTokens}
                disabled={isProcessing || !buyAmount || Number(buyAmount) <= 0}
                className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="w-4 h-4" />
                    <span>Buy with Card</span>
                  </>
                )}
              </button>

              <p className="text-gray-600 dark:text-gray-400 text-xs text-center">
                Powered by Magallaneer - Buy crypto with card
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimDetails;
