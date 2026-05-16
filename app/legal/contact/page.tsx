export const metadata = {
  title: "Contact | AIKAGAN"
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold">Contact AIKAGAN</h1>
        <p className="mt-6 text-neutral-300">
          For product delivery, download access, support, or business inquiries,
          contact:
        </p>
        <a
          href="mailto:lazylarries@gmail.com"
          className="mt-6 inline-block text-amber-300"
        >
          lazylarries@gmail.com
        </a>
      </section>
    </main>
  );
}
