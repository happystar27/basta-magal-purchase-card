import React, { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { apiService } from '../../services/api';
import type { ClaimerInfo } from '../../types/claimer';
import ClaimStatus from './ClaimStatus';
import ClaimDetails from './ClaimDetails';
import TokenDisplay from './TokenDisplay';

const ClaimInfo: React.FC = () => {
  const { isConnected, publicKey } = useWallet();
  const [claimerInfo, setClaimerInfo] = useState<ClaimerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClaimerInfo = async () => {
    if (!isConnected || !publicKey) {
      setClaimerInfo(null);
      setError(null);
      return;
    }

    //setIsLoading(true);
    setIsLoading(false);
    setError(null);

  };

  useEffect(() => {
    fetchClaimerInfo();
  }, [isConnected, publicKey]);

  if (!isConnected) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-gray-800 dark:text-white font-semibold text-lg mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Connect your wallet to buy tokens.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-gray-800 dark:text-white font-semibold text-lg mb-2">Error Loading Claim Info</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchClaimerInfo}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-4">
      <TokenDisplay />
      {/* <ClaimStatus claimerInfo={claimerInfo} isLoading={isLoading} /> */}
      <ClaimDetails claimerInfo={claimerInfo} isLoading={isLoading} />
    </div>
  );
};

export default ClaimInfo;
