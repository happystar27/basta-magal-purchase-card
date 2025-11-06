import React from 'react';

interface PaymentSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transactionSignature?: string;
  amount?: string;
  walletAddress?: string;
}

const PaymentSuccessDialog: React.FC<PaymentSuccessDialogProps> = ({
  isOpen,
  onClose,
  transactionSignature,
  amount,
  walletAddress,
}) => {
  if (!isOpen) return null;

  // Determine if we're on mainnet or devnet based on the transaction signature format
  // For now, we'll use mainnet explorer. You can make this configurable.
  const explorerUrl = transactionSignature
    ? `https://solscan.io/tx/${transactionSignature}`
    : '#';
  
  const walletUrl = walletAddress
    ? `https://solscan.io/account/${walletAddress}`
    : '#';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Payment Successful! 🎉
        </h2>

        {/* Amount */}
        {amount && (
          <p className="text-center text-gray-600 mb-4">
            You've successfully purchased <span className="font-semibold">${amount} USD</span> worth of tokens
          </p>
        )}

        {/* Transaction Signature */}
        {transactionSignature && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Signature:
            </label>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <code className="flex-1 text-xs text-gray-800 break-all font-mono">
                {transactionSignature}
              </code>
              <button
                onClick={() => copyToClipboard(transactionSignature)}
                className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                title="Copy to clipboard"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-col gap-3">
          {transactionSignature && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View Transaction on Solscan
            </a>
          )}

          {walletAddress && (
            <a
              href={walletUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              View Wallet on Solscan
            </a>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

        {/* Info Message */}
        <p className="mt-4 text-xs text-center text-gray-500">
          Your tokens will be sent to your wallet shortly. Please check your wallet or the transaction link above.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessDialog;

