"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

import { SITE_URL as BASE_URL } from "@/data/site-meta";

// Human labels for each path segment. Keep in sync with the routes under
// src/app/. Anything missing falls back to a title-cased version of the slug.
const SEGMENT_LABELS: Record<string, string> = {
  services: "Services",
  "driver-license": "Driver License",
  "vehicle-registration": "Vehicle Registration",
  "vehicle-inspection": "Vehicle Inspection",
  "license-plates": "License Plates",
  pricing: "Pricing",
  "road-signs": "Road Signs",
  "practice-test": "Practice Test",
  study: "Study Mode",
  faq: "Questions & Answers",
  contact: "Find a Service Center",
};

function labelFor(segment: string): string {
  return (
    SEGMENT_LABELS[segment] ??
    segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export function BreadcrumbJsonLd() {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);

  // Build a Home → … → current trail.
  const items: { name: string; url: string }[] = [
    { name: "Home", url: BASE_URL },
  ];
  let acc = "";
  for (const seg of segments) {
    acc += `/${seg}`;
    items.push({ name: labelFor(seg), url: `${BASE_URL}${acc}` });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="ltm-breadcrumb-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      // The key forces a re-render of the JSON when the route changes.
      key={pathname}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
