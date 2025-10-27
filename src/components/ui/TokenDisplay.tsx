import React, { useState } from 'react';
import { FaCopy, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';

interface Token {
  name: string;
  symbol: string;
  icon: string;
  address: string;
  status: 'active' | 'coming';
  description: string;
}

const TokenDisplay: React.FC = () => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const tokens: Token[] = [
    {
      name: '$MAGAL',
      symbol: '$MAGAL',
      icon: '/assets/logo.png',
      address: 'A2ZbCHUEiHgSwFJ9EqgdYrFF255RQpAZP2xEC62fpump',
      status: 'active',
      description: 'Magallaneer native token'
    },
    {
      name: '$BASTA',
      symbol: '$BASTA',
      icon: '/assets/basta.png',
      address: 'Coming Soon',
      status: 'coming',
      description: 'Basta ecosystem token'
    }
  ];

  const copyToClipboard = async (text: string, tokenName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(tokenName);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatAddress = (address: string) => {
    if (address === 'Coming Soon') return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="hand-drawn-card mx-2 md:mx-0 p-4 md:p-6">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 9.766 14 8.991 14 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V5z" clipRule="evenodd"/>
          </svg>
        </div>
          <h3 className="text-gray-500 dark:text-white font-semibold text-lg scribble-text">Token Information</h3>
      </div>

      <div className="space-y-4">
        {tokens.map((token, index) => (
          <div
            key={token.symbol}
            className={`p-4 organic-border-small transition-all duration-200 hover:scale-[1.02] relative hand-drawn ${
              token.status === 'active'
                ? 'bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-amber-500/30 hover:border-amber-500/50'
                : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30'
            }`}
            style={token.status === 'coming' ? {
              borderRadius: '15px 8px 15px 8px',
              boxShadow: '0 0 25px rgba(139, 69, 255, 0.4), 0 0 50px rgba(139, 69, 255, 0.15), inset 0 0 25px rgba(139, 69, 255, 0.1)',
              background: 'linear-gradient(135deg, rgba(139, 69, 255, 0.12) 0%, rgba(236, 72, 153, 0.08) 30%, rgba(139, 69, 255, 0.12) 70%, rgba(168, 85, 247, 0.1) 100%)'
            } : {
              borderRadius: '15px 8px 15px 8px'
            }}
          >
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={token.icon}
                    alt={token.name}
                    className={`w-10 h-10 rounded-full object-cover ${
                      token.status === 'coming' 
                        ? 'ring-2 ring-purple-400/60 shadow-xl shadow-purple-500/40' 
                        : ''
                    }`}
                    onError={(e) => {
                      e.currentTarget.src = '/assets/logo.png';
                    }}
                  />
                  {token.status === 'active' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                  {token.status === 'coming' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-gray-500 dark:text-white font-semibold text-lg truncate scribble-text">{token.name}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm truncate scribble-text">{token.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {token.status === 'active' ? (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full whitespace-nowrap">
                    Live
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500/40 to-pink-500/40 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full border border-purple-400/40 shadow-lg shadow-purple-500/25 animate-pulse whitespace-nowrap tracking-wide">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Dexscreener</span>
                {token.status === 'active' && (
                  <a
                    href={`https://dexscreener.com/solana/${token.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                    title="View on Solscan"
                  >
                    <FaExternalLinkAlt className="w-3 h-3" />
                  </a>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 min-w-0">
                  <code className="text-gray-500 dark:text-white font-mono text-xs sm:text-sm break-all">
                    {formatAddress(token.address)}
                  </code>
                </div>
                {token.status === 'active' && (
                  <button
                    onClick={() => copyToClipboard(token.address, token.symbol)}
                    className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 organic-border-small hand-drawn-button group flex-shrink-0"
                    title="Copy address"
                  >
                    {copiedAddress === token.symbol ? (
                      <FaCheck className="w-4 h-4 text-green-500 dark:text-green-400" />
                    ) : (
                      <FaCopy className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* {token.status === 'active' && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Network</span>
                  <span className="text-white font-medium">Solana</span>
                </div>
              </div>
            )} */}
          </div>
        ))}
      </div>

      {/* <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div>
            <p className="text-blue-400 font-medium text-sm">Token Information</p>
            <p className="text-blue-300/80 text-xs mt-1">
              MAGAL is the native token of the Magallaneer ecosystem. BASTA token is coming soon with exciting features.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TokenDisplay;
