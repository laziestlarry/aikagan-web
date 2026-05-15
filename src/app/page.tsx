import ServiceCard from "@/components/ServiceCard";
import CTAButton from "@/components/CTAButton";
import SectionHeader from "@/components/SectionHeader";

const trustItems = [
  { label: "End-to-End Delivery", desc: "From intake to handoff, fully managed." },
  { label: "Production-Grade Systems", desc: "Built to run, not just to demo." },
  { label: "AI-Native Architecture", desc: "Automation and intelligence at the core." },
  { label: "Proven Frameworks", desc: "Repeatable systems that scale." },
];

const services = [
  { icon: "⚙️", title: "AI Automation", description: "Trigger-based systems, LLM integrations, and workflow automation that run without human intervention." },
  { icon: "🛒", title: "E-Commerce Conversion", description: "Funnel optimization, cart systems, and payment integrations engineered for maximum revenue." },
  { icon: "🚀", title: "Deployment & Infrastructure", description: "Cloud deployment, CI/CD pipelines, and containerized systems for reliable production environments." },
  { icon: "📦", title: "Golden Delivery", description: "Productized delivery with SLA backing, full documentation, and repeatable handoff processes." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f] to-[#050508]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#f59e0b] text-sm uppercase tracking-widest mb-4 font-semibold">The Kaganate Operating System</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            AI-Powered Infrastructure<br />
            <span className="text-[#f59e0b]">for Modern Commerce</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            AIKAGAN builds the systems that scale. From automation pipelines to conversion engines — we deliver intelligent infrastructure for the modern web.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <CTAButton href="/contact" variant="primary">Start Project</CTAButton>
            <CTAButton href="/products" variant="outline">View Offers</CTAButton>
            <CTAButton href="/contact" variant="secondary">Request Audit</CTAButton>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 px-4 border-y border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[#6b7280] text-sm uppercase tracking-widest mb-8">Trusted systems. Real delivery.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-white font-semibold mb-1">{item.label}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Services & Capabilities" subtitle="Intelligent systems built for production." centered />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <ServiceCard key={s.title} icon={s.icon} title={s.title} description={s.description} />
            ))}
          </div>
          <div className="text-center mt-8">
            <CTAButton href="/services" variant="outline">View All Services</CTAButton>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-[#12121a] border-y border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to build your next system?</h2>
          <p className="text-gray-400 mb-8">Tell us what you need. We&apos;ll deliver the infrastructure.</p>
          <CTAButton href="/contact" variant="primary">Start Project</CTAButton>
        </div>
      </section>
    </>
  );
}
