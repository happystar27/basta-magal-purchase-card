import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
        ${isDark 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30' 
          : 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30'
        }
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {/* Toggle Circle */}
      <div
        className={`
          absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 ease-in-out
          flex items-center justify-center
          ${isDark ? 'translate-x-7' : 'translate-x-0.5'}
          ${isDark 
            ? 'bg-white shadow-lg' 
            : 'bg-white shadow-lg'
          }
        `}
      >
        {isDark ? (
          <FaMoon className="w-3 h-3 text-purple-600" />
        ) : (
          <FaSun className="w-3 h-3 text-amber-500" />
        )}
      </div>
      
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <FaSun 
          className={`w-3 h-3 transition-opacity duration-300 ${
            isDark ? 'opacity-30' : 'opacity-100'
          } text-white`} 
        />
        <FaMoon 
          className={`w-3 h-3 transition-opacity duration-300 ${
            isDark ? 'opacity-100' : 'opacity-30'
          } text-white`} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
