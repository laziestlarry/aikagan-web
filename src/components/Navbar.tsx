"use client";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Mission Control", href: "/mission-control" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-[#f59e0b] tracking-widest">AIKAGAN</Link>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-gray-300 hover:text-white text-sm transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="bg-[#f59e0b] text-black text-sm font-semibold px-4 py-2 rounded hover:bg-amber-400 transition-colors">
            Start Project
          </Link>
        </div>
        <button className="md:hidden text-gray-300" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#0a0a0f] border-b border-[#1e1e2e] px-4 pb-4">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2 text-gray-300 hover:text-white text-sm" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="mt-2 block bg-[#f59e0b] text-black text-sm font-semibold px-4 py-2 rounded text-center hover:bg-amber-400 transition-colors" onClick={() => setOpen(false)}>
            Start Project
          </Link>
        </div>
      )}
    </nav>
  );
}
