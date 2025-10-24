import React from 'react';
import WalletConnect from '../ui/WalletConnect';
import ThemeToggle from '../ui/ThemeToggle';

const Header: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center absolute px-3 md:px-5 top-3 md:top-5 w-full z-10">
      {/* Mobile Layout: Logo and buttons stacked */}
      <div className="flex justify-between items-center w-full md:hidden mb-4 header-container">
        <img
          src="/assets/logo.png"
          className="max-w-[80px] w-full h-auto header-logo"
          alt="Logo"
          onError={(e) => {
            // Fallback if logo doesn't exist
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <div className="header-button">
            <WalletConnect />
          </div>
        </div>
      </div>

      {/* Desktop Layout: Logo left, buttons right */}
      <div className="hidden md:flex justify-between items-center w-full">
        <img
          src="/assets/logo.png"
          className="max-w-[100px] w-full h-auto"
          alt="Logo"
          onError={(e) => {
            // Fallback if logo doesn't exist
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <WalletConnect />
        </div>
      </div>
    </div>
  );
};

export default Header;
