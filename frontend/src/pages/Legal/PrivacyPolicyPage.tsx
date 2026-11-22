import { Link } from 'react-router-dom';
import { STUDIO_CONFIG } from '../../data/studio';
import { SeoHelmet } from '../../components/common/SeoHelmet';

export default function PrivacyPolicyPage() {
  return (
    <section className="pt-32 pb-24 bg-[#F7F2E9] text-[#171615]">
      <SeoHelmet
        title={`Privacy Policy | ${STUDIO_CONFIG.name}`}
        description={`Read how ${STUDIO_CONFIG.name} in Indore, Madhya Pradesh handles client inquiries, booking records, and private wedding galleries.`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy-policy' },
        ]}
      />
      <div className="studio-container max-w-3xl space-y-8">
        <div className="border-b border-[#171615]/12 pb-6">
          <div className="text-xs tracking-[0.14em] text-[#57252F] mb-2">Legal Documentation</div>
          <h1 className="section-headline font-editorial font-medium">Privacy Policy</h1>
          <p className="mt-2 text-xs text-[#5C554E]">
            Last updated: November 2026 · Studio Policy for {STUDIO_CONFIG.name}
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-[#5C554E] leading-relaxed">
          <div>
            <h2 className="font-editorial text-2xl font-medium text-[#171615] mb-2">
              1. Information You Share With Us
            </h2>
            <p>
              When you submit a contact or booking inquiry on {STUDIO_CONFIG.name}, you voluntarily
              provide details such as your name, email address, Indian mobile/WhatsApp number, event
              dates, and venue city so our photography studio can prepare an accurate proposal.
            </p>
          </div>

          <div>
            <h2 className="font-editorial text-2xl font-medium text-[#171615] mb-2">
              2. How Your Inquiry Data Is Stored &amp; Protected
            </h2>
            <p>
              Contact inquiries, booking requests, and newsletter subscriptions are securely stored
              in our studio database and accessed exclusively by authorized studio administrators
              through encrypted authentication to coordinate your shoot, prepare quotations, and
              communicate event schedules.
            </p>
          </div>

          <div>
            <h2 className="font-editorial text-2xl font-medium text-[#171615] mb-2">
              3. Client Gallery &amp; Portrait Confidentiality
            </h2>
            <p>
              We deeply respect the privacy of Indian families, children, and private ceremonies.
              Delivered online photography galleries can be protected with private access PINs, and we
              only feature selected photographs in our public portfolio with explicit client consent.
            </p>
          </div>

          <div>
            <h2 className="font-editorial text-2xl font-medium text-[#171615] mb-2">
              4. Contact for Privacy Questions
            </h2>
            <p>
              For data removal requests or gallery privacy preferences, contact our studio desk at{' '}
              <a href={`mailto:${STUDIO_CONFIG.email}`} className="text-[#57252F] underline">
                {STUDIO_CONFIG.email}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#171615]/12 flex gap-5 text-sm font-medium text-[#57252F]">
          <Link to="/terms-and-conditions" className="hover:underline">
            Read Terms &amp; Conditions
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact Studio Desk
          </Link>
        </div>
      </div>
    </section>
  );
}
