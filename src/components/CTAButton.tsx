import Link from "next/link";
import type { ReactNode } from "react";

interface CTAButtonProps {
  variant?: "primary" | "secondary" | "outline";
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export default function CTAButton({ variant = "primary", href, onClick, children, className = "" }: CTAButtonProps) {
  const base = "inline-flex items-center justify-center px-6 py-3 rounded font-semibold text-sm transition-all duration-200 cursor-pointer";
  const variants = {
    primary: "bg-[#f59e0b] text-black hover:bg-amber-400",
    secondary: "bg-[#3b82f6] text-white hover:bg-blue-400",
    outline: "border border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return <Link href={href} className={cls}>{children}</Link>;
  }
  return (
    <button onClick={onClick} className={cls}>{children}</button>
  );
}
