export const metadata = {
  title: "Privacy Policy | AutonomaX",
  description: "How AutonomaX collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-amber-300 mb-4">Legal</p>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-neutral-500 text-sm mb-10">Last updated: May 2026</p>

        <div className="space-y-8 text-neutral-300 leading-relaxed">

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Who We Are</h2>
            <p>
              AutonomaX is an AI-powered digital product business operating at aikagan.com.
              For privacy inquiries contact:{" "}
              <a href="mailto:support@aikagan.com" className="text-amber-300 underline">support@aikagan.com</a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-1 text-neutral-400">
              <li>Name and email address provided during checkout or contact form submission.</li>
              <li>Order and transaction data (order ID, product purchased, purchase date).</li>
              <li>Basic usage data collected automatically (page visits, referral source) via analytics tools.</li>
              <li>Communications you send us via email or contact form.</li>
            </ul>
            <p className="mt-3">
              Payment card details are handled entirely by Paddle (Merchant of Record) and are never stored by AutonomaX.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 text-neutral-400">
              <li>To fulfil and deliver your digital product purchase.</li>
              <li>To send order confirmation and download access emails.</li>
              <li>To provide customer support and process refund requests.</li>
              <li>To improve the website and product offerings based on aggregate usage data.</li>
              <li>To send product updates or relevant offers (you can unsubscribe at any time).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Data Sharing</h2>
            <p>
              We do not sell your personal data. We share information only with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 mt-2">
              <li>Paddle (payment processing, tax compliance, and digital delivery).</li>
              <li>Analytics providers (aggregate, anonymised traffic data only).</li>
              <li>Legal authorities if required by applicable law.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Cookies and Tracking</h2>
            <p>
              This site may use first-party analytics cookies to understand traffic patterns. No
              cross-site tracking cookies are set without your consent. Advertising pixels (e.g.
              Meta Pixel) may be activated when paid advertising campaigns are running; these will
              be disclosed on the cookie notice at that time.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Data Retention</h2>
            <p>
              Order data is retained for up to 3 years for tax and legal compliance. You may
              request deletion of your personal data (outside of legally required records) by
              emailing us.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Your Rights</h2>
            <p>
              Depending on your location you may have the right to access, correct, or delete
              personal data we hold about you. Contact{" "}
              <a href="mailto:support@aikagan.com" className="text-amber-300 underline">support@aikagan.com</a>{" "}
              to exercise these rights.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
            <p>
              <a href="mailto:support@aikagan.com" className="text-amber-300 underline">support@aikagan.com</a>
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
