import { useCallback, useEffect, useState } from 'react';
import {
  dashboardService,
  EMPTY_DASHBOARD_SNAPSHOT,
  type DashboardSnapshot,
} from '../../services/admin/dashboard.service';
import { DATA_CHANGE_EVENT } from '../../services/admin/storage.util';

export function useDashboard() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(EMPTY_DASHBOARD_SNAPSHOT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (withSkeleton = false) => {
    if (withSkeleton) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await dashboardService.getSnapshot();
      setSnapshot(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard analytics.';
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

  return {
    ...snapshot,
    loading,
    error,
    refresh,
  };
}
