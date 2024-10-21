import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onHide, className = '' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className={`fixed left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'} ${className} animate-slideDown`}>
      {message}
    </div>
  );
};

export default Toast;
