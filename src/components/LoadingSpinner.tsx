import React from 'react';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-b-2',
    md: 'h-12 w-12 border-b-2',
    lg: 'h-16 w-16 border-b-3',
  };

  const paddingClasses = {
    sm: 'py-2',
    md: 'py-6',
    lg: 'py-12',
  };

  return (
    <div className={`col-span-full flex justify-center ${paddingClasses[size]}`}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-green-600`}></div>
    </div>
  );
};

export default LoadingSpinner;