import { useCallback, useEffect, useState } from 'react';
import type {
  ContactRecord,
  ContactStatus,
  CreateContactInput,
  UpdateContactInput,
} from '../../types/contact.types';
import { contactService } from '../../services/admin/contact.service';
import { DATA_CHANGE_EVENT } from '../../services/admin/storage.util';

export function useContacts() {
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [trashedContacts, setTrashedContacts] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (withSkeleton = false) => {
    if (withSkeleton) {
      setLoading(true);
    }
    setError(null);
    try {
      const [activeItems, trashItems] = await Promise.all([
        contactService.getAll(),
        contactService.getTrash(),
      ]);
      setContacts(activeItems);
      setTrashedContacts(trashItems);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load contacts.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh(true);
    const onDataChange = () => {
      void refresh(false);
    };
    window.addEventListener(DATA_CHANGE_EVENT, onDataChange);
    return () => {
      window.removeEventListener(DATA_CHANGE_EVENT, onDataChange);
    };
  }, [refresh]);

  const createContact = useCallback(async (input: CreateContactInput) => {
    return contactService.create(input);
  }, []);

  const updateContact = useCallback(async (id: string, input: UpdateContactInput) => {
    return contactService.update(id, input);
  }, []);

  const updateStatus = useCallback(async (id: string, status: ContactStatus) => {
    return contactService.updateStatus(id, status);
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    await contactService.softDelete(id);
  }, []);

  const restoreContact = useCallback(async (id: string) => {
    await contactService.restore(id);
  }, []);

  const permanentDeleteContact = useCallback(async (id: string) => {
    await contactService.permanentDelete(id);
  }, []);

  const addDemoContact = useCallback(async () => {
    return contactService.createSampleInquiry();
  }, []);

  return {
    contacts,
    trashedContacts,
    loading,
    error,
    refresh,
    createContact,
    updateContact,
    updateStatus,
    deleteContact,
    restoreContact,
    permanentDeleteContact,
    addDemoContact,
  };
}
