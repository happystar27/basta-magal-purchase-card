import React, { createContext, useContext, useMemo } from 'react';

// Language mode: 1 = English, anything else = Spanish
const LANGUAGE_MODE = parseInt(import.meta.env.VITE_LANGUAGE_MODE || '0', 10);
const IS_ENGLISH = LANGUAGE_MODE === 1;

interface Translations {
  // EmailModal
  getVerificationCode: string;
  enterVerificationCode: string;
  emailAddress: string;
  enterEmailDescription: string;
  emailRequired: string;
  invalidEmail: string;
  cancel: string;
  verify: string;
  verifyCode: string;
  sending: string;
  verifying: string;
  verificationCodeSent: string;
  verificationCodeSentTo: string;
  checkEmailEnterCode: string;
  verificationCode: string;
  verificationCodeRequired: string;
  invalidCode: string;
  
  // WalletConnect
  buy: string;
  connecting: string;
  enterValidAmount: string;
  
  // PaymentSuccessDialog
  paymentSuccessful: string;
  successfullyPurchased: string;
  transactionSignature: string;
  copy: string;
  copyToClipboard: string;
  viewWalletOnSolscan: string;
  close: string;
  tokensWillBeSent: string;
  
  // Notifications
  verificationCodeSentTitle: string;
  verificationCodeSentMessage: string;
  
  // BridgeHeader
  magalAndBasta: string;
  bastaMagalMadeEasy: string;
  oneCardBalancedTokens: string;
  zeroHassle: string;
  
  // ClaimDetails
  buyTokens: string;
  amountUSD: string;
  enterAmount: string;
  poweredByMagallaneer: string;
  pleaseEnterValidAmount: string;
  pleaseConnectWallet: string;
  errorOccurred: string;
  paymentWidgetNotLoaded: string;
  failedToOpenPaymentWidget: string;
}

const translations: { en: Translations; es: Translations } = {
  en: {
    getVerificationCode: 'Get Verification Code',
    enterVerificationCode: 'Enter Verification Code',
    emailAddress: 'Email Address',
    enterEmailDescription: 'Enter your email address to receive a verification code for secure wallet access.',
    emailRequired: 'Email is required',
    invalidEmail: 'Please enter a valid email address',
    cancel: 'Cancel',
    verify: 'VERIFY',
    verifyCode: 'VERIFY CODE',
    sending: 'Sending...',
    verifying: 'Verifying...',
    verificationCodeSent: 'Verification Code Sent',
    verificationCodeSentTo: "We've sent a 6-digit verification code to:",
    checkEmailEnterCode: 'Please check your email and enter the code below.',
    verificationCode: 'Verification Code',
    verificationCodeRequired: 'Verification code is required',
    invalidCode: 'Please enter a valid 6-digit code',
    buy: 'BUY',
    connecting: 'Connecting...',
    enterValidAmount: 'Please enter a valid amount to buy',
    paymentSuccessful: 'Payment Successful! 🎉',
    successfullyPurchased: "You've successfully purchased",
    transactionSignature: 'Transaction Signature:',
    copy: 'Copy',
    copyToClipboard: 'Copy to clipboard',
    viewWalletOnSolscan: 'View Wallet on Solscan',
    close: 'Close',
    tokensWillBeSent: 'Your tokens will be sent to your wallet shortly. Please check your wallet or the transaction link above.',
    verificationCodeSentTitle: 'Verification Code Sent',
    verificationCodeSentMessage: "We've sent a 6-digit verification code to",
    magalAndBasta: '$MAGAL & $BASTA',
    bastaMagalMadeEasy: 'Basta & Magal Made Easy:',
    oneCardBalancedTokens: 'One Card, Balanced Tokens,',
    zeroHassle: 'Zero Hassle',
    buyTokens: 'Buy Tokens',
    amountUSD: 'Amount (USD)',
    enterAmount: 'Enter amount',
    poweredByMagallaneer: 'Powered by Magallaneer - Buy crypto with card',
    pleaseEnterValidAmount: 'Please enter a valid amount',
    pleaseConnectWallet: 'Please connect your wallet first',
    errorOccurred: 'An error occurred. Please try again.',
    paymentWidgetNotLoaded: 'Payment widget not loaded. Please refresh the page.',
    failedToOpenPaymentWidget: 'Failed to open payment widget',
  },
  es: {
    getVerificationCode: 'Obtener Código de Verificación',
    enterVerificationCode: 'Ingresar Código de Verificación',
    emailAddress: 'Dirección de Correo',
    enterEmailDescription: 'Ingresa tu dirección de correo para recibir un código de verificación para acceso seguro a la billetera.',
    emailRequired: 'El correo es requerido',
    invalidEmail: 'Por favor ingresa una dirección de correo válida',
    cancel: 'Cancelar',
    verify: 'VERIFICAR',
    verifyCode: 'VERIFICAR CÓDIGO',
    sending: 'Enviando...',
    verifying: 'Verificando...',
    verificationCodeSent: 'Código de Verificación Enviado',
    verificationCodeSentTo: 'Hemos enviado un código de verificación de 6 dígitos a:',
    checkEmailEnterCode: 'Por favor revisa tu correo e ingresa el código a continuación.',
    verificationCode: 'Código de Verificación',
    verificationCodeRequired: 'El código de verificación es requerido',
    invalidCode: 'Por favor ingresa un código válido de 6 dígitos',
    buy: 'COMPRAR',
    connecting: 'Conectando...',
    enterValidAmount: 'Por favor ingresa un monto válido para comprar',
    paymentSuccessful: '¡Pago Exitoso! 🎉',
    successfullyPurchased: 'Has comprado exitosamente',
    transactionSignature: 'Firma de Transacción:',
    copy: 'Copiar',
    copyToClipboard: 'Copiar al portapapeles',
    viewWalletOnSolscan: 'Ver Billetera en Solscan',
    close: 'Cerrar',
    tokensWillBeSent: 'Tus tokens serán enviados a tu billetera en breve. Por favor revisa tu billetera o el enlace de transacción arriba.',
    verificationCodeSentTitle: 'Código de Verificación Enviado',
    verificationCodeSentMessage: 'Hemos enviado un código de verificación de 6 dígitos a',
    magalAndBasta: '$MAGAL & $BASTA',
    bastaMagalMadeEasy: 'Basta & Magal Hecho Fácil:',
    oneCardBalancedTokens: 'Una Tarjeta, Tokens Balanceados,',
    zeroHassle: 'Sin Complicaciones',
    buyTokens: 'Comprar Tokens',
    amountUSD: 'Monto (USD)',
    enterAmount: 'Ingresa el monto',
    poweredByMagallaneer: 'Impulsado por Magallaneer - Compra cripto con tarjeta',
    pleaseEnterValidAmount: 'Por favor ingresa un monto válido',
    pleaseConnectWallet: 'Por favor conecta tu billetera primero',
    errorOccurred: 'Ocurrió un error. Por favor intenta de nuevo.',
    paymentWidgetNotLoaded: 'El widget de pago no se cargó. Por favor actualiza la página.',
    failedToOpenPaymentWidget: 'Error al abrir el widget de pago',
  },
};

interface LanguageContextType {
  t: Translations;
  isEnglish: boolean;
  languageMode: number;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const value = useMemo(() => {
    const t = IS_ENGLISH ? translations.en : translations.es;
    return {
      t,
      isEnglish: IS_ENGLISH,
      languageMode: LANGUAGE_MODE,
    };
  }, []);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;

