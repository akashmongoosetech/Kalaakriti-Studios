import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Info, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuthSplitLayout } from '../../components/admin/AuthSplitLayout';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { adminAuthService } from '../../services/admin/auth.service';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';
import { STUDIO_CONFIG } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';

export default function AdminForgotPasswordPage() {
  const { isAuthenticated } = useAdminAuth();
  const [identifier, setIdentifier] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const trimmed = identifier.trim();
    if (trimmed.length < 3) {
      setServerError('Please enter your registered email address or mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const message = await adminAuthService.requestPasswordRecovery(trimmed);
      setSubmittedMessage(message);
      toast.success('Recovery request submitted.');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unable to process recovery request right now.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-3.5 py-2.5 text-sm text-[#171615] placeholder:text-[#5C554E]/60 focus:border-[#57252F] focus:outline-none transition-colors';

  return (
    <>
      <SeoHelmet
        title={`Recover Admin Access | ${STUDIO_CONFIG.name}`}
        description="Request password recovery for your Kalaakriti Studios administrator account."
        noIndex
      />
      <AuthSplitLayout
        headline="Restore Access to Your Studio Desk."
        subheadline="Enter your registered email address or mobile number to request administrator account recovery."
        formTitle="Account Recovery"
        formDescription="Verify your administrator identity to initiate a secure password reset."
        photoSrc={STUDIO_IMAGES.weddingPheras}
        footerSlot={
          <span>
            Remembered your password?{' '}
            <Link
              to="/admin/login"
              className="font-semibold text-[#57252F] hover:underline underline-offset-4"
            >
              Back to Login
            </Link>
          </span>
        }
      >
        {submittedMessage ? (
          <div className="rounded-xl bg-[#F7F2E9] border border-[#C5A46D]/60 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#57252F] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1.5">
                <h3 className="font-editorial text-xl font-semibold text-[#171615]">
                  Recovery Request Received
                </h3>
                <p className="text-xs text-[#5C554E] leading-relaxed">{submittedMessage}</p>
              </div>
            </div>
            <Link
              to="/admin/login"
              className="inline-flex items-center justify-center rounded-lg bg-[#57252F] px-5 py-2.5 text-xs font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="flex items-start gap-2.5 rounded-lg bg-[#F7F2E9] border border-[#C5A46D]/50 px-3.5 py-3 text-[11px] text-[#5C554E] leading-relaxed">
              <Info className="w-4 h-4 text-[#57252F] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                For security, password resets never reveal whether an account exists. Connect your
                studio SMTP provider in <code>backend/.env</code> to deliver automated reset links.
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

            <div>
              <label htmlFor="fp-identifier" className="block text-xs font-medium text-[#171615] mb-1">
                Registered Email Address or Mobile Number *
              </label>
              <input
                id="fp-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="studio.admin@kalaakritistudios.example"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#57252F] px-6 py-3 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                  <span>Request Recovery</span>
                </>
              )}
            </button>
          </form>
        )}
      </AuthSplitLayout>
    </>
  );
}
