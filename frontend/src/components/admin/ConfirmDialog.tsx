import { AlertTriangle, Loader2 } from 'lucide-react';
import { AdminModal } from './AdminModal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  entityLabel?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  entityLabel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-4 py-2.5 text-sm font-medium text-[#171615] hover:bg-[#F7F2E9] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-[#F7F2E9] disabled:opacity-60 transition-colors cursor-pointer ${
              variant === 'danger'
                ? 'bg-[#B91C1C] hover:bg-[#991B1B]'
                : 'bg-[#57252F] hover:bg-[#3E1820]'
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            <span>{confirmText}</span>
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            variant === 'danger'
              ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
              : 'bg-[#F7F2E9] text-[#57252F] border border-[#C5A46D]/40'
          }`}
        >
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-[#5C554E] leading-relaxed">{description}</p>
          {entityLabel && (
            <div className="rounded-lg bg-[#F7F2E9] border border-[#171615]/10 px-3.5 py-2 text-xs font-medium text-[#171615]">
              {entityLabel}
            </div>
          )}
        </div>
      </div>
    </AdminModal>
  );
}
