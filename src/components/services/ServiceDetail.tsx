// src/components/services/ServiceDetail.tsx
// Reusable expanded section for a single practice area.
// Alternates layout direction (image left vs right) based on the `reverse` prop.
// Used by ServicesListSection to render all 7 services.

import React from "react";
import GoldRule from "../ui/GoldRule";
import SectionEyebrow from "../ui/SectionEyebrow";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import CtaButton from "../ui/CtaButton";

interface ServiceDetailData {
  /** HTML id for anchor navigation */
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Bullet points expanding on the service — keep to 3–5 */
  points: string[];
  /** Background variant — alternates between cream and white */
  bg: "cream" | "white";
  /** Flip image to the left side */
  reverse?: boolean;
  /** Placeholder label for the image slot */
  imagePlaceholderLabel: string;
  imagePlaceholderNote: string;
}

const ServiceDetail: React.FC<ServiceDetailData> = ({
  id,
  eyebrow,
  title,
  description,
  points,
  bg,
  reverse = false,
  imagePlaceholderLabel,
  imagePlaceholderNote,
}) => {
  const bgClass = bg === "cream" ? "bg-[#F5F0E8]" : "bg-white";

  return (
    <section id={id} className={`${bgClass} py-16 md:py-24 scroll-mt-32`}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* ── Text block ── */}
        <div className={reverse ? "order-1 md:order-2" : "order-1"}>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2
            className="text-3xl md:text-4xl text-[#1C1C1C] font-light leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {title}
          </h2>
          <GoldRule />

          <p className="font-sans text-base text-[#5C5C5C] leading-relaxed mb-6">
            {description}
          </p>

          {/* Bullet points */}
          <ul className="flex flex-col gap-3 mb-8">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <svg
                  className="flex-shrink-0 w-4 h-4 text-[#C9A84C] mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-sans text-sm text-[#5C5C5C] leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <CtaButton href="#contact" variant="outline">
            Discuss This Matter
          </CtaButton>
        </div>

        {/* ── Image block ── */}
        {/* SWAP: replace ImagePlaceholder with:
            <img
              src="/images/[service-slug].jpg"
              alt={title}
              className="w-full h-full object-cover"
            />
        */}
        <div className={reverse ? "order-2 md:order-1" : "order-2"}>
          <ImagePlaceholder
            label={imagePlaceholderLabel}
            aspectClass="aspect-[4/3]"
            note={imagePlaceholderNote}
          />
        </div>

      </div>
    </section>
  );
};

export type { ServiceDetailData };
export default ServiceDetail;
