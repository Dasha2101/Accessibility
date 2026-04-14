import React from 'react';
import './loading.css';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Загрузка...',
}) => {
  return (
    <div className="loading-wrapper">
      <div className="spinner" />
      <span>{message}</span>
    </div>
  );
};

export default LoadingIndicator;
