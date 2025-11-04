import React, { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { apiService } from '../../services/api';
import type { ClaimerInfo } from '../../types/claimer';
import ClaimDetails from './ClaimDetails';
import WalletConnect from './WalletConnect';
import Card from './Card';

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


  if (error) {
    return (
      <Card variant="error">
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
      </Card>
    );
  }



  return <ClaimDetails claimerInfo={claimerInfo} isLoading={isLoading} />;
};

export default ClaimInfo;
