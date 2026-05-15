"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full bg-[#12121a] border border-[#1e1e2e] text-white rounded px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b] transition-colors";
  const labelClass = "block text-gray-400 text-sm mb-1.5";

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#f59e0b] text-sm uppercase tracking-widest mb-3">Begin Here</p>
          <h1 className="text-4xl font-extrabold text-white mb-3">Start Your Project</h1>
          <p className="text-gray-400">Tell us what you need. We will scope it and deliver it.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">What happens next?</h2>
            <div className="space-y-6">
              {[
                { step: "01", label: "We review your request", desc: "Within 24 hours, our team reviews your submission and assesses fit." },
                { step: "02", label: "We schedule a discovery call", desc: "We book a short call to understand your needs, timeline, and goals." },
                { step: "03", label: "We deliver a project scope", desc: "You receive a detailed scope document with timeline, deliverables, and pricing." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="text-[#f59e0b] font-mono font-bold text-sm w-6 shrink-0 mt-0.5">{item.step}</div>
                  <div>
                    <div className="text-white font-semibold text-sm">{item.label}</div>
                    <div className="text-gray-500 text-sm mt-1">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div className="bg-[#12121a] border border-green-500/30 rounded-lg p-8 text-center">
                <div className="text-green-400 text-3xl mb-4">✓</div>
                <h3 className="text-white font-bold text-xl mb-2">Request Received</h3>
                <p className="text-gray-400">We&apos;ll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>Name</label>
                  <input name="name" type="text" required value={form.name} onChange={handleChange} className={inputClass} placeholder="Your name" />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="you@company.com" />
                </div>
                <div>
                  <label className={labelClass}>Company</label>
                  <input name="company" type="text" value={form.company} onChange={handleChange} className={inputClass} placeholder="Company name" />
                </div>
                <div>
                  <label className={labelClass}>Project Type</label>
                  <select name="projectType" required value={form.projectType} onChange={handleChange} className={inputClass}>
                    <option value="">Select a project type</option>
                    <option>AI Automation</option>
                    <option>E-Commerce Conversion</option>
                    <option>Infrastructure Deployment</option>
                    <option>Golden Delivery</option>
                    <option>General Consultation</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Budget Range</label>
                  <select name="budget" required value={form.budget} onChange={handleChange} className={inputClass}>
                    <option value="">Select a budget range</option>
                    <option>Under $5k</option>
                    <option>$5k–$15k</option>
                    <option>$15k–$50k</option>
                    <option>$50k+</option>
                    <option>Let&apos;s discuss</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Message</label>
                  <textarea name="message" required rows={4} value={form.message} onChange={handleChange} className={inputClass} placeholder="Describe your project..." />
                </div>
                <button type="submit" className="w-full bg-[#f59e0b] text-black font-bold py-3 rounded hover:bg-amber-400 transition-colors">
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
