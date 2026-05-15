import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-kagan-black via-kagan-darker to-kagan-black pt-20 pb-28 md:pt-28 md:pb-36">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,146,58,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,146,58,0.3) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-kagan-gold/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge row */}
        <div className="flex justify-center mb-8">
          <Badge variant="gold" className="text-sm px-4 py-1.5">
            AutonomaX · ProPulse · Golden Delivery
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-kagan-white leading-[1.05] mb-6">
          The Operating System
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-kagan-gold via-kagan-gold-light to-kagan-amber">
            for AI Commerce
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-kagan-light leading-relaxed mb-10">
          Premium AI infrastructure, e-commerce conversion engineering, and done-for-you operations.
          Built for serious operators who ship — not for tourists.
        </p>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/contact/" variant="primary" size="lg">
            Start Project
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button href="/products/" variant="outline" size="lg">
            View Offers
          </Button>
          <Button href="/services/#golden-delivery" variant="ghost" size="lg">
            Request Audit
          </Button>
        </div>

        {/* Trust micro-signals */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2 text-sm text-kagan-muted">
            <Shield className="h-4 w-4 text-kagan-gold/60" />
            SLA-Backed Delivery
          </div>
          <div className="flex items-center gap-2 text-sm text-kagan-muted">
            <Zap className="h-4 w-4 text-kagan-gold/60" />
            Production-Grade AI
          </div>
          <div className="flex items-center gap-2 text-sm text-kagan-muted">
            <TrendingUp className="h-4 w-4 text-kagan-gold/60" />
            Real Conversion Engineering
          </div>
        </div>
      </div>
    </section>
  );
}
