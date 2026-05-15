interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = false }: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
        <span className="text-[#f59e0b]">/</span> {title}
      </h2>
      {subtitle && <p className="text-[#6b7280] text-lg max-w-2xl">{subtitle}</p>}
    </div>
  );
}
