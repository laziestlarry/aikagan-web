import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Learn what information AIKAGAN and AutonomaX collect, how it is used and protected, which providers receive it, and how to exercise your rights.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-amber-300 mb-4">Legal</p>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-neutral-500 text-sm mb-10">Last updated: September 2026</p>
        <div className="space-y-8 text-neutral-300 leading-relaxed">
          <div><h2 className="text-lg font-semibold text-white mb-3">Who We Are</h2><p>AutonomaX is an AI-powered digital product and implementation business operating at aikagan.com. For privacy inquiries contact: <a href="mailto:hello@aikagan.com" className="text-amber-300 underline">hello@aikagan.com</a></p></div>
          <div><h2 className="text-lg font-semibold text-white mb-3">Information We Collect</h2><ul className="list-disc list-inside space-y-1 text-neutral-400"><li>Name and email address provided during checkout or contact form submission.</li><li>Order and transaction data such as order ID, purchased product, provider and purchase date.</li><li>Basic usage and attribution data such as page visits and referral source.</li><li>Communications you send us via email, forms, feedback or support.</li></ul><p className="mt-3">Payment card details are handled by the checkout provider presented at purchase and are not stored by AIKAGAN or AutonomaX.</p></div>
          <div><h2 className="text-lg font-semibold text-white mb-3">How We Use Your Information</h2><ul className="list-disc list-inside space-y-1 text-neutral-400"><li>To verify, fulfil and deliver your digital product purchase.</li><li>To provide order confirmation, access and customer support.</li><li>To process refund requests and prevent duplicate or fraudulent fulfillment.</li><li>To improve the website, tools and product offerings using aggregate usage evidence.</li><li>To respond to requests you initiate. We do not require marketing-list enrollment to use the site.</li></ul></div>
          <div><h2 className="text-lg font-semibold text-white mb-3">Data Sharing</h2><p>We do not sell your personal data. Information is shared only as required to operate the service, including:</p><ul className="list-disc list-inside space-y-1 text-neutral-400 mt-2"><li>Gumroad for currently mapped hosted self-serve purchases and its payment/tax/transaction services.</li><li>Other checkout providers such as Paddle, Shopier or Lemon Squeezy only when that provider is explicitly presented and used for your transaction.</li><li>Hosting, analytics, fulfillment or support providers necessary to operate the requested service.</li><li>Legal authorities when required by applicable law.</li></ul></div>
          <div><h2 className="text-lg font-semibold text-white mb-3">Cookies and Tracking</h2><p>This site may use first-party analytics and attribution technologies to understand traffic and commercial journeys. Advertising or conversion measurement may be used when an applicable campaign is active, subject to required notices and consent.</p></div>
          <div><h2 className="text-lg font-semibold text-white mb-3">Data Retention</h2><p>Order data may be retained as required for tax, accounting, fraud prevention and legal compliance. You may request deletion of other personal data when no legal retention requirement applies.</p></div>
          <div><h2 className="text-lg font-semibold text-white mb-3">Your Rights</h2><p>Depending on your location you may have the right to access, correct, object to processing of, or request deletion of personal data we hold about you. Contact <a href="mailto:hello@aikagan.com" className="text-amber-300 underline">hello@aikagan.com</a> to exercise applicable rights.</p></div>
          <div><h2 className="text-lg font-semibold text-white mb-3">Contact</h2><p><a href="mailto:hello@aikagan.com" className="text-amber-300 underline">hello@aikagan.com</a></p></div>
        </div>
      </section>
    </main>
  );
}
