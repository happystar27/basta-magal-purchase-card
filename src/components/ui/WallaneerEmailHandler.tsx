import React, { useEffect, useState } from 'react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import EmailModal from './EmailModal';

const WallaneerEmailHandler: React.FC = () => {
  const { wallet } = useSolanaWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (wallet?.adapter?.name === 'Wallaneer') {
      const adapter = wallet.adapter as any;
      
      const handleRequestEmail = () => {
        console.log('📧 Email request received, opening modal...');
        setIsModalOpen(true);
        setIsLoading(false);
      };

      // Listen for email requests from the wallet adapter
      adapter.on('requestEmail', handleRequestEmail);

      return () => {
        adapter.off('requestEmail', handleRequestEmail);
      };
    }
  }, [wallet]);

  const handleEmailSubmit = (email: string) => {
    console.log('📧 Email submitted:', email);
    setIsLoading(true);
    
    if (wallet?.adapter && 'submitEmail' in wallet.adapter) {
      (wallet.adapter as any).submitEmail(email);
    }
    
    // Keep modal open but show loading state
    // Modal will close when connection completes or fails
  };

  const handleEmailCancel = () => {
    console.log('❌ Email input cancelled by user');
    setIsModalOpen(false);
    setIsLoading(false);
    
    if (wallet?.adapter && 'cancelEmail' in wallet.adapter) {
      (wallet.adapter as any).cancelEmail();
    }
  };

  // Close modal when wallet connects successfully
  useEffect(() => {
    if (wallet?.adapter?.connected) {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  }, [wallet?.adapter?.connected]);

  return (
    <EmailModal
      isOpen={isModalOpen}
      onSubmit={handleEmailSubmit}
      onCancel={handleEmailCancel}
      isLoading={isLoading}
    />
  );
};

export default WallaneerEmailHandler;
