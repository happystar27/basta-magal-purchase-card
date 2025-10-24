export interface ClaimerInfo {
  _id: string;
  amount: number;
  validFrom: number; // timestamp in milliseconds
  isClaimed: boolean;
  claimTransaction: string;
  claimedTimestamp: number;
}

export interface ClaimerApiResponse {
  code: number;
  value: ClaimerInfo | null;
  description?: string;
}

export interface FindClaimerRequest {
  claimerAddress: string;
}

export interface ClaimRequest {
  claimerAddress: string;
}

export interface ClaimResponse {
  code: number;
}

