import React from 'react';
import './PoseCharacter.css';
import BridgeHeader from '../layout/BridgeHeader';

interface PoseCharacterProps {
  children: React.ReactNode;
}

const PoseCharacter: React.FC<PoseCharacterProps> = ({ children }) => {
  return (
    <div className="pose-character-container">
      {/* Title and Description - above body image */}
      <div className="pose-header">
        <BridgeHeader />
      </div>
      
      {/* The center box content with body attached */}
      <div className="pose-content">
        {/* Body - connected to top border of center box */}
        <div className="pose-body">
          <img 
            src="/assets/pose/body.png" 
            alt="Character body" 
            className="pose-body-image"
          />
        </div>
        
        {/* Left hand - holding the box from left, above box */}
        <div className="pose-hand pose-hand-left">
          <img 
            src="/assets/pose/left_hand.png" 
            alt="Left hand" 
            className="pose-hand-image"
          />
        </div>
        
        {/* Right hand - holding the box from right, above box */}
        <div className="pose-hand pose-hand-right">
          <img 
            src="/assets/pose/right_hand.png" 
            alt="Right hand" 
            className="pose-hand-image"
          />
        </div>
        
        {/* The center box content */}
        {children}
      </div>
    </div>
  );
};

export default PoseCharacter;

