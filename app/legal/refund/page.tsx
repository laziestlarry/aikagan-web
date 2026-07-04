export const metadata = {
  title: "Refund Policy | AutonomaX",
  description: "AutonomaX 30-day digital product refund policy.",
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-amber-300 mb-4">Legal</p>
        <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
        <p className="text-neutral-500 text-sm mb-10">Last updated: May 2026</p>

        <div className="space-y-8 text-neutral-300 leading-relaxed">

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">30-Day Satisfaction Window</h2>
            <p>
              If you are not satisfied with your purchase, email us at{" "}
              <a href="mailto:support@aikagan.com" className="text-amber-300 underline">support@aikagan.com</a>{" "}
              within 30 days of your original purchase date. We will review your request and process
              eligible refunds within 5 business days.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Eligibility</h2>
            <p className="mb-3">Refunds are available when:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400">
              <li>You cannot access or download the purchased pack after checkout.</li>
              <li>The delivered files materially do not match the product description.</li>
              <li>A technical error prevented delivery and support could not resolve it.</li>
            </ul>
            <p className="mt-3">
              Because these are digital products delivered immediately upon purchase, refunds are
              not available solely on the basis of change of mind after files have been downloaded and
              accessed.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">How to Request a Refund</h2>
            <p>
              Email <a href="mailto:support@aikagan.com" className="text-amber-300 underline">support@aikagan.com</a>{" "}
              with the subject line <strong className="text-white">Refund Request — [Order ID]</strong> and include
              your order confirmation number, the product you purchased, and a brief description of your
              concern. We respond within 2 business days.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Payment Processor</h2>
            <p>
              Payments are processed by Paddle (Merchant of Record). Refunds are issued to your original payment
              method. Processing time may vary depending on your bank or card issuer (typically
              3–10 business days after approval).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">No Income Guarantee</h2>
            <p>
              AutonomaX products are business execution tools. Purchase does not guarantee any specific
              financial outcome, revenue level, or business result. Results depend entirely on your
              individual effort, market conditions, and implementation.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
            <p>
              Questions about this policy?{" "}
              <a href="mailto:support@aikagan.com" className="text-amber-300 underline">support@aikagan.com</a>
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
