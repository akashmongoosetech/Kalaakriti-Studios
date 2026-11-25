import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ConfirmDialog } from './ConfirmDialog';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';

export function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    toast.success('Signed out of the studio admin workspace.');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F7F2E9] text-[#171615] flex">
      <AdminSidebar onRequestLogout={() => setLogoutDialogOpen(true)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminHeader onRequestLogout={() => setLogoutDialogOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>

        <footer className="border-t border-[#171615]/8 bg-[#F7F2E9] px-4 sm:px-6 lg:px-8 py-4 text-[11px] text-[#5C554E] flex flex-col sm:flex-row items-center justify-between gap-2 print:hidden">
          <span>Kalaakriti Studios · Admin Workspace</span>
          <span>Live portfolio, bookings &amp; inquiries synced with database</span>
        </footer>
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Sign Out"
        description="Are you sure you want to sign out of the Kalaakriti Studios Admin Panel?"
        entityLabel={user ? `${user.firstName} ${user.lastName} (@${user.username})` : undefined}
        confirmText="Log Out"
        cancelText="Stay Signed In"
        variant="primary"
      />
    </div>
  );
}
