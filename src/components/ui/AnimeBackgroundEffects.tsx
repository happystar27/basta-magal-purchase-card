import React, { useMemo } from 'react';
import './AnimeBackgroundEffects.css';

const AnimeBackgroundEffects: React.FC = () => {
  // Generate sparkles with consistent positions
  const sparkles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${(i * 37.5) % 100}%`,
      top: `${(i * 23.7) % 100}%`,
      delay: `${(i * 0.3) % 3}s`,
      duration: `${2 + (i % 3) * 1.2}s`,
    }));
  }, []);

  return (
    <>
      {/* Animated gradient overlays */}
      <div className="anime-gradient-overlay anime-gradient-1"></div>
      <div className="anime-gradient-overlay anime-gradient-2"></div>
      
      {/* Sparkle particles */}
      <div className="sparkle-container">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="sparkle"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              animationDelay: sparkle.delay,
              animationDuration: sparkle.duration,
            }}
          />
        ))}
      </div>
      
      {/* Animated color patches */}
      <div className="color-patch color-patch-1"></div>
      <div className="color-patch color-patch-2"></div>
      <div className="color-patch color-patch-3"></div>
      
      {/* Doodle-style animated lines */}
      <div className="doodle-line doodle-line-1"></div>
      <div className="doodle-line doodle-line-2"></div>
      <div className="doodle-line doodle-line-3"></div>
      
      {/* Screen overlay effect */}
      <div className="screen-overlay"></div>
    </>
  );
};

export default AnimeBackgroundEffects;

