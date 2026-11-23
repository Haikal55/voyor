import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | VOYOR Official Boutique",
  description:
    "Official Privacy Policy and Data Protection Notice of VOYOR S.r.l. pursuant to EU Regulation 2016/679 (GDPR).",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-neutral-300 pt-24 sm:pt-28 pb-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-wider text-neutral-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="mx-2 text-neutral-700">/</span>
          <span className="text-neutral-400">Legal</span>
          <span className="mx-2 text-neutral-700">/</span>
          <span className="text-neutral-300">Privacy Policy</span>
        </nav>

        <header className="border-b border-neutral-800 pb-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-serif text-white uppercase tracking-[0.05em] mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-500 uppercase tracking-widest">
            Notice Pursuant to Article 13 of Regulation (EU) 2016/679 (GDPR)
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Effective Date: January 1, 2026 • Last Reviewed: November 2026
          </p>
        </header>

        <article className="space-y-10 text-xs sm:text-sm font-light leading-relaxed text-neutral-300">
          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              1. Data Controller & Data Protection Officer
            </h2>
            <p>
              The Data Controller responsible for the processing of your personal data is VOYOR S.r.l., with registered office at Via Montenapoleone 8, 20121 Milano (MI), Italy, Tax Code and VAT registration number IT09876543210 (&ldquo;VOYOR&rdquo;, &ldquo;we&rdquo;, or &ldquo;Controller&rdquo;).
            </p>
            <p>
              VOYOR has appointed a certified Data Protection Officer (DPO) who can be contacted directly for any matters concerning your personal data and the exercise of your privacy rights at:
            </p>
            <address className="not-italic text-xs text-neutral-400 pl-2">
              Email: dpo@voyor.com • Postal: Data Protection Officer, VOYOR S.r.l., Via Montenapoleone 8, 20121 Milano, Italy.
            </address>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              2. Categories of Personal Data Collected
            </h2>
            <p>
              Depending on how you interact with our digital boutique and flagship salons, we collect and process the following categories of personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-400">
              <li>
                <strong className="text-neutral-200">Identity & Contact Data:</strong> Name, surname, title, billing and shipping address, email address, telephone/WhatsApp contact details.
              </li>
              <li>
                <strong className="text-neutral-200">Transaction & Payment Data:</strong> Details of orders placed, payment confirmation tokens, invoices, delivery tracking, and purchase history. Note: Full payment card details are handled directly by certified level-1 PCI-DSS payment providers and are never stored on VOYOR servers.
              </li>
              <li>
                <strong className="text-neutral-200">Atelier & Booking Data:</strong> Information provided when scheduling private salon appointments, including preferred boutique location, consultation date and time, clothing or shoe size requirements, bespoke tailoring measurements, and hospitality preferences.
              </li>
              <li>
                <strong className="text-neutral-200">Browsing & Technical Data:</strong> IP addresses, browser type, device identifiers, time-zone settings, and navigation activity through essential session cookies.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              3. Purposes & Legal Grounds for Processing
            </h2>
            <p>
              We process your personal data exclusively under legitimate legal grounds established by Article 6 of the GDPR:
            </p>
            <div className="space-y-3 text-neutral-400">
              <p>
                <strong className="text-white">a) Contract Execution & Order Fulfillment (Art. 6(1)(b) GDPR):</strong> To process orders, execute white-glove delivery, manage customer service inquiries, handle returns, and schedule in-store or virtual appointments.
              </p>
              <p>
                <strong className="text-white">b) Compliance with Legal Obligations (Art. 6(1)(c) GDPR):</strong> To satisfy tax, accounting, customs, and consumer rights obligations required by Italian and European Union law.
              </p>
              <p>
                <strong className="text-white">c) Legitimate Interests (Art. 6(1)(f) GDPR):</strong> To prevent fraudulent transactions, guarantee network and information security, and protect VOYOR&rsquo;s legal rights in judicial or administrative disputes.
              </p>
              <p>
                <strong className="text-white">d) Voluntary Consent (Art. 6(1)(a) GDPR):</strong> For sending curated seasonal previews, invitations to private runway shows, or storing non-essential preferences. Consent may be withdrawn at any time.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              4. Data Retention Periods
            </h2>
            <p>
              Your personal data will be retained only for the period strictly necessary to achieve the specific purposes for which it was collected:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-neutral-400">
              <li>Purchases and transactional records: ten (10) years, pursuant to mandatory Italian statutory and fiscal retention laws (Article 2220 of the Italian Civil Code).</li>
              <li>Salon booking information: twelve (12) months following the appointment date, unless integrated into client profile records upon explicit request.</li>
              <li>Customer care correspondence: twenty-four (24) months from resolution of the inquiry.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              5. Authorized Data Recipients & Processors
            </h2>
            <p>
              Your personal data may be shared only with strictly authorized personnel within VOYOR and trusted third-party service providers acting as Data Processors pursuant to Article 28 of the GDPR, including:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-neutral-400">
              <li>Certified payment processing institutions and anti-fraud verification providers.</li>
              <li>Specialized global courier networks (DHL Express, FedEx Priority, armored delivery services).</li>
              <li>Hosting infrastructure and enterprise technology providers located within the European Economic Area (EEA).</li>
              <li>Legal and fiscal advisors when necessary to defend corporate rights or meet legal mandates.</li>
            </ul>
            <p>
              VOYOR does not sell, rent, or trade your personal data to third parties for independent commercial marketing under any circumstances.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              6. International Data Transfers
            </h2>
            <p>
              Data is predominantly processed within the European Union. In instances where operational requirements involve transferring data outside the EEA (such as coordinating with our flagship salons in Tokyo or New York), such transfers are governed by standard contractual clauses approved by the European Commission pursuant to Article 46 of the GDPR, ensuring equivalent protection standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              7. Your Legal Rights Under the GDPR
            </h2>
            <p>
              As a data subject, you are entitled to exercise the following rights at any time under Articles 15 through 22 of Regulation (EU) 2016/679:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-400">
              <li><strong className="text-neutral-200">Right of Access (Art. 15):</strong> Obtain confirmation of whether your data is being processed and receive a copy.</li>
              <li><strong className="text-neutral-200">Right to Rectification (Art. 16):</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong className="text-neutral-200">Right to Erasure (&ldquo;Right to be Forgotten&rdquo;, Art. 17):</strong> Request deletion of your data when retention is no longer justified.</li>
              <li><strong className="text-neutral-200">Right to Restriction of Processing (Art. 18):</strong> Restrict processing under statutory conditions.</li>
              <li><strong className="text-neutral-200">Right to Data Portability (Art. 20):</strong> Receive your data in a structured, commonly used, and machine-readable format.</li>
              <li><strong className="text-neutral-200">Right to Object (Art. 21):</strong> Object to data processing based on legitimate interests.</li>
              <li><strong className="text-neutral-200">Right to Withdraw Consent:</strong> Withdraw consent at any time without affecting the lawfulness of processing based on consent before withdrawal.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              8. Exercise of Rights & Supervisory Authority
            </h2>
            <p>
              To exercise any of the rights enumerated above, you may submit a request free of charge to our Privacy Team at privacy@voyor.com or write to:
            </p>
            <address className="not-italic text-xs text-neutral-400 pl-2">
              VOYOR S.r.l. — Privacy & Data Protection Office<br />
              Via Montenapoleone 8, 20121 Milano, Italy
            </address>
            <p>
              You also have the right to lodge a formal complaint with the competent supervisory authority, in particular in the Member State of your habitual residence or place of employment. In Italy, the supervisory authority is the Garante per la protezione dei dati personali (Piazza Venezia 11, 00187 Roma, www.garanteprivacy.it).
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-neutral-800 text-xs text-neutral-400">
            <h2 className="text-sm font-serif text-white uppercase tracking-wider">
              9. Policy Revisions
            </h2>
            <p>
              VOYOR reserves the right to amend or update this Privacy Policy to reflect evolving regulatory frameworks or internal business practices. Any updates will be published directly on this page with an updated effective revision date.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
