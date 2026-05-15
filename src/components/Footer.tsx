import Link from "next/link";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Mission Control", href: "/mission-control" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "AI Automation", href: "/services" },
      { label: "E-Commerce", href: "/services" },
      { label: "Infrastructure", href: "/services" },
      { label: "Golden Delivery", href: "/services" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Starter Pack", href: "/products" },
      { label: "Conversion Kit", href: "/products" },
      { label: "Enterprise", href: "/products" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Start a Project", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#050508] border-t border-[#1e1e2e] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[#f59e0b] font-semibold text-sm mb-3 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-gray-400 text-sm hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#1e1e2e] pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <span className="text-[#f59e0b] font-bold tracking-widest text-sm">AIKAGAN</span>
          <span className="text-gray-500 text-xs">© 2024 AIKAGAN. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
