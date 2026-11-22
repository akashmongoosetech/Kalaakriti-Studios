import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { AuthSplitLayout } from '../../components/admin/AuthSplitLayout';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { adminLoginSchema, type AdminLoginValues } from '../../schemas/auth.schema';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';
import { STUDIO_CONFIG } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';

interface LoginLocationState {
  from?: string;
  prefillIdentifier?: string;
  justSignedUp?: boolean;
}

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as LoginLocationState | null) ?? null;

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      identifier: navState?.prefillIdentifier ?? '',
      password: '',
      rememberMe: true,
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (values: AdminLoginValues) => {
    setAuthError(null);
    try {
      const signedInUser = await login(values);
      toast.success(`Welcome back, ${signedInUser.firstName}!`);
      const destination =
        navState?.from && navState.from.startsWith('/admin/') && navState.from !== '/admin/login'
          ? navState.from
          : '/admin/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setAuthError(message);
      toast.error(message);
    }
  };

  const inputClass =
    'w-full rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-3.5 py-2.5 text-sm text-[#171615] placeholder:text-[#5C554E]/60 focus:border-[#57252F] focus:outline-none transition-colors';

  return (
    <>
      <SeoHelmet
        title={`Studio Admin Login | ${STUDIO_CONFIG.name}`}
        description="Sign in to the Kalaakriti Studios administrator CRM workspace."
        noIndex
      />
      <AuthSplitLayout
        headline="Your Photography Studio Command Center."
        subheadline="Track incoming wedding inquiries, update booking statuses, review coverage deliverables, and stay ahead of every celebration across Indore, Bhopal, and Ujjain."
        formTitle="Administrator Sign In"
        formDescription="Sign in using your registered username, email address, or Indian mobile number."
        photoSrc={STUDIO_IMAGES.heroWedding}
        footerSlot={
          <span>
            Don&apos;t have an account?{' '}
            <Link
              to="/admin/signup"
              className="font-semibold text-[#57252F] hover:underline underline-offset-4"
            >
              Sign Up
            </Link>
          </span>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

          {navState?.justSignedUp && (
            <div className="rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] px-3.5 py-2.5 text-xs font-medium text-[#15803D]">
              Account registered! Enter your password below to enter the dashboard.
            </div>
          )}

          {authError && (
            <div
              role="alert"
              className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] px-3.5 py-2.5 text-xs font-medium text-[#B91C1C]"
            >
              {authError}
            </div>
          )}

          {/* Identification Field */}
          <div>
            <label htmlFor="login-identifier" className="block text-xs font-medium text-[#171615] mb-1">
              Username, Email, or Mobile Number *
            </label>
            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              placeholder="e.g., aarav.joshi · email@domain.com · +91 9876543210"
              {...register('identifier')}
              className={inputClass}
            />
            {errors.identifier && (
              <p role="alert" className="mt-1 text-xs text-[#B91C1C]">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="login-password" className="block text-xs font-medium text-[#171615]">
                Password *
              </label>
              <Link
                to="/admin/forgot-password"
                className="text-xs font-medium text-[#57252F] hover:underline underline-offset-2"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register('password')}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C554E] hover:text-[#171615] cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p role="alert" className="mt-1 text-xs text-[#B91C1C]">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-xs text-[#5C554E] cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 rounded border-[#171615]/25 accent-[#57252F] cursor-pointer"
              />
              <span>Remember me on this browser</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#57252F] px-6 py-3 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>

        </form>
      </AuthSplitLayout>
    </>
  );
}
