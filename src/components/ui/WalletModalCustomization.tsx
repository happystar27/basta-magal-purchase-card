import React, { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

// This component prevents the wallet modal from showing and forces Wallaneer
const WalletModalCustomization: React.FC = () => {
  const { select, wallet } = useWallet();
  const selectingRef = useRef(false);

  // Override the wallet modal after it renders
  useEffect(() => {
    const hideWalletModal = () => {
      // Find the wallet modal container
      const modalContainer = document.querySelector('.wallet-adapter-modal-wrapper') ||
                           document.querySelector('.wallet-adapter-modal') ||
                           document.querySelector('[role="dialog"][class*="wallet"]');
      
      if (modalContainer) {
        console.log('🚫 Wallet modal detected, hiding it and selecting Wallaneer...');
        
        // Hide the modal immediately
        (modalContainer as HTMLElement).style.display = 'none';
        
        // Remove it from DOM
        setTimeout(() => {
          modalContainer.remove();
        }, 10);
        
        // Select Wallaneer wallet automatically if not already selecting
        if (!selectingRef.current) {
          selectingRef.current = true;
          
          setTimeout(() => {
            try {
              console.log('✅ Selecting Wallaneer wallet');
              select('Wallaneer' as any);
            } catch (error) {
              console.error('Failed to auto-select Wallaneer wallet:', error);
            } finally {
              // Reset the flag after a delay
              setTimeout(() => {
                selectingRef.current = false;
              }, 500);
            }
          }, 100);
        }
      }
    };

    // Try to hide the modal immediately
    hideWalletModal();
    
    // Use MutationObserver to watch for modal changes
    const observer = new MutationObserver(() => {
      hideWalletModal();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, [select, wallet]);

  return null; // This component doesn't render anything
};

export default WalletModalCustomization;
