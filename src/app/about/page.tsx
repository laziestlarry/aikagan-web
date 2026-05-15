import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import CTAButton from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "About — AIKAGAN",
  description: "AIKAGAN — an operating web settlement built on intelligent systems.",
};

const sections = [
  {
    label: "What is AIKAGAN?",
    content: "AI + Kagan fused. AIKAGAN is the operating intelligence layer for modern web commerce. It is not an agency. It is not a tool. It is an operating system for building, running, and scaling web-based commerce infrastructure.",
  },
  {
    label: "The Kaganate",
    content: "A distributed settlement. Infrastructure, products, and services unified under one operating system for the web. The Kaganate is the domain — the territory within which all AIKAGAN operations run.",
  },
  {
    label: "Lazy Larry",
    content: "The automation philosophy. If a human has to do it twice, a machine should do it always. Lazy Larry is the operating principle — not laziness, but efficiency taken to its logical conclusion.",
  },
  {
    label: "AutonomaX",
    content: "The autonomous execution engine. Self-orchestrating systems for maximum throughput with minimum overhead. AutonomaX handles the execution layer — trigger, process, deliver, repeat.",
  },
  {
    label: "ProPulse",
    content: "The growth and conversion acceleration system. Built for scale, optimized for revenue. ProPulse takes qualified traffic and converts it into customers through engineered conversion systems.",
  },
  {
    label: "Golden Delivery",
    content: "The last-mile productized delivery network. SLA-backed, documented, repeatable. Golden Delivery ensures that every project ends with a complete, transferable system that clients can operate independently.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-[#f59e0b] text-sm uppercase tracking-widest mb-3">The Kaganate</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">The Kaganate</h1>
          <p className="text-gray-400 text-xl">An operating web settlement built on intelligent systems</p>
        </div>

        <SectionHeader title="The Operating System" subtitle="Every layer of AIKAGAN is intentional." />

        <div className="space-y-8 mt-8">
          {sections.map((s) => (
            <div key={s.label} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
              <h3 className="text-[#f59e0b] font-bold text-sm uppercase tracking-wider mb-2">{s.label}</h3>
              <p className="text-gray-300">{s.content}</p>
            </div>
          ))}
        </div>

        {/* Mission statement */}
        <div className="mt-16 text-center bg-[#12121a] border border-[#f59e0b]/20 rounded-xl p-10">
          <p className="text-[#6b7280] text-sm uppercase tracking-widest mb-3">Mission</p>
          <blockquote className="text-2xl md:text-3xl font-bold text-white leading-snug">
            &ldquo;AIKAGAN exists to build the infrastructure layer between ideas and outcomes.&rdquo;
          </blockquote>
        </div>

        <div className="text-center mt-12">
          <CTAButton href="/contact" variant="primary">Work With Us</CTAButton>
        </div>
      </div>
    </div>
  );
}
