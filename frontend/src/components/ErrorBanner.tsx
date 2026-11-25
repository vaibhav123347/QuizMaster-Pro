import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ErrorBanner: React.FC<{
  message: string | null;
  onDismiss?: () => void;
}> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div
      className="alert d-flex align-items-center justify-content-between gap-2 mb-3"
      role="alert"
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        color: '#fca5a5',
        borderRadius: '10px',
      }}
    >
      <div className="d-flex align-items-center gap-2">
        <AlertTriangle size={18} className="flex-shrink-0 text-danger" />
        <span className="small">{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          className="btn-close btn-close-white btn-sm"
          aria-label="Close"
          onClick={onDismiss}
        />
      )}
    </div>
  );
};
