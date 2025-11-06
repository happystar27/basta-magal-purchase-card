import {
  BaseMessageSignerWalletAdapter,
  WalletConnectionError,
  WalletDisconnectionError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletReadyState,
} from '@solana/wallet-adapter-base';
import type { WalletName } from '@solana/wallet-adapter-base';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Magic } from 'magic-sdk';
import { SolanaExtension } from '@magic-ext/solana';

export const WallaneerWalletName = 'Wallaneer' as WalletName<'Wallaneer'>;

export class WallaneerWalletAdapter extends BaseMessageSignerWalletAdapter {
  name = WallaneerWalletName;
  url = 'https://wallaneer.io';
  icon = '/assets/wallaneer.svg';
  readonly supportedTransactionVersions = null;

  private _connecting: boolean;
  private _magic: Magic | null;
  private _publicKey: PublicKey | null;
  private _emailPromiseResolve: ((email: string | null) => void) | null = null;

  constructor(magicApiKey: string) {
    super();
    this._connecting = false;
    this._magic = null;
    this._publicKey = null;
    
    // Initialize Magic with Solana extension
    if (typeof window !== 'undefined') {
     // console.log('🔧 Initializing Magic with Solana extension...');
      this._magic = new Magic(magicApiKey, {
        extensions: [
          new SolanaExtension({
            rpcUrl: 'https://mainnet.helius-rpc.com/?api-key=f110bfa6-9b80-444d-a685-d1b0d3c48603'
          })
        ]
      });
     // console.log('✅ Magic initialized:', this._magic);
     // console.log('🔍 Magic solana extension:', (this._magic as any).solana);
    }
  }

  override get publicKey(): PublicKey | null {
    return this._publicKey;
  }

  override get connecting(): boolean {
    return this._connecting;
  }

  override get connected(): boolean {
    return !!this._publicKey;
  }

  override get readyState(): WalletReadyState {
    return typeof window !== 'undefined' && this._magic
      ? WalletReadyState.Installed
      : WalletReadyState.NotDetected;
  }

