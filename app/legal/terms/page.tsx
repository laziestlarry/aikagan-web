export const metadata = {
  title: "Terms of Service | AutonomaX",
  description: "Terms governing the purchase and use of AutonomaX digital products.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-amber-300 mb-4">Legal</p>
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-neutral-500 text-sm mb-10">Last updated: May 2026</p>

        <div className="space-y-8 text-neutral-300 leading-relaxed">

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">1. Products and Delivery</h2>
            <p>
              AutonomaX sells digital business execution packs delivered as downloadable ZIP files.
              Upon successful checkout via Paddle, you will receive an email confirmation
              and download link. Delivery is instant and automated. If you do not receive your
              download within 30 minutes of purchase, contact{" "}
              <a href="mailto:hello@aikagan.com" className="text-amber-300 underline">hello@aikagan.com</a>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">2. License and Usage Rights</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mt-2">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-6 text-white font-semibold">Pack</th>
                    <th className="text-left py-2 pr-6 text-white font-semibold">Personal Use</th>
                    <th className="text-left py-2 pr-6 text-white font-semibold">Client Projects</th>
                    <th className="text-left py-2 text-white font-semibold">Resell / White-Label</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-400">
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-6 text-amber-300 font-medium">Starter</td>
                    <td className="py-2 pr-6">✓ Yes</td>
                    <td className="py-2 pr-6">✓ Yes</td>
                    <td className="py-2">✗ No</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-6 text-amber-300 font-medium">Pro</td>
                    <td className="py-2 pr-6">✓ Yes</td>
                    <td className="py-2 pr-6">✓ Yes</td>
                    <td className="py-2">✗ No</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6 text-amber-300 font-medium">Commander</td>
                    <td className="py-2 pr-6">✓ Yes</td>
                    <td className="py-2 pr-6">✓ Yes</td>
                    <td className="py-2 text-green-400">✓ Yes (white-label)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-neutral-500">
              White-label rights (Commander Pack only) permit you to rebrand and resell the system
              as your own product. You may not redistribute unmodified files from Starter or Pro packs.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">3. No Income Guarantee</h2>
            <p>
              AutonomaX products are execution toolkits — templates, scripts, checklists, and
              frameworks. Purchase does not guarantee any specific financial result, revenue level,
              or business outcome. Results are determined entirely by your individual effort, market
              conditions, business decisions, and implementation quality. Any income figures
              mentioned are illustrative targets, not promises or guarantees.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">4. Acceptable Use</h2>
            <ul className="list-disc list-inside space-y-1 text-neutral-400">
              <li>You must use the materials in compliance with applicable laws in your jurisdiction.</li>
              <li>You are responsible for your own tax obligations on any income generated.</li>
              <li>You may not share, upload, or distribute downloaded files to third parties (except under Commander white-label rights).</li>
              <li>You may not claim authorship of the original AutonomaX brand or system architecture.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">5. Payment and VAT</h2>
            <p>
 Payments are processed by Paddle. Prices displayed are in USD. Applicable taxes
are determined by your country of residence. You are responsible for any additional
              local taxes applicable to digital product purchases in your jurisdiction.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">6. Support</h2>
            <p>
              Customer support is available at{" "}
              <a href="mailto:hello@aikagan.com" className="text-amber-300 underline">hello@aikagan.com</a>.
              We aim to respond within 2 business days. Support covers delivery issues, file access,
              and general product guidance. It does not include personal business coaching or custom
              implementation work (see Services for that).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>
              AutonomaX&apos;s liability is limited to the purchase price of the product. We are not
              liable for indirect, incidental, or consequential damages arising from use or
              inability to use the materials.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">8. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the site after
              changes constitutes acceptance of the revised terms. The effective date at the
              top of this page will reflect the most recent update.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
            <p>
              <a href="mailto:hello@aikagan.com" className="text-amber-300 underline">hello@aikagan.com</a>
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
