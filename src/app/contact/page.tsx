import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ArrowRight, Mail, MessageSquare, Clock, Building2 } from 'lucide-react';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description:
    'Start a project, request an audit, or inquire about AI automation services. Structured intake — response within 48 hours.',
  path: '/contact/',
});

const CONTACT_OPTIONS = [
  {
    icon: MessageSquare,
    title: 'Project Request',
    description: 'Submit a structured project brief. We respond with a scoping document within 48 hours.',
    action: 'Start Project',
    href: '#intake-form',
  },
  {
    icon: Building2,
    title: 'Enterprise Inquiry',
    description: 'For organizations evaluating AI infrastructure at scale. Architecture review and roadmap.',
    action: 'Enterprise Inquiry',
    href: '#intake-form',
  },
  {
    icon: Clock,
    title: 'Quick Audit',
    description: 'Need a focused technical review of your current stack? Structured audit with recommendations.',
    action: 'Request Audit',
    href: '#intake-form',
  },
];

export default function ContactPage() {
  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Start a <span className="text-gradient">Project</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Structured intake. No endless discovery calls. Tell us what you need — we respond with a plan.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          {CONTACT_OPTIONS.map((opt) => (
            <Card key={opt.title} hover className="text-center">
              <div className="p-3 rounded-lg bg-kagan-gold/10 border border-kagan-gold/20 inline-block mb-4">
                <opt.icon className="h-6 w-6 text-kagan-gold" />
              </div>
              <h3 className="text-lg font-bold text-kagan-white mb-2">{opt.title}</h3>
              <p className="text-sm text-kagan-light leading-relaxed mb-4">{opt.description}</p>
              <a
                href={opt.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-kagan-gold hover:text-kagan-gold-light transition-colors"
              >
                {opt.action}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Card>
          ))}
        </div>

        {/* Intake Form */}
        <div className="max-w-2xl mx-auto" id="intake-form">
          <Card className="border-kagan-gold/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-kagan-gold/10">
                <Mail className="h-5 w-5 text-kagan-gold" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-kagan-white">Project Intake</h2>
                <p className="text-sm text-kagan-light">All fields required unless marked optional.</p>
              </div>
            </div>

            <form
              action="https://formspree.io/f/your-form-id"
              method="POST"
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-kagan-white mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-kagan-border bg-kagan-dark px-4 py-2.5 text-kagan-white text-sm placeholder:text-kagan-muted focus:outline-none focus:ring-2 focus:ring-kagan-gold/50 focus:border-kagan-gold/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-kagan-white mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-kagan-border bg-kagan-dark px-4 py-2.5 text-kagan-white text-sm placeholder:text-kagan-muted focus:outline-none focus:ring-2 focus:ring-kagan-gold/50 focus:border-kagan-gold/50 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-kagan-white mb-1.5">
                  Company / Project <span className="text-kagan-muted font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full rounded-lg border border-kagan-border bg-kagan-dark px-4 py-2.5 text-kagan-white text-sm placeholder:text-kagan-muted focus:outline-none focus:ring-2 focus:ring-kagan-gold/50 focus:border-kagan-gold/50 transition-colors"
                  placeholder="Company or project name"
                />
              </div>

              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-kagan-white mb-1.5">
                  What Are You Looking For?
                </label>
                <select
                  id="interest"
                  name="interest"
                  required
                  className="w-full rounded-lg border border-kagan-border bg-kagan-dark px-4 py-2.5 text-kagan-white text-sm focus:outline-none focus:ring-2 focus:ring-kagan-gold/50 focus:border-kagan-gold/50 transition-colors appearance-none"
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 fill=%27%23c9923a%27 viewBox=%270 0 16 16%27%3E%3Cpath d=%27M8 11L3 6h10l-5 5z%27/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option value="" disabled selected>
                    Select an option…
                  </option>
                  <option value="ai-automation">AI Automation (AutonomaX)</option>
                  <option value="ecommerce-conversion">E-Commerce Conversion (ProPulse)</option>
                  <option value="golden-delivery">Golden Delivery (Done-For-You)</option>
                  <option value="advisory">Strategic Advisory</option>
                  <option value="product-purchase">Product Purchase</option>
                  <option value="other">Other / Multiple</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-kagan-white mb-1.5">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-lg border border-kagan-border bg-kagan-dark px-4 py-2.5 text-kagan-white text-sm placeholder:text-kagan-muted focus:outline-none focus:ring-2 focus:ring-kagan-gold/50 focus:border-kagan-gold/50 transition-colors resize-y"
                  placeholder="Describe what you're building, your current stack, timeline, budget range, and what success looks like…"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-kagan-gold px-6 py-3 text-base font-semibold text-black hover:bg-kagan-gold-light transition-colors focus:outline-none focus:ring-2 focus:ring-kagan-gold/50 focus:ring-offset-2 focus:ring-offset-kagan-black"
              >
                Submit Project Request
              </button>

              <p className="text-xs text-kagan-muted text-center mt-4">
                We respond within 48 hours. No spam, no auto-responder sequences, no fluff.
              </p>
            </form>
          </Card>
        </div>
      </Section>

      <Section variant="alt">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-kagan-white mb-6">
            Not Ready to Submit? Start Here.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products/"
              className="inline-flex items-center gap-2 rounded-lg border border-kagan-gold/60 px-6 py-3 text-kagan-gold hover:bg-kagan-gold/10 transition-colors font-medium"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/services/"
              className="inline-flex items-center gap-2 rounded-lg border border-kagan-gold/60 px-6 py-3 text-kagan-gold hover:bg-kagan-gold/10 transition-colors font-medium"
            >
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/mission-control/"
              className="inline-flex items-center gap-2 rounded-lg border border-kagan-gold/60 px-6 py-3 text-kagan-gold hover:bg-kagan-gold/10 transition-colors font-medium"
            >
              View Process
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
