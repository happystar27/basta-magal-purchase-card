import React, { useEffect } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoClose } from 'react-icons/io5';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <IoCloseCircle className="w-6 h-6 text-red-500" />;
      case 'info':
        return <IoInformationCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <IoInformationCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full border rounded-lg shadow-lg p-4 ${getBorderColor()} transition-all duration-300 ease-in-out transform translate-x-0`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {title}
          </p>
          <p
            className={`text-sm ${getTextColor()} opacity-90 mt-1`}
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={() => onClose(id)}
            className={`inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200`}
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
