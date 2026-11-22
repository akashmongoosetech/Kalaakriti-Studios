import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import {
  CONTACT_STATUSES,
  type ContactRecord,
  type UpdateContactInput,
} from '../../types/contact.types';
import {
  adminContactEditSchema,
  type AdminContactEditValues,
} from '../../schemas/adminContact.schema';
import { PHOTOGRAPHY_CATEGORIES } from '../../data/categories';
import { CITIES_WE_SERVE } from '../../data/cities';
import { AdminModal } from './AdminModal';

interface ContactEditDialogProps {
  contact: ContactRecord | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, input: UpdateContactInput) => void;
}

export function ContactEditDialog({
  contact,
  open,
  onClose,
  onSave,
}: ContactEditDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminContactEditValues>({
    resolver: zodResolver(adminContactEditSchema),
  });

  useEffect(() => {
    if (contact && open) {
      reset({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        mobile: contact.mobile,
        subject: contact.subject,
        eventType: contact.eventType,
        city: contact.city,
        eventDate: contact.eventDate || '',
        message: contact.message,
        status: contact.status,
      });
    }
  }, [contact, open, reset]);

  if (!contact) return null;

  const inputClass =
    'w-full rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-3.5 py-2.5 text-sm text-[#171615] placeholder:text-[#5C554E]/60 focus:border-[#57252F] focus:outline-none';

  const submitForm = (values: AdminContactEditValues) => {
    onSave(contact.id, {
      ...values,
      eventDate: values.eventDate || undefined,
    });
    onClose();
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Edit Contact Record"
      description={`Updating ${contact.contactId} · ${contact.fullName}`}
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-4 py-2 text-sm font-medium text-[#171615] hover:bg-[#F7F2E9] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-contact-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-5 py-2 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] disabled:opacity-60 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
            <span>Save Changes</span>
          </button>
        </>
      }
    >
      <form id="edit-contact-form" onSubmit={handleSubmit(submitForm)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ce-firstName" className="block text-xs font-medium text-[#171615] mb-1">
              First Name *
            </label>
            <input id="ce-firstName" type="text" {...register('firstName')} className={inputClass} />
            {errors.firstName && (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ce-lastName" className="block text-xs font-medium text-[#171615] mb-1">
              Last Name
            </label>
            <input id="ce-lastName" type="text" {...register('lastName')} className={inputClass} />
            {errors.lastName && (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ce-email" className="block text-xs font-medium text-[#171615] mb-1">
              Email Address *
            </label>
            <input id="ce-email" type="email" {...register('email')} className={inputClass} />
            {errors.email && (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ce-mobile" className="block text-xs font-medium text-[#171615] mb-1">
              Mobile Number *
            </label>
            <input id="ce-mobile" type="tel" {...register('mobile')} className={inputClass} />
            {errors.mobile && (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.mobile.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="ce-subject" className="block text-xs font-medium text-[#171615] mb-1">
              Subject *
            </label>
            <input id="ce-subject" type="text" {...register('subject')} className={inputClass} />
            {errors.subject && (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ce-eventType" className="block text-xs font-medium text-[#171615] mb-1">
              Event Type *
            </label>
            <select id="ce-eventType" {...register('eventType')} className={inputClass}>
              {PHOTOGRAPHY_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.eventType && (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.eventType.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ce-city" className="block text-xs font-medium text-[#171615] mb-1">
              City *
            </label>
            <input
              id="ce-city"
              list="admin-contact-cities"
              type="text"
              {...register('city')}
              className={inputClass}
            />
            <datalist id="admin-contact-cities">
              {CITIES_WE_SERVE.map((c) => (
                <option key={c.slug} value={c.name} />
              ))}
            </datalist>
            {errors.city && (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ce-eventDate" className="block text-xs font-medium text-[#171615] mb-1">
              Tentative Event Date
            </label>
            <input id="ce-eventDate" type="date" {...register('eventDate')} className={inputClass} />
          </div>

          <div>
            <label htmlFor="ce-status" className="block text-xs font-medium text-[#171615] mb-1">
              Status *
            </label>
            <select id="ce-status" {...register('status')} className={inputClass}>
              {CONTACT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="ce-message" className="block text-xs font-medium text-[#171615] mb-1">
            Inquiry Message *
          </label>
          <textarea
            id="ce-message"
            rows={4}
            {...register('message')}
            className={inputClass}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-[#B91C1C]">{errors.message.message}</p>
          )}
        </div>
      </form>
    </AdminModal>
  );
}
