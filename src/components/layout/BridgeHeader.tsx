import React from 'react';

const BridgeHeader: React.FC = () => {
  return (
    <div className="text-center mb-6 md:mb-10 px-4">
      <h1 className="text-[24px] md:text-[36px] font-bold font-mono text-gray-900 dark:text-[#ffd966] mb-2 leading-tight">
        $MAGAL & $BASTA
      </h1>
      <div className="mt-2 font-medium">
        <span className="text-[12px] sm:text-[14px] md:text-[18px] text-gray-800 dark:text-gray-400 b-label leading-relaxed">
          Basta & Magal Made Easy:<br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          One Card, Balanced Tokens,<br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          Zero Hassle
        </span>
      </div>
    </div>
  );
};

export default BridgeHeader;
