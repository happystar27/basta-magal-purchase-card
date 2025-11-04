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
              className="px-3 py-2 w-full text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md transition-colors hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex flex-1 justify-center items-center px-4 py-2 text-white bg-amber-500 rounded-md transition-colors hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                'Send Wallaneer Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;
