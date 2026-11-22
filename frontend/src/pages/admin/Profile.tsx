import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import {
  Calendar,
  Camera,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { PasswordStrengthMeter } from '../../components/admin/PasswordStrengthMeter';
import {
  adminChangePasswordSchema,
  adminProfileUpdateSchema,
  type AdminChangePasswordValues,
  type AdminProfileUpdateValues,
} from '../../schemas/auth.schema';
import { profileService } from '../../services/admin/profile.service';
import { processProfileImageFile } from '../../services/admin/storage.util';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';
import { STUDIO_CONFIG } from '../../data/studio';

function safeFormatDate(iso?: string): string {
  if (!iso) return '—';
  try {
    const parsed = parseISO(iso);
    if (Number.isNaN(parsed.getTime())) return iso;
    return format(parsed, 'dd MMM yyyy, hh:mm a');
  } catch {
    return iso;
  }
}

export default function AdminProfilePage() {
  const { user, setUser } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string>(user?.profilePicture ?? '');
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [imageProcessing, setImageProcessing] = useState(false);

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const profileForm = useForm<AdminProfileUpdateValues>({
    resolver: zodResolver(adminProfileUpdateSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      mobile: user?.mobile ?? '',
    },
  });

  const passwordForm = useForm<AdminChangePasswordValues>({
    resolver: zodResolver(adminChangePasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
      });
      setAvatarPreview(user.profilePicture);
    }
  }, [user, profileForm]);

  if (!user) return null;

  const newPasswordWatch = passwordForm.watch('newPassword');

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageProcessing(true);
    try {
      const dataUrl = await processProfileImageFile(file);
      setSelectedAvatarFile(file);
      setAvatarPreview(dataUrl);
      toast.success('Profile photo ready. Click "Save Profile Changes" to apply.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to process selected image.';
      toast.error(message);
    } finally {
      setImageProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onSaveProfile = async (values: AdminProfileUpdateValues) => {
    try {
      const updated = await profileService.updateProfile(
        user.username,
        values,
        selectedAvatarFile
      );
      setSelectedAvatarFile(null);
      setUser(updated);
      toast.success('Administrator profile updated successfully.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update profile.';
      toast.error(message);
    }
  };

  const onChangePassword = async (values: AdminChangePasswordValues) => {
    try {
      await profileService.changePassword(
        values.currentPassword,
        values.newPassword,
        values.confirmPassword
      );
      passwordForm.reset();
      toast.success('Password updated successfully.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update password.';
      toast.error(message);
    }
  };

  const inputClass =
    'w-full rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-3.5 py-2.5 text-sm text-[#171615] placeholder:text-[#5C554E]/60 focus:border-[#57252F] focus:outline-none transition-colors';

  return (
    <div className="space-y-6">
      <SeoHelmet
        title={`Administrator Profile | ${STUDIO_CONFIG.name} Admin`}
        description="Manage your studio administrator profile details, profile picture, and password."
        noIndex
      />

      {/* Profile Overview Hero Card */}
      <section className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-6 shadow-[0_2px_12px_rgba(23,22,21,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-[#C5A46D] bg-[#E8DCCB] shrink-0">
            <img
              src={avatarPreview || user.profilePicture}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#171615]">
                {user.firstName} {user.lastName}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#57252F]/10 border border-[#57252F]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#57252F]">
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                <span>{user.role}</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5C554E]">
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                <span>@{user.username}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                <span>{user.email}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <Phone className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                <span>{user.mobile}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#5C554E] space-y-1 border-t md:border-t-0 md:border-l border-[#171615]/10 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
            <span>Account Created</span>
          </div>
          <div className="font-semibold text-[#171615] tabular-nums">
            {safeFormatDate(user.createdAt)}
          </div>
          <div className="text-[11px] tabular-nums">
            Updated: {safeFormatDate(user.updatedAt)}
          </div>
        </div>
      </section>

      {/* Two-Column Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Edit Profile Details */}
        <section className="lg:col-span-7 rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-6 shadow-[0_2px_12px_rgba(23,22,21,0.03)]">
          <div className="pb-4 mb-5 border-b border-[#171615]/8">
            <h3 className="font-editorial text-2xl font-semibold text-[#171615]">
              Profile Information
            </h3>
            <p className="text-xs text-[#5C554E] mt-0.5">
              Update your display name, contact credentials, and profile picture.
            </p>
          </div>

          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} noValidate className="space-y-4">
            {/* Avatar Picker */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl bg-[#F7F2E9]/65 border border-[#171615]/10 p-4">
              <img
                src={avatarPreview || user.profilePicture}
                alt="Profile avatar preview"
                className="h-14 w-14 rounded-full object-cover border-2 border-[#C5A46D]"
              />
              <div className="space-y-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="sr-only"
                />
                <button
                  type="button"
                  disabled={imageProcessing}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#57252F] px-3.5 py-1.5 text-xs font-medium text-[#F7F2E9] hover:bg-[#3E1820] disabled:opacity-60 cursor-pointer"
                >
                  {imageProcessing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                  )}
                  <span>Change Profile Photo</span>
                </button>
                <p className="text-[11px] text-[#5C554E]">
                  JPG, JPEG, PNG, or WebP · Max file size 5 MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prof-firstName" className="block text-xs font-medium text-[#171615] mb-1">
                  First Name *
                </label>
                <input
                  id="prof-firstName"
                  type="text"
                  {...profileForm.register('firstName')}
                  className={inputClass}
                />
                {profileForm.formState.errors.firstName && (
                  <p className="mt-1 text-xs text-[#B91C1C]">
                    {profileForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="prof-lastName" className="block text-xs font-medium text-[#171615] mb-1">
                  Last Name *
                </label>
                <input
                  id="prof-lastName"
                  type="text"
                  {...profileForm.register('lastName')}
                  className={inputClass}
                />
                {profileForm.formState.errors.lastName && (
                  <p className="mt-1 text-xs text-[#B91C1C]">
                    {profileForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="prof-email" className="block text-xs font-medium text-[#171615] mb-1">
                  Email Address *
                </label>
                <input
                  id="prof-email"
                  type="email"
                  {...profileForm.register('email')}
                  className={inputClass}
                />
                {profileForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-[#B91C1C]">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="prof-mobile" className="block text-xs font-medium text-[#171615] mb-1">
                  Mobile Number *
                </label>
                <input
                  id="prof-mobile"
                  type="tel"
                  {...profileForm.register('mobile')}
                  className={inputClass}
                />
                {profileForm.formState.errors.mobile && (
                  <p className="mt-1 text-xs text-[#B91C1C]">
                    {profileForm.formState.errors.mobile.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="prof-username" className="block text-xs font-medium text-[#5C554E] mb-1">
                  Studio Username (Read-only login identifier)
                </label>
                <input
                  id="prof-username"
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full rounded-lg bg-[#F7F2E9] border border-[#171615]/10 px-3.5 py-2.5 text-sm text-[#5C554E] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileForm.formState.isSubmitting || imageProcessing}
                className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-5 py-2.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] disabled:opacity-60 transition-colors cursor-pointer"
              >
                {profileForm.formState.isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                )}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </section>

        {/* Change Password Section */}
        <section className="lg:col-span-5 rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-6 shadow-[0_2px_12px_rgba(23,22,21,0.03)]">
          <div className="pb-4 mb-5 border-b border-[#171615]/8">
            <h3 className="font-editorial text-2xl font-semibold text-[#171615]">
              Change Password
            </h3>
            <p className="text-xs text-[#5C554E] mt-0.5">
              Update your studio administrator password securely.
            </p>
          </div>

          <form
            onSubmit={passwordForm.handleSubmit(onChangePassword)}
            noValidate
            className="space-y-4"
          >
            <div>
              <label htmlFor="cp-current" className="block text-xs font-medium text-[#171615] mb-1">
                Current Password *
              </label>
              <div className="relative">
                <input
                  id="cp-current"
                  type={showCurrentPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter current password"
                  {...passwordForm.register('currentPassword')}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw((p) => !p)}
                  aria-label={showCurrentPw ? 'Hide current password' : 'Show current password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C554E] hover:text-[#171615] cursor-pointer"
                >
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <p className="mt-1 text-xs text-[#B91C1C]">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cp-new" className="block text-xs font-medium text-[#171615] mb-1">
                New Password *
              </label>
              <div className="relative">
                <input
                  id="cp-new"
                  type={showNewPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create strong new password"
                  {...passwordForm.register('newPassword')}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw((p) => !p)}
                  aria-label={showNewPw ? 'Hide new password' : 'Show new password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C554E] hover:text-[#171615] cursor-pointer"
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className="mt-1 text-xs text-[#B91C1C]">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
              <PasswordStrengthMeter password={newPasswordWatch} />
            </div>

            <div>
              <label htmlFor="cp-confirm" className="block text-xs font-medium text-[#171615] mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  id="cp-confirm"
                  type={showConfirmPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                  {...passwordForm.register('confirmPassword')}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw((p) => !p)}
                  aria-label={showConfirmPw ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C554E] hover:text-[#171615] cursor-pointer"
                >
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-xs text-[#B91C1C]">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#171615] px-5 py-2.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#57252F] disabled:opacity-60 transition-colors cursor-pointer"
              >
                {passwordForm.formState.isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <KeyRound className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                )}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
