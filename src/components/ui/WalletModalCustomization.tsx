import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

// This component customizes the wallet modal to add the "Don't have a wallet?" option
const WalletModalCustomization: React.FC = () => {
  const { select } = useWallet();

  // Override the wallet modal after it renders
  React.useEffect(() => {
    const addNoWalletOption = () => {
      // Find the wallet modal container - try multiple selectors
      const modalContainer = document.querySelector('[data-rk]') || 
                           document.querySelector('.wallet-adapter-modal-wrapper') ||
                           document.querySelector('.wallet-adapter-modal') ||
                           document.querySelector('[role="dialog"]') ||
                           document.querySelector('.wallet-adapter-modal-overlay');
      
      if (modalContainer) {
        // Check if we already added the option
        if (modalContainer.querySelector('.no-wallet-option')) {
          return;
        }

        // Find the wallet list container within the modal
        const walletList = modalContainer.querySelector('.wallet-adapter-modal-list') ||
                         modalContainer.querySelector('[data-rk="wallet-list"]') ||
                         modalContainer.querySelector('ul') ||
                         modalContainer;

        if (walletList) {
          // Create the "Don't have a wallet?" option
          const noWalletOption = document.createElement('div');
          noWalletOption.className = 'no-wallet-option';
          noWalletOption.innerHTML = `
            <div style="
              padding: 16px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              margin-top: 8px;
            ">
              <button 
                onclick="window.open('https://wallaneer.io', '_blank')"
                style="
                  background: none;
                  border: none;
                  color: #6b7280;
                  font-size: 14px;
                  cursor: pointer;
                  text-decoration: underline;
                  transition: color 0.2s;
                  padding: 8px;
                "
                onmouseover="this.style.color='#374151'"
                onmouseout="this.style.color='#6b7280'"
              >
                Don't have a wallet? Get Wallaneer →
              </button>
            </div>
          `;

          // Add it to the modal
          walletList.appendChild(noWalletOption);
        }
      }
    };

    // Try to add the option immediately and on DOM changes
    addNoWalletOption();
    
    // Use MutationObserver to watch for modal changes
    const observer = new MutationObserver(() => {
      addNoWalletOption();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default WalletModalCustomization;
