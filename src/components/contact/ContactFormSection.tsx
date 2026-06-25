// src/components/contact/ContactFormSection.tsx
// "Send Your Inquiry" — structured form matching the quick inquiry fields.
// Form state managed locally with useState.
//
// FUTURE: wire onSubmit to your Rails API:
//   POST /api/v1/inquiries
//   body: { name, contact, concern, dates, location, preferred_contact, message }

import React, { useState } from "react";
import GoldRule from "../ui/GoldRule";
import SectionEyebrow from "../ui/SectionEyebrow";
import CtaButton from "../ui/CtaButton";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormState {
  name: string;
  contact: string;
  preferred_contact: string;
  concern: string;
  dates: string;
  location: string;
  message: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  contact: "",
  preferred_contact: "",
  concern: "",
  dates: "",
  location: "",
  message: "",
};

// ── Reusable field wrapper ────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="font-sans text-xs font-medium uppercase tracking-widest text-[#5C5C5C]">
      {label}
    </label>
    {hint && (
      <p className="font-sans text-xs text-[#A8A8A8]">{hint}</p>
    )}
    {children}
  </div>
);

const inputClass =
  "font-sans text-sm text-[#1C1C1C] bg-white border border-[#E8D5A3] px-4 py-3 w-full " +
  "focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] " +
  "placeholder:text-[#C0BAB0] transition-colors duration-150";

// ── Section ───────────────────────────────────────────────────────────────────
const ContactFormSection: React.FC = () => {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: Event) => {
    // Prevent the browser from reloading the page
    if (e) e.preventDefault();

    console.log("Form submitted:", form);
    const formData = new URLSearchParams(Object.entries(form));

    try {
      const response = await fetch("https://law-office-backend-f5y1.onrender.com/api/v1/email_inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error("Server responded with an error status:", response.status);
        alert("Something went wrong on the server. Please try again.");
      }
    } catch (error) {
      console.error("Network error while connecting to Render:", error);
      alert("Could not reach the backend server. Is it awake?");
    }
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">

        {/* Left: intro copy */}
        <div className="md:sticky md:top-32">
          <SectionEyebrow>Send an Inquiry</SectionEyebrow>
          <h2
            className="text-3xl md:text-4xl text-[#1C1C1C] font-light leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Send Your Inquiry
          </h2>
          <GoldRule />
          <p className="font-sans text-base text-[#5C5C5C] leading-relaxed mb-6">
            We look forward to assisting you. Fill in the details below and the
            office will respond as soon as possible.
          </p>
          <p className="font-sans text-sm text-[#A8A8A8] leading-relaxed">
            For urgent matters or documents requiring immediate attention, please
            reach out directly through the contact channels above.
          </p>
        </div>

        {/* Right: form */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-[#E8D5A3] bg-[#F5F0E8]">
            <div className="w-12 h-12 rounded-full border border-[#C9A84C] flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3
              className="text-2xl text-[#1C1C1C] font-light mb-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Inquiry Sent
            </h3>
            <p className="font-sans text-sm text-[#5C5C5C]">
              Thank you. The office will be in touch shortly.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">

            {/* Name */}
            <Field label="Full Name">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClass}
              />
            </Field>

            {/* Contact */}
            <Field label="Contact Number or Email">
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Phone number or email address"
                className={inputClass}
              />
            </Field>

            {/* Preferred contact method */}
            <Field label="Preferred Contact Method">
              <select
                name="preferred_contact"
                value={form.preferred_contact}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="" disabled>Select a channel</option>
                <option value="messenger">Facebook Messenger</option>
                <option value="viber">Viber</option>
                <option value="instagram">Instagram</option>
                <option value="email">Email</option>
                <option value="phone">Phone Call</option>
              </select>
            </Field>

            {/* Legal concern */}
            <Field label="Your Concern" hint="Briefly describe the legal matter.">
              <input
                type="text"
                name="concern"
                value={form.concern}
                onChange={handleChange}
                placeholder="e.g. Property dispute, contract review, BP 22 case"
                className={inputClass}
              />
            </Field>

            {/* Relevant dates */}
            <Field label="Relevant Dates or Deadlines" hint="Optional — include if there are upcoming hearings or time-sensitive matters.">
              <input
                type="text"
                name="dates"
                value={form.dates}
                onChange={handleChange}
                placeholder="e.g. Hearing on July 15, deadline next week"
                className={inputClass}
              />
            </Field>

            {/* Location */}
            <Field label="Location" hint="Optional — relevant for property or court-related matters.">
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Mandaue City, Cebu"
                className={inputClass}
              />
            </Field>

            {/* Message */}
            <Field label="Additional Details" hint="Optional — anything else you'd like to share.">
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Any additional context or questions"
                rows={4}
                className={inputClass + " resize-none"}
              />
            </Field>

            <div className="pt-2">
              <CtaButton variant="primary" onClick={handleSubmit}>
                Send Inquiry
              </CtaButton>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default ContactFormSection;
