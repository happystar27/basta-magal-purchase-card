import React, { useState } from 'react';

interface EmailModalProps {
  isOpen: boolean;
  onSubmit: (email: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onSubmit, onCancel, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    onSubmit(email);
  };

  const handleCancel = () => {
    setEmail('');
    setError('');
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
      <div className="p-6 mx-4 w-full max-w-md bg-white rounded-lg">
        <div className="flex items-center mb-4">
          <img src="/assets/wallaneer.svg" alt="Wallaneer" className="mr-3 w-8 h-8" />
          <h2 className="text-xl font-semibold text-gray-800">Connect with Wallaneer</h2>
        </div>
        
        <p className="mb-4 text-gray-600">
          Enter your email address to receive a wallaneer link for secure wallet connection.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 w-full text-black rounded focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: '1px solid #000000',
                boxShadow: '1px 3px #6b72804d',
              }}
              placeholder="your@email.com"
              disabled={isLoading}
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center cursor-pointer border-none text-white font-semibold uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
              style={{
                fontFamily: 'DM Sans, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                minHeight: '44px',
                height: 'auto',
                lineHeight: '1.2',
                padding: '10px 20px',
                borderRadius: '4px',
                backgroundColor: '#6b7280',
                textTransform: 'uppercase',
                boxShadow: '3px 5px #6b72804d',
                whiteSpace: 'nowrap',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex flex-1 items-center justify-center cursor-pointer border-none text-white font-semibold uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
              style={{
                fontFamily: 'DM Sans, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                minHeight: '44px',
                height: 'auto',
                lineHeight: '1.2',
                padding: '10px 20px',
                borderRadius: '4px',
                backgroundColor: '#1f2937',
                textTransform: 'uppercase',
                boxShadow: '3px 5px #6b72804d',
                whiteSpace: 'nowrap',
              }}
            >
              {isLoading ? (
                <>
                  <svg className="mr-2 -ml-1 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'VERIFY'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;
