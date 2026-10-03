import Script from "next/script";

import { faqs } from "@/data/faqs";
import { SITE_URL } from "@/data/site-meta";

import { FAQPageClient } from "./FaqPageClient";

export const metadata = {
  title: "Questions & Answers",
  description:
    "Common questions about LTM services, hours, requirements, and pricing.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: `${SITE_URL}/faq`,
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.bullets?.length
        ? `${f.answer} ${f.bullets.join(" ")}`
        : f.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <Script
        id="ltm-faq-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FAQPageClient />
    </>
  );
}
