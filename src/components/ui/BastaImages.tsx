import React from 'react';
import './BastaImages.css';

const BastaImages: React.FC = () => {
  const images = Array.from({ length: 16 }, (_, i) => i + 1);

  // Configuration for each image: position, rotation, animation delay, z-index for overlap
  // Left side: all facing right (positive rotations) - 2/3 body visible
  // Right side: all facing left (negative rotations) - 2/3 body visible
  const imageConfigs = [
    // Left side images (0-7) - distributed across full height, all facing right, 2/3 visible
    { side: 'left', top: '-5%', left: '-65px', rotation: 12, delay: 0, scale: 1.2, zIndex: 1 },
    { side: 'left', top: '8%', left: '-60px', rotation: 35, delay: 0.2, scale: 1.3, zIndex: 2 },
    { side: 'left', top: '20%', left: '-70px', rotation: 8, delay: 0.4, scale: 1.1, zIndex: 3 },
    { side: 'left', top: '32%', left: '-55px', rotation: 42, delay: 0.6, scale: 1.25, zIndex: 4 },
    { side: 'left', top: '45%', left: '-68px', rotation: 19, delay: 0.8, scale: 1.15, zIndex: 5 },
    { side: 'left', top: '58%', left: '-58px', rotation: 31, delay: 1.0, scale: 1.3, zIndex: 6 },
    { side: 'left', top: '70%', left: '-72px', rotation: 5, delay: 1.2, scale: 1.2, zIndex: 7 },
    { side: 'left', top: '85%', left: '-65px', rotation: 27, delay: 1.4, scale: 1.25, zIndex: 8 },
    
    // Right side images (8-15) - distributed across full height, all facing left, 2/3 visible
    { side: 'right', top: '-3%', right: '-68px', rotation: -33, delay: 0.1, scale: 1.25, zIndex: 1 },
    { side: 'right', top: '10%', right: '-58px', rotation: -11, delay: 0.3, scale: 1.15, zIndex: 2 },
    { side: 'right', top: '22%', right: '-72px', rotation: -38, delay: 0.5, scale: 1.3, zIndex: 3 },
    { side: 'right', top: '35%', right: '-65px', rotation: -16, delay: 0.7, scale: 1.2, zIndex: 4 },
    { side: 'right', top: '48%', right: '-60px', rotation: -29, delay: 0.9, scale: 1.25, zIndex: 5 },
    { side: 'right', top: '60%', right: '-70px', rotation: -7, delay: 1.1, scale: 1.1, zIndex: 6 },
    { side: 'right', top: '73%', right: '-55px', rotation: -41, delay: 1.3, scale: 1.3, zIndex: 7 },
    { side: 'right', top: '88%', right: '-65px', rotation: -24, delay: 1.5, scale: 1.2, zIndex: 8 },
  ];

  return (
    <div className="basta-images-container">
      {images.map((num, index) => {
        const config = imageConfigs[index];
        if (!config) return null;
        
        const animationClass = `basta-animation-${index + 1}`;
        
        // Bottom 3 characters on each side to hide on mobile
        // Left side: indices 5, 6, 7 (top: 58%, 70%, 85%)
        // Right side: indices 13, 14, 15 (top: 60%, 73%, 88%)
        const isBottomThree = (index >= 5 && index <= 7) || (index >= 13 && index <= 15);
        
        return (
          <img
            key={num}
            src={`/assets/basta/${num}.png`}
            alt={`Basta ${num}`}
            className={`basta-image ${animationClass} ${isBottomThree ? 'basta-mobile-hide' : ''}`}
            style={{
              position: 'fixed',
              top: config.top,
              [config.side]: config.side === 'left' ? config.left : config.right,
              '--base-rotation': `${config.rotation}deg`,
              '--base-scale': `${config.scale}`,
              animationDelay: `${config.delay}s`,
              zIndex: config.zIndex,
              pointerEvents: 'none',
              opacity: 1,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
};

export default BastaImages;

