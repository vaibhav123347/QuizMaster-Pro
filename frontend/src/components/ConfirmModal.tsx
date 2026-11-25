import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.78)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content qm-card p-2"
          style={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}
        >
          <div className="modal-header border-bottom border-secondary border-opacity-25">
            <h5 className="modal-title d-flex align-items-center gap-2 fs-6 fw-semibold text-white">
              <AlertCircle
                size={20}
                className={variant === 'danger' ? 'text-danger' : 'text-info'}
              />
              {title}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCancel}
              disabled={isLoading}
            />
          </div>
          <div className="modal-body text-secondary small lh-base">{message}</div>
          <div className="modal-footer border-top border-secondary border-opacity-25">
            <button
              type="button"
              className="btn btn-cyber-outline btn-sm px-3"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={`btn btn-sm px-3 ${
                variant === 'danger' ? 'btn-danger' : 'btn-cyber'
              }`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
