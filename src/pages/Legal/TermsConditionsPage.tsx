import { Link } from 'react-router-dom';
import { STUDIO_CONFIG } from '../../data/studio';
import { SeoHelmet } from '../../components/common/SeoHelmet';

export default function TermsConditionsPage() {
  return (
    <section className="pt-32 pb-24 bg-[#F7F2E9] text-[#171615]">
      <SeoHelmet
        title={`Terms & Conditions | ${STUDIO_CONFIG.name}`}
        description={`Service booking terms, delivery timelines, Madhya Pradesh travel policies, and usage rights for ${STUDIO_CONFIG.name}.`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Terms & Conditions', path: '/terms-and-conditions' },
        ]}
      />
      <div className="studio-container max-w-3xl space-y-8">
        <div className="border-b border-[#171615]/12 pb-6">
          <div className="text-xs tracking-[0.14em] text-[#57252F] mb-2">Legal Documentation</div>
          <h1 className="section-headline font-editorial font-medium">Terms &amp; Conditions</h1>
          <p className="mt-2 text-xs text-[#5C554E]">
            Last updated: November 2026 · Editable Standard Studio Service Terms for {STUDIO_CONFIG.name}
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-[#5C554E] leading-relaxed">
          <div>
            <h2 className="font-editorial text-2xl font-medium text-[#171615] mb-2">
              1. Bookings &amp; Retainer Schedule
            </h2>
            <p>
              Online inquiries generated through this website serve as non-binding consultation
              requests. Event dates are officially reserved upon signing a written studio service
              agreement and receipt of the agreed booking retainer.
            </p>
          </div>

          <div>
            <h2 className="font-editorial text-2xl font-medium text-[#171615] mb-2">
              2. Deliverables &amp; Turnaround
            </h2>
            <p>
              Edited high-resolution photographs are typically delivered within 4 to 6 weeks of the
              final ceremony, and 4K wedding films within 6 to 8 weeks. Raw unedited camera files are
              not part of standard editorial deliverables unless contracted separately.
            </p>
          </div>

          <div>
            <h2 className="font-editorial text-2xl font-medium text-[#171615] mb-2">
              3. Outstation Travel &amp; Heritage Venue Permissions
            </h2>
            <p>
              For destination celebrations outside {STUDIO_CONFIG.city}, client-side arrangements or
              reimbursement at actuals apply for crew transport and clean accommodation. Monument or
              heritage fort entry and drone permits are coordinated with the client in advance.
            </p>
          </div>

          <div>
            <h2 className="font-editorial text-2xl font-medium text-[#171615] mb-2">
              4. Rescheduling &amp; Cancellations
            </h2>
            <p>
              Should auspicious dates change, retainers may generally be transferred once to a
              mutually open date within 12 months when notified in writing well ahead of the event.
              Full cancellation terms are detailed in individual client contracts.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#171615]/12 flex gap-5 text-sm font-medium text-[#57252F]">
          <Link to="/privacy-policy" className="hover:underline">
            Read Privacy Policy
          </Link>
          <Link to="/booking" className="hover:underline">
            Start Booking Inquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
