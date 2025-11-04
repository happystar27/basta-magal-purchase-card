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
      
      // If Wallaneer is already selected but not connected, deselect first
      if (wallet?.adapter?.name === 'Wallaneer' && !connected && !connecting) {
        console.log('🔄 Wallaneer already selected but not connected, deselecting first...');
        await solanaDisconnect();
        // Small delay to ensure disconnect completes
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log('✅ Calling select(Wallaneer)...');
      // Always connect directly to Wallaneer without showing wallet selection dialog
      select('Wallaneer' as any);
      
      // Force trigger connection if wallet is already selected
      if (wallet?.adapter?.name === 'Wallaneer') {
        console.log('🔄 Wallet already selected, triggering connect...');
        setTimeout(async () => {
          try {
            await wallet.adapter.connect();
          } catch (err) {
            console.error('Error forcing connection:', err);
          }
        }, 200);
      }
    } catch (error) {
      // If Wallaneer fails for some reason, still try Phantom as fallback
      console.error('Failed to connect with Wallaneer wallet:', error);
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
      <SolanaWalletProvider wallets={wallets} autoConnect>
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