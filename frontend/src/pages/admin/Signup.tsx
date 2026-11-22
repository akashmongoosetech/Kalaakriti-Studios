import { useRef, useState, type ChangeEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Camera,
  Eye,
  EyeOff,
  Info,
  Loader2,
  RefreshCw,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';
import { AuthSplitLayout } from '../../components/admin/AuthSplitLayout';
import { PasswordStrengthMeter } from '../../components/admin/PasswordStrengthMeter';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { adminSignupSchema, type AdminSignupValues } from '../../schemas/auth.schema';
import { processProfileImageFile } from '../../services/admin/storage.util';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';
import { STUDIO_CONFIG } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';

export default function AdminSignupPage() {
  const { isAuthenticated, signup } = useAdminAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminSignupValues>({
    resolver: zodResolver(adminSignupSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      profilePicture: '',
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const passwordValue = watch('password');
  const profilePictureValue = watch('profilePicture');

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    setImageProcessing(true);
    try {
      const dataUrl = await processProfileImageFile(file);
      setSelectedAvatarFile(file);
      setValue('profilePicture', dataUrl, { shouldValidate: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to process the selected profile picture.';
      setImageError(message);
      toast.error(message);
    } finally {
      setImageProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedAvatarFile(null);
    setValue('profilePicture', '', { shouldValidate: true });
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (values: AdminSignupValues) => {
    setServerError(null);
    try {
      const createdUser = await signup(values, selectedAvatarFile);
      toast.success(
        `Welcome, ${createdUser.firstName}! Your studio username is "@${createdUser.username}".`,
        { duration: 5000 }
      );
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to create administrator account.';
      setServerError(message);
      toast.error(message);
    }
  };

  const inputClass =
    'w-full rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-3.5 py-2.5 text-sm text-[#171615] placeholder:text-[#5C554E]/60 focus:border-[#57252F] focus:outline-none transition-colors';

  return (
    <>
      <SeoHelmet
        title={`Create Admin Account | ${STUDIO_CONFIG.name}`}
        description="Register a frontend demonstration administrator account for Kalaakriti Studios CRM."
        noIndex
      />
      <AuthSplitLayout
        headline="Curate Every Wedding Inquiry With Editorial Precision."
        subheadline="Manage client conversations, multi-day celebration bookings, deliverables, and Madhya Pradesh event schedules from one refined studio workspace."
        formTitle="Create Admin Account"
        formDescription="Register your administrator profile to access the Kalaakriti Studios CRM dashboard."
        photoSrc={STUDIO_IMAGES.preweddingPalace}
        footerSlot={
          <span>
            Already have an account?{' '}
            <Link
              to="/admin/login"
              className="font-semibold text-[#57252F] hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </span>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-lg bg-[#F7F2E9] border border-[#C5A46D]/45 px-3.5 py-2.5 text-[11px] text-[#5C554E] leading-relaxed">
            <Info className="w-4 h-4 text-[#57252F] shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Accounts are secured with server-side bcrypt password hashing and JWT authentication.
              Your profile photo is uploaded directly to the studio server.
            </span>
          </div>

          {serverError && (
            <div
              role="alert"
              className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] px-3.5 py-2.5 text-xs font-medium text-[#B91C1C]"
            >
              {serverError}
            </div>
          )}

          {/* Profile Picture Upload (Required) */}
          <div className="space-y-2">
            <span className="block text-xs font-medium text-[#171615]">
              Profile Picture * <span className="text-[#5C554E] font-normal">(JPG, PNG, WebP · Max 5 MB)</span>
            </span>
            <div className="flex items-center gap-4 rounded-xl border border-dashed border-[#C5A46D]/60 bg-[#F7F2E9]/50 p-3.5">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[#C5A46D] bg-[#E8DCCB] flex items-center justify-center shrink-0">
                {profilePictureValue ? (
                  <img
                    src={profilePictureValue}
                    alt="Selected profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera className="w-6 h-6 text-[#57252F]/70" aria-hidden="true" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <input
                  ref={fileInputRef}
                  id="signup-avatar"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="sr-only"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={imageProcessing}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#57252F] px-3 py-1.5 text-xs font-medium text-[#F7F2E9] hover:bg-[#3E1820] disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {imageProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    ) : profilePictureValue ? (
                      <RefreshCw className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                    ) : (
                      <Camera className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                    )}
                    <span>{profilePictureValue ? 'Replace Photo' : 'Upload Photo'}</span>
                  </button>

                  {profilePictureValue && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#FECACA] bg-[#FFFFFF] px-2.5 py-1.5 text-xs font-medium text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#5C554E]">
                  Circular preview shown in the dashboard sidebar and profile card.
                </p>
              </div>
            </div>
            {(imageError || errors.profilePicture) && (
              <p role="alert" className="text-xs text-[#B91C1C]">
                {imageError || errors.profilePicture?.message}
              </p>
            )}
          </div>

          {/* Name Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="signup-firstName" className="block text-xs font-medium text-[#171615] mb-1">
                First Name *
              </label>
              <input
                id="signup-firstName"
                type="text"
                autoComplete="given-name"
                placeholder="e.g., Aarav"
                {...register('firstName')}
                className={inputClass}
              />
              {errors.firstName && (
                <p role="alert" className="mt-1 text-xs text-[#B91C1C]">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="signup-lastName" className="block text-xs font-medium text-[#171615] mb-1">
                Last Name *
              </label>
              <input
                id="signup-lastName"
                type="text"
                autoComplete="family-name"
                placeholder="e.g., Joshi"
                {...register('lastName')}
                className={inputClass}
              />
              {errors.lastName && (
                <p role="alert" className="mt-1 text-xs text-[#B91C1C]">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="block text-xs font-medium text-[#171615] mb-1">
              Email Address *
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="studio.admin@kalaakritistudios.example"
              {...register('email')}
              className={inputClass}
            />
            {errors.email && (
              <p role="alert" className="mt-1 text-xs text-[#B91C1C]">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="signup-mobile" className="block text-xs font-medium text-[#171615] mb-1">
              Mobile Number (India) *
            </label>
            <input
              id="signup-mobile"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              {...register('mobile')}
              className={inputClass}
            />
            {errors.mobile && (
              <p role="alert" className="mt-1 text-xs text-[#B91C1C]">
                {errors.mobile.message}
              </p>
            )}
          </div>

          {/* Password + Strength Meter */}
          <div>
            <label htmlFor="signup-password" className="block text-xs font-medium text-[#171615] mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Create a strong password"
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
            <PasswordStrengthMeter password={passwordValue} />
          </div>

          {/* Terms Notice */}
          <p className="text-[11px] text-[#5C554E] leading-relaxed">
            By creating an account, you agree to the studio{' '}
            <Link to="/terms-and-conditions" className="text-[#57252F] font-medium hover:underline">
              Terms &amp; Conditions
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="text-[#57252F] font-medium hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={isSubmitting || imageProcessing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#57252F] px-6 py-3 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>
      </AuthSplitLayout>
    </>
  );
}
