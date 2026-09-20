import React from 'react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

const ConfirmModal: React.FC<Props> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" role="dialog" aria-modal="true">
        <h3 className="admin-modal__title">{title}</h3>
        <p className="admin-modal__body">{message}</p>
        <div className="admin-modal__actions">
          <button className="admin-btn admin-btn--ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`admin-btn ${isDestructive ? 'admin-btn--danger' : 'admin-btn--primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
