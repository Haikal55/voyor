import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | VOYOR Official Boutique",
  description:
    "Official General Terms and Conditions of Sale and Website Use for VOYOR S.r.l. Milano.",
};

export default function TermsAndConditionsPage() {
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
          <span className="text-neutral-300">Terms & Conditions</span>
        </nav>

        <header className="border-b border-neutral-800 pb-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-serif text-white uppercase tracking-[0.05em] mb-4">
            Terms & Conditions of Sale
          </h1>
          <p className="text-xs text-neutral-500 uppercase tracking-widest">
            VOYOR S.r.l. • Via Montenapoleone 8, 20121 Milano, Italy
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Last Updated: November 2026 • Valid for all online purchases and boutique bookings
          </p>
        </header>

        <article className="space-y-10 text-xs sm:text-sm font-light leading-relaxed text-neutral-300">
          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              1. General Provisions & Scope
            </h2>
            <p>
              These General Terms and Conditions of Sale (&ldquo;Terms&rdquo;) govern the purchase of all garments, accessories, footwear, leather goods, and high perfumery (&ldquo;Products&rdquo;) offered through the official digital boutique of VOYOR, accessible via www.voyor.com, and private salon appointments arranged with VOYOR S.r.l. (&ldquo;VOYOR&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;).
            </p>
            <p>
              VOYOR S.r.l. is an Italian limited liability company with registered office at Via Montenapoleone 8, 20121 Milano (MI), Italy, registered with the Milan Chamber of Commerce under Business Register / REA MI-2684910, Tax Code and VAT registration number IT09876543210, Share Capital €2,500,000 fully paid.
            </p>
            <p>
              By accessing our website, placing an order, or scheduling an atelier appointment, you agree to be bound by these Terms, as well as our Privacy Policy and Cookie Policy. If you do not accept these Terms without reservation, you must refrain from placing orders.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              2. Products, Craftsmanship & Availability
            </h2>
            <p>
              All VOYOR creations are conceived, engineered, and handcrafted in Italy adhering to authentic haute couture techniques. Slight variations in textile weave, grain texture of full-grain calfskins, or hand-applied gold leaf hardware finishes reflect the unique artisanal execution of each individual piece and shall not be deemed defects.
            </p>
            <p>
              Product displays on our website constitute an invitation to offer and do not represent a binding contract of sale. All items are offered subject to atelier availability. In the event an ordered item becomes unavailable due to limited salon reserves or craftsmanship delays, we will notify you within twenty-four (24) business hours, cancel the respective order, and immediately refund any sums debited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              3. Pricing, Taxes & Import Duties
            </h2>
            <p>
              Prices displayed on the digital boutique are indicated in the currency corresponding to your selected geographical destination and include value-added tax (VAT) applicable in Italy or the destination territory, as well as all applicable customs clearance duties under our Delivery Duty Paid (DDP) service.
            </p>
            <p>
              VOYOR reserves the right to adjust prices at any time prior to order confirmation without prior notice. The price charged to your payment account will be the exact price confirmed in the formal Order Confirmation receipt transmitted to your registered email.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              4. Order Placement & Contract Conclusion
            </h2>
            <p>
              To place an order, you must select your desired creation, choose your appropriate color variant and Italian size, and complete our checkout verification. Prior to finalizing the purchase, you will be provided with an order summary highlighting total costs, item specifications, and delivery timelines.
            </p>
            <p>
              The purchase contract is concluded only when VOYOR sends an explicit Order Acceptance and Dispatch Confirmation notice containing your individual tracking number. VOYOR reserves the right to decline or cancel orders originating from users with whom an open dispute exists or in the event of suspected fraudulent or commercial resale activities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              5. Payment Methods & Security Standards
            </h2>
            <p>
              Payments may be made via Visa, MasterCard, American Express, Apple Pay, Google Pay, and verified high-value bank wire transfers coordinated with our Concierge. All digital transactions are processed through level 1 PCI-DSS compliant payment gateways utilizing 256-bit SSL encryption.
            </p>
            <p>
              Your card or account will be authorized upon checkout submission, with the final charge executed upon dispatch of the physical merchandise from our Milan distribution atelier.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              6. White-Glove Delivery & Risk of Loss
            </h2>
            <p>
              All purchases include complimentary global VIP delivery handled by insured logistics partners (DHL Express, FedEx Priority, or dedicated armored couriers for high jewelry). Deliveries require an adult signature upon receipt.
            </p>
            <p>
              Risk of loss, damage, or deterioration of the Products transfers to you at the physical moment of delivery to the destination address specified in your order.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              7. Right of Withdrawal & 30-Day Return Privilege
            </h2>
            <p>
              Pursuant to the European Consumer Rights Directive (Directive 2011/83/EU) and Article 52 of the Italian Consumer Code (Codice del Consumo), consumers are entitled to withdraw from the contract within fourteen (14) days. As a boutique privilege, VOYOR extends this withdrawal window to thirty (30) days from the date of physical receipt.
            </p>
            <p>
              To qualify for a full refund:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-neutral-400">
              <li>The Product must remain unworn, unwashed, unaltered, and undamaged.</li>
              <li>The original tamper-evident security seal, atelier tag, and embedded NFC passport must remain intact and affixed in their original position.</li>
              <li>The Product must be returned in its complete original packaging, including dust bags, cedar boxes, authenticity certificates, and hardware protectors.</li>
            </ul>
            <p>
              In accordance with Article 59 of the Italian Consumer Code, the right of withdrawal is expressly excluded for customized or made-to-measure creations, and unsealed perfumery extracts for hygiene and health protection reasons.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              8. Legal Conformity Warranty & Authenticity
            </h2>
            <p>
              Every Product is covered by the two-year statutory legal warranty of conformity provided under Articles 128 et seq. of the Italian Consumer Code. In the case of a verified conformity defect, you are entitled to free repair or replacement, or an appropriate reduction of the purchase price.
            </p>
            <p>
              Each VOYOR garment is accompanied by an encrypted digital authenticity certificate verifiable via smartphone NFC contact with the inner atelier label.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              9. Intellectual Property
            </h2>
            <p>
              All trademarks, trade names, sovereign crest logos, garment designs, photographic compositions, typography, and website content are the exclusive intellectual property of VOYOR S.r.l. Any reproduction, distribution, modification, or commercial exploitation without prior written consent is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-serif text-white uppercase tracking-wider">
              10. Applicable Law & Jurisdiction
            </h2>
            <p>
              These Terms and any non-contractual obligations arising from or related to them shall be governed by and construed in accordance with the laws of Italy, excluding its conflict of law principles. If you are a consumer residing in the European Union, you will also benefit from any mandatory provisions of the law of your country of residence.
            </p>
            <p>
              Any disputes shall be submitted to the exclusive jurisdiction of the Courts of Milan, Italy, without prejudice to the consumer&rsquo;s statutory right to bring legal action before the courts of their domicile. The European Commission provides an online dispute resolution platform accessible at https://ec.europa.eu/consumers/odr.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-neutral-800 text-xs text-neutral-400">
            <h2 className="text-sm font-serif text-white uppercase tracking-wider">
              11. Contact Information
            </h2>
            <p>
              For legal inquiries, contract clarification, or customer support:
            </p>
            <address className="not-italic space-y-1 text-neutral-300">
              <p>VOYOR S.r.l. — Legal Department</p>
              <p>Via Montenapoleone 8, 20121 Milano, Italy</p>
              <p>Email: legal@voyor.com • Telephone: +39 02 7600 1234</p>
            </address>
          </section>
        </article>
      </div>
    </main>
  );
}
