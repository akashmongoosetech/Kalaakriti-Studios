import { format, parseISO } from 'date-fns';
import {
  Calendar,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Tag,
  Trash2,
  User,
} from 'lucide-react';
import {
  CONTACT_STATUSES,
  type ContactRecord,
  type ContactStatus,
} from '../../types/contact.types';
import { AdminModal } from './AdminModal';
import { StatusBadge } from './StatusBadge';

interface ContactViewDialogProps {
  contact: ContactRecord | null;
  open: boolean;
  onClose: () => void;
  onEdit: (contact: ContactRecord) => void;
  onDelete: (contact: ContactRecord) => void;
  onStatusChange: (id: string, status: ContactStatus) => void;
}

function formatDateSafe(iso?: string, pattern = 'dd MMM yyyy, hh:mm a'): string {
  if (!iso) return 'Not specified';
  try {
    const parsed = parseISO(iso);
    if (Number.isNaN(parsed.getTime())) return iso;
    return format(parsed, pattern);
  } catch {
    return iso;
  }
}

export function ContactViewDialog({
  contact,
  open,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: ContactViewDialogProps) {
  if (!contact) return null;

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={contact.fullName}
      description={`Contact ID: ${contact.contactId} · Submitted ${formatDateSafe(contact.submittedAt)}`}
      size="lg"
      footer={
        <div className="w-full flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDelete(contact)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-2 text-xs sm:text-sm font-medium text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-4 py-2 text-xs sm:text-sm font-medium text-[#171615] hover:bg-[#F7F2E9] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onEdit(contact)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-5 py-2 text-xs sm:text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
              <span>Edit Contact</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status & Quick Update Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-[#F7F2E9] border border-[#C5A46D]/35 p-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[#5C554E]">Current Status:</span>
            <StatusBadge status={contact.status} />
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="contact-view-status"
              className="text-xs font-medium text-[#5C554E] whitespace-nowrap"
            >
              Update Status:
            </label>
            <select
              id="contact-view-status"
              value={contact.status}
              onChange={(e) => onStatusChange(contact.id, e.target.value as ContactStatus)}
              className="rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-3 py-1.5 text-xs font-medium text-[#171615] focus:border-[#57252F] focus:outline-none cursor-pointer"
            >
              {CONTACT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-[#171615]/10 bg-[#FFFFFF] p-4 space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#57252F]">
              Client Information
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-[11px] text-[#5C554E]">Full Name</div>
                  <div className="font-medium text-[#171615]">{contact.fullName}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="text-[11px] text-[#5C554E]">Email Address</div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-medium text-[#57252F] hover:underline break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-[11px] text-[#5C554E]">Mobile Number</div>
                  <div className="font-medium text-[#171615] tabular-nums">{contact.mobile}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#171615]/10 bg-[#FFFFFF] p-4 space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#57252F]">
              Inquiry Context
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <Tag className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-[11px] text-[#5C554E]">Event Type &amp; Subject</div>
                  <div className="font-medium text-[#171615]">{contact.eventType}</div>
                  <div className="text-xs text-[#5C554E] mt-0.5">{contact.subject}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-[11px] text-[#5C554E]">City</div>
                  <div className="font-medium text-[#171615]">{contact.city}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-[11px] text-[#5C554E]">Tentative Event Date</div>
                  <div className="font-medium text-[#171615] tabular-nums">
                    {formatDateSafe(contact.eventDate, 'dd MMM yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Message */}
        <div className="rounded-xl border border-[#171615]/10 bg-[#F7F2E9]/55 p-4 sm:p-5 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#57252F]">
            Client Message
          </div>
          <p className="text-sm text-[#171615] leading-relaxed whitespace-pre-wrap">
            {contact.message}
          </p>
        </div>

        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5C554E] pt-1">
          <span className="tabular-nums">
            Contact ID: <strong className="text-[#171615]">{contact.contactId}</strong>
          </span>
          <span className="tabular-nums">
            Last Updated: {formatDateSafe(contact.updatedAt)}
          </span>
        </div>
      </div>
    </AdminModal>
  );
}
