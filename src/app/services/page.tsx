import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import CTAButton from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "Services — AIKAGAN",
  description: "AI automation, e-commerce conversion, infrastructure deployment, and golden delivery services from AIKAGAN.",
};

const services = [
  {
    icon: "⚙️",
    title: "AI Automation & Orchestration",
    description: "End-to-end automation systems that operate without human intervention. We design, build, and deploy trigger-based pipelines, LLM integrations, and multi-step workflow orchestration.",
    features: [
      "Trigger-based automation pipelines",
      "LLM integration and prompt engineering",
      "Multi-step workflow orchestration",
      "API-to-API automation bridges",
      "Scheduled and event-driven execution",
    ],
  },
  {
    icon: "🛒",
    title: "E-Commerce Conversion Systems",
    description: "Revenue-focused systems built around conversion science. From funnel architecture to checkout optimization — every component is engineered to move buyers through faster.",
    features: [
      "Conversion funnel architecture",
      "Cart and checkout optimization",
      "Payment gateway integration",
      "Upsell and cross-sell systems",
      "Abandoned cart recovery flows",
    ],
  },
  {
    icon: "🚀",
    title: "Deployment & Infrastructure",
    description: "Production-ready cloud infrastructure with automated deployment pipelines. We build for reliability, performance, and scale.",
    features: [
      "Cloud deployment (AWS, GCP, Vercel, Railway)",
      "CI/CD pipeline configuration",
      "Docker and container orchestration",
      "Environment management and secrets handling",
      "Performance monitoring and alerting",
    ],
  },
  {
    icon: "📦",
    title: "Golden Delivery Network",
    description: "Productized delivery with documented handoffs and SLA commitments. Every project ends with a complete, transferable system.",
    features: [
      "SLA-backed delivery commitments",
      "Full system documentation",
      "Runbook and operations guides",
      "Handoff calls and walkthroughs",
      "Post-delivery support windows",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Services & Capabilities"
          subtitle="Every engagement is a system. Designed, built, and delivered."
          centered
        />
        <div className="space-y-12 mt-12">
          {services.map((s, i) => (
            <div key={s.title} className={`flex flex-col md:flex-row gap-8 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
              <div className="flex-1 bg-[#12121a] border border-[#1e1e2e] rounded-lg p-8">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-3">{s.title}</h2>
                <p className="text-gray-400 mb-5">{s.description}</p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-[#f59e0b] mt-0.5">▸</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to get started?</h3>
          <CTAButton href="/contact" variant="primary">Start a Project</CTAButton>
        </div>
      </div>
    </div>
  );
}
