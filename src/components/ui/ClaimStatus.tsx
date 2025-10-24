import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import type { ClaimerInfo } from '../../types/claimer';
import { apiService } from '../../services/api';

interface ClaimStatusProps {
  claimerInfo: ClaimerInfo | null;
  isLoading?: boolean;
}

const ClaimStatus: React.FC<ClaimStatusProps> = ({ claimerInfo, isLoading = false }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second for countdown
  useEffect(() => {
    if (!claimerInfo || claimerInfo.amount === 0 || claimerInfo.isClaimed) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [claimerInfo]);

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-amber-500/30 rounded-full animate-pulse"></div>
          <span className="text-white/70 text-sm md:text-base">Loading claim status...</span>
        </div>
      </div>
    );
  }

  if (!claimerInfo) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20">
        <div className="flex items-center space-x-3">
          <FaExclamationTriangle className="w-6 h-6 text-yellow-400" />
          <span className="text-white/70 text-sm md:text-base">No claim information found</span>
        </div>
      </div>
    );
  }

  // Calculate time remaining based on current time
  const timeRemaining = claimerInfo ? Math.max(0, claimerInfo.validFrom - currentTime) : 0;
  const isClaimValid = timeRemaining === 0 && claimerInfo && !claimerInfo.isClaimed;
  const formattedTimeRemaining = apiService.formatTimeRemaining(timeRemaining);

  const getStatusIcon = () => {
    if (claimerInfo.amount === 0) {
      return <FaTimesCircle className="w-6 h-6 text-gray-400" />;
    } else if (claimerInfo.isClaimed) {
      return <FaCheckCircle className="w-6 h-6 text-green-400" />;
    } else if (isClaimValid) {
      return <FaCheckCircle className="w-6 h-6 text-green-400" />;
    } else {
      return <FaClock className="w-6 h-6 text-yellow-400" />;
    }
  };

  const getStatusText = () => {
    if (claimerInfo.amount === 0) {
      return 'No Tokens to Claim';
    } else if (claimerInfo.isClaimed) {
      return 'Claimed';
    } else if (isClaimValid) {
      return 'Available to Claim';
    } else {
      return `Available in ${formattedTimeRemaining}`;
    }
  };

  const getStatusColor = () => {
    if (claimerInfo.amount === 0) {
      return 'text-gray-400';
    } else if (claimerInfo.isClaimed) {
      return 'text-green-400';
    } else if (isClaimValid) {
      return 'text-green-400';
    } else {
      return 'text-yellow-400';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-white font-semibold text-sm md:text-base">Token Status</h3>
            <p className={`text-sm md:text-base font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimStatus;
