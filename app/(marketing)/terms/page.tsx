export const metadata = {
  title: "Terms of Service | Hotels Vendors",
  description: "Terms of Service for Hotels Vendors — the legal agreement governing use of the Hotels Vendors B2B marketplace platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white/80 py-24 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-medium text-white">Terms of Service</h1>
        <p className="text-sm text-white/40">Last updated: June 14, 2026</p>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Hotels Vendors platform ("the Platform"), you agree to be bound by
            these Terms of Service. If you do not agree, you may not use the Platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">2. Platform Role & Disclaimers</h2>
          <p>
            Hotels Vendors is a technology orchestration layer for the Egyptian hospitality industry.
            We connect hotels, suppliers, logistics providers, and licensed financial partners.
          </p>
          <p className="font-medium text-white/90">
            Hotels Vendors is NOT a financial institution, bank, or lending entity. We do not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Hold, custody, or manage customer funds</li>
            <li>Provide factoring, lending, or insurance services directly</li>
            <li>Set interest rates or underwrite credit risk</li>
            <li>Process payments directly (all payments are processed by licensed third-party partners)</li>
          </ul>
          <p>
            All financial services on the Platform are provided by licensed third-party partners including
            Paymob (payment processing), Oliv Finance (factoring), and other FRA-licensed financial institutions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">3. User Accounts & Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide accurate, complete information when creating an account</li>
            <li>You are responsible for maintaining the confidentiality of your credentials</li>
            <li>You are responsible for all activities under your account</li>
            <li>You must notify us immediately of any unauthorized access or security breach</li>
            <li>You may not use the Platform for any illegal or unauthorized purpose</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">4. ETA Compliance</h2>
          <p>
            All invoices generated through the Platform are submitted to the Egyptian Tax Authority (ETA)
            in compliance with Law 67/2018 and its executive regulations. Users are responsible for the
            accuracy of their invoice data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by Egyptian law, Hotels Vendors shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages arising from your use of
            the Platform. Our total liability shall not exceed the fees paid by you in the 12 months
            preceding the claim.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">6. Dispute Resolution</h2>
          <p>
            Any disputes arising from these Terms shall be governed by Egyptian law. The parties shall
            first attempt to resolve disputes through amicable negotiation. If unresolved, disputes shall
            be submitted to the competent courts of Cairo, Egypt.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Material changes will be communicated
            to users via email or platform notification. Continued use after changes constitutes acceptance
            of the modified Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">8. Contact</h2>
          <p className="text-white/60">
            Email: legal@hotelsvendors.com<br />
            Address: Cairo, Egypt
          </p>
        </section>
      </div>
    </main>
  );
}
