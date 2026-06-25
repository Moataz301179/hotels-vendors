export const metadata = {
  title: "Privacy Policy | Hotels Vendors",
  description: "Privacy policy for Hotels Vendors — how we collect, use, and protect your data in compliance with Egyptian Data Protection Law 151/2020.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-white/80 py-24 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-medium text-white">Privacy Policy</h1>
        <p className="text-sm text-white/40">Last updated: June 14, 2026</p>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">1. Introduction</h2>
          <p>
            Hotels Vendors ("we", "us", "our") operates the hotelsvendors.com platform. We are a technology
            orchestration layer for the Egyptian hospitality industry. We do not hold customer funds, process
            payments directly, or act as a financial intermediary.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
            you use our platform, in compliance with Egyptian Data Protection Law No. 151 of 2020 (PDPE).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">2. Information We Collect</h2>
          <h3 className="text-lg font-medium text-white/90">2.1 Information You Provide</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account registration data: name, email, phone, company name, role</li>
            <li>Supplier onboarding data: tax ID, commercial registration, bank account details</li>
            <li>Hotel profile data: property details, delivery addresses</li>
            <li>Transaction data: orders, invoices, payment references</li>
            <li>Communications: messages sent through the platform</li>
          </ul>
          <h3 className="text-lg font-medium text-white/90">2.2 Information Collected Automatically</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Usage data: pages visited, features used, time spent</li>
            <li>Device data: browser type, operating system, IP address</li>
            <li>Cookies and similar tracking technologies as described in our Cookie Policy</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide, operate, and maintain our platform</li>
            <li>To process and fulfill orders, invoices, and procurement workflows</li>
            <li>To comply with Egyptian Tax Authority (ETA) e-invoicing requirements</li>
            <li>To facilitate payments through our licensed third-party partners (Paymob, Oliv Finance)</li>
            <li>To communicate with you about your account and platform updates</li>
            <li>To detect, prevent, and address fraud, security, or technical issues</li>
            <li>To comply with legal obligations under Egyptian law</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">4. Data Sharing & Disclosure</h2>
          <p>We do not sell your personal data. We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Licensed payment partners:</strong> Paymob, Oliv Finance, and factoring companies, only as necessary to process transactions</li>
            <li><strong>Egyptian Tax Authority (ETA):</strong> As required by Law 67/2018 for e-invoicing compliance</li>
            <li><strong>Service providers:</strong> Hosting, monitoring, and analytics providers who are contractually bound to protect your data</li>
            <li><strong>Legal authorities:</strong> When required by Egyptian law or regulatory request from FRA, CBE, or other competent authorities</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data,
            including encryption at rest and in transit, access controls, regular security audits, and
            employee training on data protection.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">6. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active or as needed to provide services,
            comply with legal obligations (including ETA record-keeping requirements), resolve disputes,
            and enforce our agreements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">7. Your Rights</h2>
          <p>Under Egyptian Data Protection Law 151/2020, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data held by us</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (subject to legal retention requirements)</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with the Data Protection Authority</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">8. Data Localization</h2>
          <p>
            Your data is stored on servers located within the Arab Republic of Egypt, in compliance with
            Egyptian data localization requirements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium text-white">9. Contact</h2>
          <p>
            For questions about this Privacy Policy or to exercise your data protection rights, contact our
            Data Protection Officer at:
          </p>
          <p className="text-white/60">
            Email: privacy@hotelsvendors.com<br />
            Address: Cairo, Egypt
          </p>
        </section>
      </div>
    </main>
  );
}
