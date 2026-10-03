import type { MetadataRoute } from "next";

import { lastUpdated, SITE_URL, type LastUpdatedKey } from "@/data/site-meta";

// Required for `output: "export"`: emit sitemap.xml once at build time.
export const dynamic = "force-static";

// Each route maps to the lastUpdated entry that covers its content. Routes
// without a specific entry use the most recent date across all entries.
const routes: { path: string; updated?: LastUpdatedKey }[] = [
  { path: "" },
  { path: "/services", updated: "services" },
  { path: "/services/driver-license", updated: "services" },
  { path: "/services/vehicle-registration", updated: "services" },
  { path: "/services/vehicle-inspection", updated: "services" },
  { path: "/services/license-plates", updated: "services" },
  { path: "/pricing", updated: "pricing" },
  { path: "/road-signs", updated: "roadSigns" },
  { path: "/practice-test", updated: "roadSigns" },
  { path: "/practice-test/study", updated: "roadSigns" },
  { path: "/faq", updated: "faq" },
  { path: "/contact" },
];

const latest = Object.values(lastUpdated).sort().at(-1)!;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, updated }) => ({
    url: `${SITE_URL}${path}`,
    // Date part only (YYYY-MM-DD) so the output doesn't depend on the build
    // machine's time zone.
    lastModified: (updated ? lastUpdated[updated] : latest).slice(0, 10),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));
}
