import React, { useState } from "react";
import { FaShoppingCart, FaWallet } from "react-icons/fa";
import type { ClaimerInfo } from "../../types/claimer";
import { useWallet } from "../../contexts/WalletContext";
import { signSmartContractData } from "@wert-io/widget-sc-signer";
import { v4 as uuidv4 } from "uuid";
import Card from "./Card";
import WalletConnect from "./WalletConnect";

interface ClaimDetailsProps {
  claimerInfo: ClaimerInfo | null;
  isLoading?: boolean;
}

// Wert Configuration - Replace with your actual values
const WERT_PARTNER_ID =
  import.meta.env.VITE_WERT_PARTNER_ID || "your_partner_id";
const WERT_URL = "https://widget.wert.io";
const WERT_CONTRACT_ADDRESS =
  import.meta.env.VITE_WERT_CONTRACT_ADDRESS || "0x...";
const DEFAULT_EOA_ADDRESS = import.meta.env.VITE_DEFAULT_EOA_ADDRESS || "0x...";
const WERT_PRIVATE_KEY = import.meta.env.VITE_WERT_PRIVATE_KEY || "";

const ClaimDetails: React.FC<ClaimDetailsProps> = ({
  claimerInfo,
  isLoading = false,
}) => {
  const { isConnected, publicKey } = useWallet();
  const [buyAmount, setBuyAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuyTokens = () => {
    const amountToBuy = Number(buyAmount);

    if (amountToBuy <= 0 || isNaN(amountToBuy)) {
      alert("Please enter a valid amount");
      return;
    }

    if (!isConnected || !publicKey) {
      alert("Please connect your wallet first");
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
            console.log("Wert widget closed");
          },
          error: (error: any) => {
            setIsProcessing(false);
            console.error("Wert error: ", error);
            alert("An error occurred. Please try again.");
          },
          loaded: () => console.log("Wert widget loaded"),
        },
      };

      // Use global WertWidget from script
      const WertWidget = (window as any).WertWidget;

      if (!WertWidget) {
        console.error("WertWidget not loaded");
        setIsProcessing(false);
        alert("Payment widget not loaded. Please refresh the page.");
        return;
      }

      const wertWidget = new WertWidget({
        ...signedData,
        ...otherWidgetOptions,
      });

      wertWidget.open();
    } catch (error) {
      console.error("Error opening Wert widget:", error);
      setIsProcessing(false);
      alert("Failed to open payment widget");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Buy Tokens
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded animate-pulse bg-amber-500/30"></div>
              <div className="flex-1">
                <div className="mb-2 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                <div className="w-2/3 h-3 bg-gray-100 rounded animate-pulse dark:bg-gray-600"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        {/* Buy Tokens Section */}
        <div className="flex items-center mb-3 space-x-2">
          <FaShoppingCart className="w-5 h-5 text-[#6b7280]" />
          <h4 className="font-semibold text-center text-[#6b7280] uppercase dark:text-white">
            Buy Tokens
          </h4>
        </div>

        <div className="space-y-3">
          <div>
            <label
              htmlFor="buyAmount"
              className="block mb-2 text-sm text-gray-700 dark:text-gray-400"
            >
              Amount (USD)
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
              className="px-3 py-2 w-full placeholder-gray-500 text-gray-800 bg-white rounded-md border border-black shadow-[3px_5px_0_rgba(107,114,128,0.3)] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {isConnected ? (
            <button
              onClick={handleBuyTokens}
              disabled={isProcessing || !buyAmount || Number(buyAmount) <= 0}
              className="flex justify-center items-center px-4 py-3 space-x-2 w-full font-semibold text-white bg-amber-500 rounded-md transition-colors hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <svg
                    className="w-5 h-5 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
          ) : (
            <div className="w-full">
              <WalletConnect />
            </div>
          )}

          <p className="text-xs text-center text-gray-600 dark:text-gray-400">
            Powered by Magallaneer - Buy crypto with card
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ClaimDetails;
