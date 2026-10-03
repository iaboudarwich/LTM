import Script from "next/script";

import { ServiceDetailLayout } from "@/components/ServiceDetailLayout";
import { Badge } from "@/components/ui/badge";
import { type PriceColumn } from "@/components/PriceTable";
import { faqs } from "@/data/faqs";
import { servicePhotos } from "@/data/photos";
import {
  formatLastUpdated,
  lastUpdated,
  serviceEstimates,
  SITE_URL,
} from "@/data/site-meta";
import { vehicleRegistrationCharges } from "@/data/pricing";
import { formatUsd } from "@/lib/format";

export const metadata = {
  title: "Vehicle Registration",
  description:
    "Register a new vehicle, renew your registration, or transfer ownership at LTM, the official registrar in Liberia.",
};

const columns: PriceColumn[] = [
  { key: "code", label: "Code" },
  { key: "category", label: "Category" },
  { key: "weightClass", label: "Weight Class" },
  {
    key: "publicTransport",
    label: "Public Transport",
    render: (v) =>
      v ? (
        <Badge variant="success">Yes</Badge>
      ) : (
        <span className="text-ltm-slate">No</span>
      ),
  },
  {
    key: "totalCost",
    label: "Total Cost",
    align: "right",
    emphasis: true,
    render: (v, row) =>
      v === null || v === undefined ? (
        <span className="text-sm font-semibold text-ltm-slate">
          {(row.notes as string) ?? "Set by traffic law"}
        </span>
      ) : (
        formatUsd(v as number)
      ),
  },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  url: `${SITE_URL}/services/vehicle-registration`,
  name: "Vehicle Registration",
  serviceType: "Vehicle registration",
  provider: {
    "@type": "GovernmentOrganization",
    name: "Liberia Traffic Management",
    url: SITE_URL,
  },
  areaServed: "Liberia",
  description:
    "Register a new vehicle, renew registration, or transfer ownership with LTM, the official vehicle registrar in Liberia.",
};

export default function VehicleRegistrationPage() {
  return (
    <>
    <Script
      id="ltm-vehicle-registration-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
    />
    <ServiceDetailLayout
      title="Vehicle Registration"
      subtitle="Register, renew, or transfer ownership of your vehicle."
      overview="All vehicles in Liberia must be registered with LTM. Inspection is required first. Insurance is mandatory by law but can be purchased after registration."
      whatToBring={[
        "Valid ID",
        "Personal information",
        "Previous vehicle registration documents",
        "Customs clearance documents (for newly imported vehicles)",
        "Bill of sale and second-party ID & contact details (for ownership transfers)",
      ]}
      pricing={{
        columns,
        rows: vehicleRegistrationCharges as unknown as Record<
          string,
          unknown
        >[],
        note: "Heavy duty trucks above 8 tons and trailers have variable pricing. See the full pricing page for details.",
      }}
      process={[
        {
          title: "Pass your vehicle inspection",
          body: "Inspection is mandatory before we can register your vehicle. The inspector checks lights, brakes, and windshield wipers.",
        },
        {
          title: "Visit an LTM service center",
          body: "Bring the vehicle and your documents.",
        },
        {
          title: "Submit your documents",
          body: "Hand them to the registration counter. We'll verify and enter them into your file.",
          items: [
            "Valid ID",
            "Previous registration (for renewals)",
            "Customs clearance (for imported vehicles)",
            "Bill of sale and second-party ID (for ownership transfers)",
          ],
        },
        {
          title: "Pay the registration fee",
          body: "Fees are set by vehicle category; see the pricing section above. Public transport rates apply for licensed taxis and buses.",
        },
        {
          title: "Receive your registration and plates",
          body: "Most registrations are issued same-day. You'll leave with the paperwork and standard plates.",
        },
        {
          title: "Get insurance",
          body: "Vehicle insurance is mandatory by law. You can buy it from any provider; we have insurers on the premises for your convenience.",
        },
      ]}
      faqs={faqs.filter((f) => f.category === "vehicle-registration")}
      headerImage={servicePhotos["vehicle-registration"]}
      estimatedTime={serviceEstimates["vehicle-registration"]}
      summary={{
        cost: "US$78 to US$509",
        visit: "30 to 45 minutes",
        documents: 5,
        lastReviewed: formatLastUpdated(lastUpdated.services),
      }}
      source={
        <>
          Vehicle categories and fees are set by the Government of Liberia.
          Insurance is mandatory by law.
        </>
      }
    />
    </>
  );
}
