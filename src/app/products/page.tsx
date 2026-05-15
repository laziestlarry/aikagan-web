import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import ProductCard from "@/components/ProductCard";
import CTAButton from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "Products — AIKAGAN",
  description: "Productized packages and enterprise solutions from AIKAGAN.",
};

const products = [
  {
    name: "Starter Automation Pack",
    price: "$997",
    description: "Entry-level automation toolkit. Downloadable templates and pre-built workflows to get your first automation running.",
    features: ["Pre-built workflow templates", "API integration blueprints", "Documentation and setup guides", "Community support access"],
    ctaText: "Get Started",
    href: "/contact",
    featured: false,
  },
  {
    name: "E-Commerce Conversion Kit",
    price: "$1,497",
    description: "Conversion-focused system templates for e-commerce operations. Downloadable and configurable.",
    features: ["Funnel architecture templates", "Cart optimization scripts", "Payment flow blueprints", "A/B testing frameworks"],
    ctaText: "Get Started",
    href: "/contact",
    featured: false,
  },
  {
    name: "AutonomaX Integration Bundle",
    price: "$2,997",
    description: "Full autonomous system integration with consulting and hands-on setup included.",
    features: ["Custom automation pipeline build", "LLM integration setup", "2-week implementation sprint", "Handoff documentation"],
    ctaText: "Get Started",
    href: "/contact",
    featured: false,
  },
  {
    name: "Mission Control Setup",
    price: "$4,997",
    description: "Complete pipeline dashboard implementation — from intake to delivery, fully operational.",
    features: ["Full pipeline architecture", "Dashboard implementation", "Monitoring and alerting setup", "Operations runbook", "30-day support window"],
    ctaText: "Build My Mission Control",
    href: "/contact",
    featured: true,
  },
  {
    name: "Golden Delivery Onboarding",
    price: "$7,497",
    description: "Full service onboarding and delivery activation. Everything live, documented, and running.",
    features: ["End-to-end service setup", "All integrations configured", "Team onboarding session", "SLA-backed delivery", "60-day support window"],
    ctaText: "Get Started",
    href: "/contact",
    featured: false,
  },
  {
    name: "Enterprise Partnership",
    price: "Custom",
    description: "Strategic consulting and full integration for enterprise-scale operations.",
    features: ["Dedicated engineering team", "Custom system architecture", "Ongoing retainer options", "Executive-level reporting", "Priority support"],
    ctaText: "Contact Us",
    href: "/contact",
    featured: false,
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Products & Packages"
          subtitle="Productized systems with clear scope, clear pricing, and clear delivery."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {products.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">Not sure which package fits your needs?</p>
          <CTAButton href="/contact" variant="secondary">Schedule a Discovery Call</CTAButton>
        </div>
      </div>
    </div>
  );
}
