declare module '@solana/web3.js' {
  export class PublicKey {
    constructor(value: string);
    toString(): string;
  }

  export class Transaction {
    constructor();
  }

  export function clusterApiUrl(network: string): string;
}

declare module '@solana/wallet-adapter-base' {
  import { Transaction, PublicKey } from '@solana/web3.js';

  export type WalletName<T extends string = string> = T & { __brand__: 'WalletName' };

  export type TransactionOrVersionedTransaction<T> = Transaction;

  export enum WalletReadyState {
    Installed = 'Installed',
    NotDetected = 'NotDetected',
    Loadable = 'Loadable',
    Unsupported = 'Unsupported'
  }

  export enum WalletAdapterNetwork {
    Mainnet = 'mainnet-beta',
    Testnet = 'testnet',
    Devnet = 'devnet'
  }

  export class WalletError extends Error {
    constructor(message?: string, error?: any);
  }

  export class WalletConnectionError extends WalletError {}
  export class WalletDisconnectionError extends WalletError {}
  export class WalletNotConnectedError extends WalletError {}
  export class WalletNotReadyError extends WalletError {}

  export abstract class BaseMessageSignerWalletAdapter<T extends string = string> {
    abstract name: WalletName<T>;
    abstract url: string;
    abstract icon: string;
    abstract readonly supportedTransactionVersions: any;
    
    get publicKey(): PublicKey | null;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract signTransaction<T extends TransactionOrVersionedTransaction<any>>(transaction: T): Promise<T>;
    abstract signAllTransactions<T extends TransactionOrVersionedTransaction<any>>(transactions: T[]): Promise<T[]>;
    abstract signMessage(message: Uint8Array): Promise<Uint8Array>;
    
    emit(event: string, ...args: any[]): void;
  }
}

declare module 'magic-sdk' {
  export interface WalletModule {
    connectWithUI(): Promise<string[]>;
    getProvider(): Promise<any>;
  }

  export interface UserModule {
    logout(): Promise<void>;
    getInfo(): Promise<{ publicAddress: string }>;
  }

  export interface SolanaModule {
    connect(): Promise<string[]>;
    signTransaction(transaction: any): Promise<any>;
    signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
  }

  export class Magic {
    wallet: WalletModule;
    user: UserModule;
    solana: SolanaModule;
    
    constructor(apiKey: string, options?: { extensions?: any });
  }
}

declare module '@magic-ext/solana' {
  export class SolanaExtension {
    constructor(options: { rpcUrl: string });
  }
}