  async connect(): Promise<void> {
    try {
      // If already connected, skip
      if (this.connected) {
        console.log('🔄 Already connected, skipping...');
        return;
      }
      
      // If connecting AND we have a pending email promise, skip
      // Otherwise reset and allow reconnection
      if (this.connecting) {
        if (this._emailPromiseResolve) {
          console.log('🔄 Already connecting with pending email request, skipping...');
          return;
        } else {
          console.log('🔄 Connecting state was stuck, resetting...');
          this._connecting = false;
        }
      }
      ``
      if (this.readyState !== WalletReadyState.Installed) throw new WalletNotReadyError();

      this._connecting = true;
      console.log('🔄 Setting connecting state to true');

      if (!this._magic) throw new WalletNotReadyError();

      // Add timeout to prevent infinite connecting
      const connectTimeout = setTimeout(() => {
       // console.error('⏰ Connection timeout after 60 seconds');
        this._connecting = false;
        this.emit('error', new WalletConnectionError('Connection timeout'));
      }, 60000); // 60 second timeout

      try {
        // Connect with Magic Solana using email
       // console.log('🔗 Connecting with Magic Solana...');
       // console.log('🔍 Magic object:', this._magic);
       // console.log('🔍 Magic solana property:', (this._magic as any).solana);
       // console.log('🔍 Available methods on solana:', Object.getOwnPropertyNames((this._magic as any).solana || {}));
        
        // Check if user is already logged in
       // console.log('🔍 Checking if user is already logged in...');
        const isLoggedIn = await (this._magic as any).user.isLoggedIn();
       // console.log('🔐 Is logged in:', isLoggedIn);
        
        if (!isLoggedIn) {
          // Show email modal for Magic Link authentication
         // console.log('📧 Requesting email from user...');
          const email = await this.requestEmail();
          
          if (!email) {
            console.log('❌ User cancelled email input');
            clearTimeout(connectTimeout);
            this._connecting = false;
            throw new WalletConnectionError('Email input cancelled');
          }
          
          console.log('📧 Starting Magic Link authentication for:', email);
          try {
            await (this._magic as any).auth.loginWithMagicLink({
              email: email
            });
           // console.log('✅ User authenticated with Magic');
          } catch (authError: any) {
           // console.error('❌ Authentication failed:', authError);
            throw new WalletConnectionError('Magic authentication failed: ' + authError.message);
          }
        } else {
         //  console.log('✅ User already logged in');
        }
        
        // Get Solana wallet address
     // console.log('🔍 Getting Solana wallet address...');
        
        // Try getting the address from Solana extension first
        let publicAddress: string | null = null;
        
        try {
          // Get metadata which includes all available addresses
          const metadata = await (this._magic as any).user.getMetadata();
          //console.log('📧 User metadata received:', metadata);
          
          // For Solana, the public address should be in metadata.publicAddress
          if (metadata && metadata.publicAddress) {
            publicAddress = metadata.publicAddress;
       //     console.log('✅ Found public address in metadata:', publicAddress);
          }
        } catch (metadataError: any) {
         // console.error('❌ Error getting metadata:', metadataError);
        }
        
        // If no public address, try getInfo
        if (!publicAddress) {
          try {
            const info = await (this._magic as any).user.getInfo();
          //  console.log('📧 User info received:', info);
            
            // Check for Solana address in wallets.solana.publicAddress
            if (info && info.wallets && info.wallets.solana && info.wallets.solana.publicAddress) {
              publicAddress = info.wallets.solana.publicAddress;
              //console.log('✅ Found Solana public address in info.wallets.solana:', publicAddress);
            } else if (info && info.publicAddress) {
              publicAddress = info.publicAddress;
             // console.log('✅ Found public address in info:', publicAddress);
            }
          } catch (infoError: any) {
           // console.error('❌ Error getting info:', infoError);
          }
        }
        
        if (publicAddress) {
         // console.log('✅ Setting public key:', publicAddress);
          this._publicKey = new PublicKey(publicAddress);
         // console.log('🔑 Solana public key created:', this._publicKey.toString());
          clearTimeout(connectTimeout);
          this.emit('connect', this._publicKey);
        } else {
          clearTimeout(connectTimeout);
          throw new WalletConnectionError('No public address returned from Magic. Please ensure Solana extension is properly configured.');
        }
      } catch (error: any) {
        clearTimeout(connectTimeout);
        throw new WalletConnectionError(error?.message, error);
      }
    } catch (error: any) {
     // console.error('🚨 Connection error:', error);
      this.emit('error', error);
      throw error;
    } finally {
     // console.log('🔄 Setting connecting state to false');
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    console.log('🔌 Disconnecting wallet...');
    
    // Reset connection state
    this._connecting = false;
    
    if (this._magic && this._publicKey) {
      this._publicKey = null;

      try {
        await (this._magic as any).user.logout();
        console.log('✅ User logged out from Magic');
      } catch (error: any) {
        console.error('❌ Logout error:', error);
        this.emit('error', new WalletDisconnectionError(error?.message, error));
      }
    }

    this.emit('disconnect');
    console.log('🔌 Wallet disconnected');
  }

  // Manual reset method to fix stuck connecting state
  resetConnection(): void {
    console.log('🔄 Manually resetting connection state...');
    this._connecting = false;
    this._publicKey = null;
    this._emailPromiseResolve = null; // Ensure any pending email promise is cleared
    
    // Force a disconnect event to reset the wallet state
    this.emit('disconnect');
    
    // Small delay to ensure state is fully reset
    setTimeout(() => {
      console.log('✅ Connection state fully reset');
    }, 100);
  }

  // Email modal methods
  requestEmail(): Promise<string | null> {
    return new Promise((resolve) => {
      this._emailPromiseResolve = resolve;
      this.emit('requestEmail');
    });
  }

  submitEmail(email: string): void {
    if (this._emailPromiseResolve) {
      this._emailPromiseResolve(email);
      this._emailPromiseResolve = null;
    }
  }

  cancelEmail(): void {
    console.log('❌ cancelEmail called');
    if (this._emailPromiseResolve) {
      this._emailPromiseResolve(null);
      this._emailPromiseResolve = null;
    }
    
    // Reset connection state when email is cancelled
    this._connecting = false;
    console.log('✅ Connection state reset, _connecting:', this._connecting);
  }

  async signTransaction<T extends Transaction>(transaction: T): Promise<T> {
    try {
      if (!this._magic || !this._publicKey) throw new WalletNotConnectedError();

      try {
        // Sign transaction using Magic Solana
        const signedTransaction = await (this._magic as any).solana.signTransaction(transaction);
        console.log('🔏 Transaction signed with Magic Solana');
        return signedTransaction as T;
      } catch (error: any) {
        throw error;
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async signAllTransactions<T extends Transaction>(transactions: T[]): Promise<T[]> {
    try {
      if (!this._magic || !this._publicKey) throw new WalletNotConnectedError();

      try {
        // Sign all transactions using Magic Solana
        const signedTransactions = await Promise.all(
          transactions.map(tx => (this._magic as any)!.solana.signTransaction(tx))
        );
        console.log('🔏 All transactions signed with Magic Solana');
        return signedTransactions as T[];
      } catch (error: any) {
        throw error;
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    try {
      if (!this._magic || !this._publicKey) throw new WalletNotConnectedError();

      try {
        // Sign message using Magic Solana
        const signedMessage = await (this._magic as any).solana.signMessage(message);
        console.log('🔏 Message signed with Magic Solana');
        return signedMessage.signature;
      } catch (error: any) {
        throw error;
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }
}

