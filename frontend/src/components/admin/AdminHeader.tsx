import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import {
  Bell,
  CalendarCheck2,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  UserCircle2,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';
import { useAdminUIStore } from '../../store/adminUI.store';
import { useDashboard } from '../../hooks/admin/useDashboard';

interface AdminHeaderProps {
  onRequestLogout: () => void;
}

const ROUTE_META: Record<string, { title: string; breadcrumb: string }> = {
  '/admin/dashboard': { title: 'Dashboard Overview', breadcrumb: 'Overview' },
  '/admin/contacts': { title: 'Contacts Management', breadcrumb: 'Contacts' },
  '/admin/bookings': { title: 'Bookings Management', breadcrumb: 'Bookings' },
  '/admin/profile': { title: 'Administrator Profile', breadcrumb: 'Profile' },
};

export function AdminHeader({ onRequestLogout }: AdminHeaderProps) {
  const { user } = useAdminAuth();
  const { kpi, recentActivity } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  const setMobileDrawerOpen = useAdminUIStore((s) => s.setMobileDrawerOpen);
  const globalSearch = useAdminUIStore((s) => s.globalSearch);
  const setGlobalSearch = useAdminUIStore((s) => s.setGlobalSearch);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const meta = ROUTE_META[location.pathname] ?? {
    title: 'Studio Admin',
    breadcrumb: 'Workspace',
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    if (
      location.pathname !== '/admin/contacts' &&
      location.pathname !== '/admin/bookings'
    ) {
      navigate('/admin/bookings');
    }
  };

  const unreadCount = kpi.newContacts + kpi.pendingBookings;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#171615]/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 print:hidden">
      {/* Left: Mobile Drawer Button + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open navigation menu"
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-[#171615]/12 text-[#171615] hover:bg-[#F7F2E9] cursor-pointer"
        >
          <Menu className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#5C554E]"
          >
            <Link to="/admin/dashboard" className="hover:text-[#57252F] transition-colors">
              Admin
            </Link>
            <ChevronRight className="w-3 h-3 opacity-50" aria-hidden="true" />
            <span className="font-medium text-[#57252F]">{meta.breadcrumb}</span>
          </nav>
          <h1 className="font-editorial text-xl sm:text-2xl font-semibold text-[#171615] leading-none truncate">
            {meta.title}
          </h1>
        </div>
      </div>

      {/* Right: Quick Search + Notifications + Profile Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Search */}
        <form onSubmit={handleQuickSearchSubmit} className="relative hidden md:block w-56 lg:w-64">
          <Search
            className="w-4 h-4 text-[#5C554E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Quick search records..."
            aria-label="Quick search records"
            className="w-full rounded-lg bg-[#F7F2E9]/70 border border-[#171615]/12 pl-9 pr-8 py-1.5 text-xs text-[#171615] placeholder:text-[#5C554E]/70 focus:bg-[#FFFFFF] focus:border-[#57252F] focus:outline-none transition-colors"
          />
          {globalSearch && (
            <button
              type="button"
              onClick={() => setGlobalSearch('')}
              aria-label="Clear quick search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5C554E] hover:text-[#171615] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </form>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            aria-label="Open notifications"
            aria-expanded={notifOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#171615]/12 bg-[#FFFFFF] text-[#171615] hover:bg-[#F7F2E9] hover:border-[#C5A46D] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#57252F] px-1 text-[10px] font-semibold text-[#F7F2E9] tabular-nums">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#FFFFFF] border border-[#171615]/12 shadow-xl overflow-hidden z-40">
              <div className="px-4 py-3 border-b border-[#171615]/10 bg-[#F7F2E9]/70 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#171615]">Studio Alerts</div>
                  <div className="text-[11px] text-[#5C554E]">
                    {kpi.newContacts} new contacts · {kpi.pendingBookings} pending bookings
                  </div>
                </div>
                <Link
                  to="/admin/bookings"
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] font-medium text-[#57252F] hover:underline"
                >
                  View Queue
                </Link>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#171615]/8">
                {recentActivity.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-[#5C554E]">
                    No recent studio activity recorded yet.
                  </div>
                ) : (
                  recentActivity.slice(0, 6).map((item) => {
                    const targetRoute =
                      item.entityType === 'booking'
                        ? '/admin/bookings'
                        : item.entityType === 'contact'
                          ? '/admin/contacts'
                          : '/admin/profile';
                    const Icon =
                      item.entityType === 'booking'
                        ? CalendarCheck2
                        : item.entityType === 'contact'
                          ? MessageSquareText
                          : UserCircle2;
                    let relTime = '';
                    try {
                      relTime = formatDistanceToNow(parseISO(item.timestamp), { addSuffix: true });
                    } catch {
                      relTime = '';
                    }

                    return (
                      <Link
                        key={item.id}
                        to={targetRoute}
                        onClick={() => setNotifOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-[#F7F2E9]/60 transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#57252F]/10 text-[#57252F] mt-0.5">
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-[#171615]">{item.title}</div>
                          <p className="text-[11px] text-[#5C554E] line-clamp-2 mt-0.5">
                            {item.description}
                          </p>
                          {relTime && (
                            <div className="text-[10px] text-[#5C554E]/80 mt-1">{relTime}</div>
                          )}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        {user && (
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setNotifOpen(false);
              }}
              aria-expanded={profileOpen}
              className="flex items-center gap-2.5 rounded-lg border border-[#171615]/12 bg-[#FFFFFF] px-2.5 py-1.5 hover:bg-[#F7F2E9] hover:border-[#C5A46D] transition-colors cursor-pointer"
            >
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-7 w-7 rounded-full object-cover border border-[#C5A46D]/60"
              />
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-semibold text-[#171615] max-w-[120px] truncate">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[10px] text-[#5C554E] truncate">{user.role}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#5C554E] hidden sm:block" aria-hidden="true" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#FFFFFF] border border-[#171615]/12 shadow-xl overflow-hidden z-40">
                <div className="px-4 py-3 border-b border-[#171615]/10 bg-[#F7F2E9]/70">
                  <div className="text-xs font-semibold text-[#171615] truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[11px] text-[#5C554E] truncate">{user.email}</div>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#171615] hover:bg-[#F7F2E9] transition-colors"
                  >
                    <UserCircle2 className="w-4 h-4 text-[#57252F]" aria-hidden="true" />
                    <span>Profile &amp; Password</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onRequestLogout();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
