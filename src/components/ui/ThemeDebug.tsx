import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeDebug: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-red-500 text-white text-xs rounded z-50">
      Theme: {theme} | Dark: {isDark ? 'Yes' : 'No'}
    </div>
  );
};

export default ThemeDebug;
