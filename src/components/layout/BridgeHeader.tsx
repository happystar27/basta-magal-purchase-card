import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const BridgeHeader: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="px-4 mb-[180px] text-center md:mb-[200px]">
      <h1 className="text-[24px] md:text-[36px] font-bold text-gray-900 dark:text-[#ffd966] mb-2 leading-tight" style={{ fontFamily: "'Schoolbell', cursive", textShadow: ' 0px 5px 0px rgba(107, 114, 128, 0.5)' }}>
        {t.magalAndBasta}
      </h1>
      <div className="mt-2 font-medium">
        <span className="text-[12px] sm:text-[14px] md:text-[18px] text-gray-500 dark:text-gray-400 b-label leading-relaxed font-medium" style={{ fontFamily: "'Schoolbell', cursive" }}>
          {t.bastaMagalMadeEasy}<br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          {t.oneCardBalancedTokens}<br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          {t.zeroHassle}
        </span>
      </div>
    </div>
  );
};

export default BridgeHeader;
