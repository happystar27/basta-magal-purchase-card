import React, { useEffect, useState } from 'react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import EmailModal from './EmailModal';
import { useNotifications } from './NotificationProvider';

const WallaneerEmailHandler: React.FC = () => {
  const { wallet } = useSolanaWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (wallet?.adapter?.name === 'Wallaneer') {
      const adapter = wallet.adapter as any;
      
      const handleRequestEmail = () => {
        console.log('📧 Email request received, opening modal...');
        setIsModalOpen(true);
        setIsLoading(false);
        setShowOTPInput(false);
      };

      const handleRequestOTP = () => {
        console.log('🔑 OTP request received, showing OTP input...');
        console.log('🔑 Before update - showOTPInput:', showOTPInput, 'isLoading:', isLoading);
        setShowOTPInput(true);
        setIsLoading(false);
        console.log('🔑 States updated - showOTPInput should now be true');
      };

      // Listen for email and OTP requests from the wallet adapter
      adapter.on('requestEmail', handleRequestEmail);
      adapter.on('requestOTP', handleRequestOTP);

      return () => {
        adapter.off('requestEmail', handleRequestEmail);
        adapter.off('requestOTP', handleRequestOTP);
      };
    }
    return undefined;
  }, [wallet]);

  const handleEmailSubmit = (email: string) => {
    console.log('📧 Email submitted:', email);
    console.log('📧 Current states - isModalOpen:', isModalOpen, 'showOTPInput:', showOTPInput);
    setIsLoading(true);
    setSubmittedEmail(email);
    
    if (wallet?.adapter && 'submitEmail' in wallet.adapter) {
      (wallet.adapter as any).submitEmail(email);
      console.log('📧 submitEmail called on adapter');
    }
    
    // Show notification to check email for code
    addNotification({
      type: 'info',
      title: 'Verification Code Sent',
      message: `We've sent a 6-digit verification code to <strong>${email}</strong>. Please check your email.`,
      duration: 8000
    });
    
    // Modal will transition to OTP input when adapter emits 'requestOTP'
    console.log('📧 Waiting for requestOTP event from adapter...');
  };

  const handleOTPSubmit = (otp: string) => {
    console.log('🔑 OTP submitted:', otp);
    setIsLoading(true);
    
    if (wallet?.adapter && 'submitOTP' in wallet.adapter) {
      (wallet.adapter as any).submitOTP(otp);
    }
    
    // Modal will close when connection completes or fails
  };

  const handleEmailCancel = () => {
    console.log('❌ Email/OTP input cancelled by user');
    setIsModalOpen(false);
    setIsLoading(false);
    setShowOTPInput(false);
    setSubmittedEmail('');
    
    if (showOTPInput && wallet?.adapter && 'cancelOTP' in wallet.adapter) {
      (wallet.adapter as any).cancelOTP();
    } else if (wallet?.adapter && 'cancelEmail' in wallet.adapter) {
      (wallet.adapter as any).cancelEmail();
    }
  };

  // Close modal when wallet connects successfully
  useEffect(() => {
    if (wallet?.adapter?.connected) {
      setIsModalOpen(false);
      setIsLoading(false);
      setShowOTPInput(false);
      setSubmittedEmail('');
    }
  }, [wallet?.adapter?.connected]);

  return (
    <EmailModal
      isOpen={isModalOpen}
      onSubmit={handleEmailSubmit}
      onCancel={handleEmailCancel}
      isLoading={isLoading}
      showOTPInput={showOTPInput}
      onOTPSubmit={handleOTPSubmit}
      submittedEmailProp={submittedEmail}
    />
  );
};

export default WallaneerEmailHandler;
