import CTAButton from "./CTAButton";

interface ProductCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  href: string;
  featured?: boolean;
}

export default function ProductCard({ name, price, description, features, ctaText, href, featured }: ProductCardProps) {
  return (
    <div className={`bg-[#12121a] border rounded-lg p-6 flex flex-col ${featured ? "border-[#f59e0b] shadow-lg shadow-[#f59e0b]/10" : "border-[#1e1e2e]"}`}>
      {featured && (
        <span className="inline-block bg-[#f59e0b] text-black text-xs font-bold px-3 py-1 rounded mb-4 self-start uppercase tracking-wider">Featured</span>
      )}
      <h3 className="text-white font-bold text-lg mb-1">{name}</h3>
      <div className="text-[#f59e0b] text-2xl font-bold mb-3">{price}</div>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <ul className="space-y-2 mb-6 flex-1">
        {features.map((f) => (
          <li key={f} className="text-gray-300 text-sm flex items-start gap-2">
            <span className="text-[#f59e0b] mt-0.5">✓</span> {f}
          </li>
        ))}
      </ul>
      <CTAButton href={href} variant={featured ? "primary" : "outline"} className="w-full justify-center">
        {ctaText}
      </CTAButton>
    </div>
  );
}
