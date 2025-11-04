import React from 'react';

const BridgeHeader: React.FC = () => {
  return (
    <div className="px-4 mb-6 text-center md:mb-10">
      <h1 className="text-[24px] md:text-[36px] font-bold text-gray-900 dark:text-[#ffd966] mb-2 leading-tight" style={{ fontFamily: "'Schoolbell', cursive", textShadow: ' 0px 5px 0px rgba(107, 114, 128, 0.5)' }}>
        $MAGAL & $BASTA
      </h1>
      <div className="mt-2 font-medium">
        <span className="text-[12px] sm:text-[14px] md:text-[18px] text-gray-500 dark:text-gray-400 b-label leading-relaxed font-medium" style={{ fontFamily: "'Schoolbell', cursive" }}>
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
