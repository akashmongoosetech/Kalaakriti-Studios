import { Link, NavLink } from 'react-router-dom';
import {
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  UserCircle2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { StudioLogo } from '../common/StudioLogo';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';
import { useAdminUIStore } from '../../store/adminUI.store';
import { useDashboard } from '../../hooks/admin/useDashboard';

interface AdminSidebarProps {
  onRequestLogout: () => void;
}

export function AdminSidebar({ onRequestLogout }: AdminSidebarProps) {
  const { user } = useAdminAuth();
  const { kpi } = useDashboard();
  const sidebarCollapsed = useAdminUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAdminUIStore((s) => s.toggleSidebar);
  const mobileDrawerOpen = useAdminUIStore((s) => s.mobileDrawerOpen);
  const setMobileDrawerOpen = useAdminUIStore((s) => s.setMobileDrawerOpen);

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 0,
    },
    {
      to: '/admin/contacts',
      label: 'Contacts',
      icon: MessageSquareText,
      badge: kpi.newContacts,
    },
    {
      to: '/admin/bookings',
      label: 'Bookings',
      icon: CalendarCheck2,
      badge: kpi.pendingBookings,
    },
    {
      to: '/admin/gallery',
      label: 'Gallery',
      icon: Images,
      badge: 0,
    },
    {
      to: '/admin/profile',
      label: 'Admin Profile',
      icon: UserCircle2,
      badge: 0,
    },
  ];

  const renderSidebarBody = (isMobile: boolean) => {
    const collapsed = !isMobile && sidebarCollapsed;

    return (
      <div className="flex h-full flex-col bg-[#1B1717] text-[#F7F2E9] border-r border-[#C5A46D]/20 select-none">
        {/* Brand Top Bar */}
        <div
          className={`flex items-center border-b border-[#C5A46D]/20 h-16 shrink-0 ${
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          <Link
            to="/admin/dashboard"
            onClick={() => isMobile && setMobileDrawerOpen(false)}
            className="flex items-center min-w-0"
            aria-label="Kalaakriti Studios Admin Dashboard"
          >
            <StudioLogo tone="light" size="sm" showWordmark={!collapsed} />
          </Link>

          {isMobile ? (
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              aria-label="Close navigation menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#E8DCCB]/80 hover:bg-[#57252F]/50 hover:text-[#F7F2E9] cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            !collapsed && (
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#E8DCCB]/70 hover:bg-[#57252F]/50 hover:text-[#F7F2E9] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            )
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="flex justify-center pt-3">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C5A46D]/25 text-[#C5A46D] hover:bg-[#57252F]/60 hover:text-[#F7F2E9] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav aria-label="Admin navigation" className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C5A46D]/80">
              Studio Workspace
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => isMobile && setMobileDrawerOpen(false)}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-xl transition-all duration-150 ${
                    collapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#57252F] text-[#F7F2E9] shadow-[0_4px_14px_rgba(87,37,47,0.35)]'
                      : 'text-[#E8DCCB]/80 hover:bg-[#2A2223] hover:text-[#F7F2E9]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 ${
                          isActive ? 'text-[#C5A46D]' : 'text-[#C5A46D]/75 group-hover:text-[#C5A46D]'
                        }`}
                        aria-hidden="true"
                      />
                      {!collapsed && (
                        <span className="text-sm font-medium truncate">{item.label}</span>
                      )}
                    </div>

                    {!collapsed && item.badge > 0 && (
                      <span
                        className={`ml-2 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                          isActive
                            ? 'bg-[#C5A46D] text-[#171615]'
                            : 'bg-[#57252F]/70 text-[#E8DCCB]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {collapsed && item.badge > 0 && (
                      <span
                        aria-label={`${item.badge} pending`}
                        className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#C5A46D]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 mt-4 border-t border-[#C5A46D]/15">
            <Link
              to="/"
              title={collapsed ? 'View Public Website' : undefined}
              className={`flex items-center rounded-xl text-[#E8DCCB]/70 hover:bg-[#2A2223] hover:text-[#C5A46D] transition-colors ${
                collapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5 text-sm'
              }`}
            >
              <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
              {!collapsed && <span>View Public Website</span>}
            </Link>
          </div>
        </nav>

        {/* Bottom Admin Profile Card + Logout */}
        <div className="border-t border-[#C5A46D]/20 p-3 space-y-2 shrink-0 bg-[#151212]">
          {user && (
            <Link
              to="/admin/profile"
              onClick={() => isMobile && setMobileDrawerOpen(false)}
              className={`flex items-center rounded-xl hover:bg-[#2A2223] transition-colors ${
                collapsed ? 'justify-center p-1.5' : 'gap-3 p-2'
              }`}
              title={collapsed ? `${user.firstName} ${user.lastName}` : undefined}
            >
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-9 w-9 rounded-full object-cover border border-[#C5A46D]/60 shrink-0"
              />
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#F7F2E9] truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[11px] text-[#C5A46D] truncate">@{user.username}</div>
                </div>
              )}
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              if (isMobile) setMobileDrawerOpen(false);
              onRequestLogout();
            }}
            title={collapsed ? 'Log Out' : undefined}
            className={`w-full flex items-center rounded-xl text-[#E8DCCB]/80 hover:bg-[#7F1D1D]/40 hover:text-[#FEE2E2] transition-colors cursor-pointer ${
              collapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2 text-xs font-medium'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-[width] duration-200 ease-out print:hidden ${
          sidebarCollapsed ? 'w-[76px]' : 'w-[260px]'
        }`}
      >
        {renderSidebarBody(false)}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden print:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-[#171615]/60 backdrop-blur-[2px]"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-[272px] max-w-[85vw] shadow-2xl"
            >
              {renderSidebarBody(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
