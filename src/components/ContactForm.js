"use client";

import { useState } from "react";

const initialForm = { name: "", email: "", mobile: "", category: "GENERAL", message: "" };
const categories = ["TECHNICAL", "BILLING", "ACCOUNT", "PRODUCT", "GENERAL", "OTHER"];

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ message: "", error: false });
  const [loading, setLoading] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ message: "", error: false });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to send your message.");
      setForm(initialForm);
      setStatus({ message: result.message, error: false });
    } catch (error) {
      setStatus({ message: error.message || "Unable to send your message. Please try again.", error: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="contact-copy">
        <p className="eyebrow">Contact us</p>
        <h2>Tell us what you need.</h2>
        <p>Share a little about your project or support request. Our team will get back to you.</p>
      </div>
      <form className="contact-form" onSubmit={submit}>
        <div className="contact-fields">
          <div className="field"><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={120} value={form.name} onChange={update} /></div>
          <div className="field"><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={update} /></div>
          <div className="field"><label htmlFor="contact-mobile">Phone <span>(optional)</span></label><input id="contact-mobile" name="mobile" type="tel" autoComplete="tel" maxLength={32} value={form.mobile} onChange={update} /></div>
          <div className="field"><label htmlFor="contact-category">Category</label><select id="contact-category" name="category" value={form.category} onChange={update}>{categories.map((category) => <option key={category} value={category}>{category.replaceAll("_", " ").toLowerCase().replace(/^./, (letter) => letter.toUpperCase())}</option>)}</select></div>
          <div className="field contact-message"><label htmlFor="contact-message">How can we help?</label><textarea id="contact-message" name="message" required maxLength={5000} value={form.message} onChange={update} placeholder="Tell us about your project or request." /></div>
        </div>
        <div className="contact-submit">
          {status.message && <p className={`contact-status${status.error ? " error" : ""}`} role="status">{status.message}</p>}
          <button className="button" disabled={loading}>{loading ? "Sending…" : "Send message"}</button>
        </div>
      </form>
    </section>
  );
}
