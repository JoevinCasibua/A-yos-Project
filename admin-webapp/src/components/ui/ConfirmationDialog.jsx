import React from 'react';
import { AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';
import Modal from './Modal';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon: CustomIcon,
  children,
}) => {
  const variantStyles = {
    danger: {
      bg: 'bg-danger/10',
      iconColor: 'text-danger',
      btn: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      bg: 'bg-warning/10',
      iconColor: 'text-warning',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    success: {
      bg: 'bg-success/10',
      iconColor: 'text-success',
      btn: 'bg-green-600 hover:bg-green-700 text-white',
    },
    info: {
      bg: 'bg-info/10',
      iconColor: 'text-info',
      btn: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  };

  const style = variantStyles[variant] || variantStyles.danger;
  const DefaultIcon = variant === 'danger' ? Trash2 : variant === 'success' ? CheckCircle : variant === 'info' ? Info : AlertTriangle;
  const IconComponent = CustomIcon || DefaultIcon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center pb-4">
        <div className={`h-12 w-12 rounded-full ${style.bg} flex items-center justify-center mb-4`}>
          <IconComponent size={24} className={style.iconColor} />
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        {children && <div className="w-full mb-4">{children}</div>}
        <div className="flex w-full space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${style.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
