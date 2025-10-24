import type { ClaimerInfo, ClaimerApiResponse, FindClaimerRequest, ClaimRequest, ClaimResponse } from '../types/claimer';

// API Configuration
const API_URL = 'https://magal-claim-api.proskillowner.com';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Find claimer information by address
   */
  async findClaimer(claimerAddress: string): Promise<ClaimerApiResponse> {
    try {
      const requestBody: FindClaimerRequest = {
        claimerAddress
      };

      const response = await fetch(`${this.baseUrl}/claimer/findClaimer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ClaimerApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching claimer info:', error);
      return {
        code: -1,
        value: null,
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Claim tokens for a claimer address
   */
  async claimTokens(claimerAddress: string): Promise<ClaimResponse> {
    try {
      const requestBody: ClaimRequest = {
        claimerAddress
      };

      const response = await fetch(`${this.baseUrl}/claimer/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ClaimResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error claiming tokens:', error);
      return {
        code: -1
      };
    }
  }

  /**
   * Check if claim is valid based on current timestamp
   */
  isClaimValid(claimerInfo: ClaimerInfo): boolean {
    if (claimerInfo.isClaimed) {
      return false;
    }

    const currentTimestamp = Date.now();
    return currentTimestamp >= claimerInfo.validFrom;
  }

  /**
   * Get time remaining until claim becomes valid
   */
  getTimeUntilValid(claimerInfo: ClaimerInfo): number {
    const currentTimestamp = Date.now();
    return Math.max(0, claimerInfo.validFrom - currentTimestamp);
  }

  /**
   * Format time remaining in human readable format
   */
  formatTimeRemaining(timeRemaining: number): string {
    if (timeRemaining === 0) {
      return 'Available now';
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
