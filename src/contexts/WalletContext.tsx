import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { WallaneerWalletAdapter } from '../wallets/WallaneerWalletAdapter';

interface WalletContextType {
  isConnected: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

// Inner component that uses the Solana wallet adapter
const WalletContextProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { connected, publicKey, connecting, select, disconnect: solanaDisconnect, wallet } = useSolanaWallet();
  
  // Track if we've initiated a connection request
  const connectionRequested = React.useRef(false);

  // Handle Magic Link callback - auto-reconnect when returning from email verification
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const magicToken = urlParams.get('magic_credential');
    const magicState = urlParams.get('state');
    const isMagicCallback = !!(magicToken || magicState);
    
    if (isMagicCallback) {
      console.log('🔗 Magic Link callback detected in WalletContext!');
      console.log('   Connected:', connected);
      console.log('   Connecting:', connecting);
      console.log('   Wallet:', wallet?.adapter?.name);
      console.log('   Magic token present:', !!magicToken);
      
      // If already connected or connecting, don't do anything
      if (connected || connecting) {
        console.log('   Already connected/connecting, skipping...');
        return undefined;
      }
      
      // Ensure Wallaneer is selected
      if (wallet?.adapter?.name !== 'Wallaneer') {
        console.log('🔄 Selecting Wallaneer wallet...');
        select('Wallaneer' as any);
        // Don't return here - let it continue to connect in the next render
        return undefined;
      }
      
      // Trigger connection immediately - the adapter will handle the credential
      console.log('🔄 Triggering wallet connection to process Magic credential...');
      const connectAfterCallback = setTimeout(async () => {
        try {
          if (wallet?.adapter && !connected && !connecting) {
            console.log('🚀 Calling wallet.adapter.connect()...');
            await wallet.adapter.connect();
            console.log('✅ Wallet connected successfully after Magic callback');
          }
        } catch (error: any) {
          console.error('❌ Error connecting after Magic callback:', error);
          console.error('   Error message:', error.message);
        }
      }, 300); // Reduced delay - the adapter will handle the credential processing
      
      return () => clearTimeout(connectAfterCallback);
    }
    return undefined;
  }, [connected, connecting, wallet, select]); // Re-run when wallet state changes
  
  // Auto-trigger connection when Wallaneer is selected (for regular connect flow)
  React.useEffect(() => {
    // Only trigger if we have a connection request pending and Wallaneer is now selected
    if (connectionRequested.current && wallet?.adapter?.name === 'Wallaneer' && !connected && !connecting) {
      console.log('🔄 Wallaneer selected, triggering connection...');
      connectionRequested.current = false; // Reset flag
      
      const triggerConnect = setTimeout(async () => {
        try {
          if (wallet?.adapter && !connected && !connecting) {
            console.log('🚀 Auto-calling wallet.adapter.connect() after selection...');
            await wallet.adapter.connect();
          }
        } catch (error: any) {
          console.error('❌ Error auto-connecting after selection:', error);
        }
      }, 100);
      
      return () => clearTimeout(triggerConnect);
    }
    return undefined;
  }, [wallet, connected, connecting]);
  
  // Debug wallet connection
  React.useEffect(() => {
    // console.log('🔄 Wallet state changed:', {
    //   connected,
    //   publicKey: publicKey?.toString(),
    //   connecting,
    //   walletName: wallet?.adapter?.name
    // });
  }, [connected, publicKey, connecting, wallet]);

  const connect = async () => {
    try {
      console.log('🔗 Connect function called!');
      console.log('Current wallet:', wallet?.adapter?.name);
      console.log('Currently connecting:', connecting);
      console.log('Currently connected:', connected);
      
      // If Wallaneer is not selected, select it and set flag
      if (wallet?.adapter?.name !== 'Wallaneer') {
        console.log('🔄 Selecting Wallaneer wallet...');
        connectionRequested.current = true; // Set flag so effect will trigger connection
        select('Wallaneer' as any);
        return;
      }
      
      // If Wallaneer is already selected, just call connect directly
      console.log('✅ Wallaneer already selected, calling connect directly...');
      if (wallet?.adapter) {
        await wallet.adapter.connect();
      }
    } catch (error) {
      // If Wallaneer fails for some reason, still try Phantom as fallback
      console.error('Failed to connect with Wallaneer wallet:', error);
      connectionRequested.current = false; // Reset flag on error
      select('Phantom' as any);
    }
  };

  const disconnect = async () => {
    try {
      await solanaDisconnect();
    } catch (error) {
     // console.error('Failed to disconnect wallet:', error);
    }
  };

  const value: WalletContextType = {
    isConnected: connected,
    publicKey: publicKey?.toString() || null,
    connect,
    disconnect,
    isLoading: connecting,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new WallaneerWalletAdapter(import.meta.env.VITE_MAGIC_API_KEY || 'pk_live_your_magic_api_key'),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletContext');
  }
  return context;
};