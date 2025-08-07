import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="col-span-full flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
};

export default LoadingSpinner;
