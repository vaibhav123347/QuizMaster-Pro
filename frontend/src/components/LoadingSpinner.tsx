import React from 'react';

export const LoadingSpinner: React.FC<{
  message?: string;
  fullScreen?: boolean;
}> = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center gap-3 ${
        fullScreen ? 'min-vh-100 cyber-grid-bg' : 'py-5'
      }`}
    >
      <div
        className="spinner-border text-info"
        role="status"
        style={{ width: '2.5rem', height: '2.5rem' }}
      >
        <span className="visually-hidden">{message}</span>
      </div>
      <span className="text-secondary small">{message}</span>
    </div>
  );
};
