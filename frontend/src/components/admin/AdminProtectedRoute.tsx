import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, hydrated } = useAdminAuth();
  const location = useLocation();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F2E9] text-[#57252F]">
        <div className="text-center space-y-3">
          <div className="mx-auto h-9 w-9 rounded-full border-2 border-[#C5A46D] border-t-[#57252F] animate-spin" />
          <p className="font-editorial text-lg text-[#5C554E]">Verifying Studio Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <>{children}</>;
}
