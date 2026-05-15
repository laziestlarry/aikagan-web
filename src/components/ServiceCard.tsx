import type { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features?: string[];
}

export default function ServiceCard({ icon, title, description, features }: ServiceCardProps) {
  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6 hover:border-[#f59e0b]/50 transition-all duration-200 hover:shadow-lg hover:shadow-[#f59e0b]/5">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      {features && features.length > 0 && (
        <ul className="space-y-1">
          {features.map((f) => (
            <li key={f} className="text-gray-500 text-xs flex items-center gap-2">
              <span className="text-[#f59e0b]">▸</span> {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
