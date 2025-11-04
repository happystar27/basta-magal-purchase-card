import React from 'react';
import { useWallet } from '../../contexts/WalletContext';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletConnect: React.FC = () => {
  const { connect, disconnect, isConnected, publicKey, isLoading } = useWallet();

  const handleClick = () => {
    console.log('🖱️ Wallet button clicked!');
    console.log('isConnected:', isConnected);
    console.log('isLoading:', isLoading);
    
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Connecting...';
    if (isConnected && publicKey) {
      return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
    }
    return 'Connect Wallaneer';
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
    </div>
  );
};

export default WalletConnect;