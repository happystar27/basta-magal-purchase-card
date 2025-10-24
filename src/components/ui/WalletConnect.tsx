import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletConnect: React.FC = () => {
  return (
    <div className="wallet-adapter-button-wrapper">
      <WalletMultiButton className="!bg-amber-500 hover:!bg-amber-600 !text-navy-900 !border-none !rounded-lg !font-semibold !px-4 !py-2 md:!px-8 md:!py-4 !text-sm md:!text-base !transition-all !duration-200 hover:!scale-105" />
    </div>
  );
};

export default WalletConnect;