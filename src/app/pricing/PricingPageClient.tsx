"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Printer, Search, X } from "lucide-react";

import { LastUpdated } from "@/components/LastUpdated";
import { PageHeader } from "@/components/PageHeader";
import { PriceTable, type PriceColumn } from "@/components/PriceTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  driverLicenseCharges,
  drivingTestCharges,
  licensePlateCharges,
  pricingTabs,
  vehicleImpoundmentCharges,
  vehicleInspectionCharges,
  vehicleRegistrationCharges,
  vehicleTowingCharges,
} from "@/data/pricing";
import { serviceCenters } from "@/data/service-centers";
import { SITE_URL } from "@/data/site-meta";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatUsd } from "@/lib/format";
import {
  enrichDriverLicenseRows,
  enrichDrivingTestRows,
  enrichImpoundmentRows,
  enrichInspectionRows,
  enrichRegistrationRows,
  enrichTowingRows,
} from "@/lib/pricing-search";

const registrationColumns: PriceColumn[] = [
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
    key: "basePrice",
    label: "Base Price",
    align: "right",
    render: (v) => formatUsd(v as number),
  },
  {
    key: "nfrCharges",
    label: "NFR Charges",
    align: "right",
    render: (v) => formatUsd(v as number | null),
  },
  {
    key: "additionalCharges",
    label: "Additional",
    render: (v) =>
      v ? (
        <span className="text-sm text-ltm-ink">{v as string}</span>
      ) : (
        <span className="text-ltm-slate">None</span>
      ),
  },
  {
    key: "totalCost",
    label: "Total",
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

const driverLicenseColumns: PriceColumn[] = [
  { key: "category", label: "Category" },
  { key: "description", label: "Description" },
  {
    key: "type",
    label: "Type",
    render: (v) =>
      v === "Private" ? (
        <Badge variant="success">Private</Badge>
      ) : (
        <Badge>Commercial</Badge>
      ),
  },
  {
    key: "charge",
    label: "Charge",
    align: "right",
    emphasis: true,
    render: (v) => formatUsd(v as number),
  },
];

const drivingTestColumns: PriceColumn[] = [
  { key: "category", label: "Service" },
  {
    key: "charge",
    label: "Charge",
    align: "right",
    emphasis: true,
    render: (v) => formatUsd(v as number),
  },
];

const inspectionColumns: PriceColumn[] = [
  { key: "category", label: "Vehicle Type" },
  {
    key: "charge",
    label: "Charge",
    align: "right",
    emphasis: true,
    render: (v) => formatUsd(v as number),
  },
];

const towingColumns: PriceColumn[] = [
  { key: "vehicleType", label: "Vehicle Type" },
  {
    key: "vehicleCategoryCodes",
    label: "Categories",
    render: (v) => (
      <div className="flex flex-wrap gap-1">
        {(v as string[]).map((code) => (
          <Badge key={code} variant="outline" className="text-xs">
            {code}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "upTo25MilesUsd",
    label: "Up to 25 miles",
    align: "right",
    emphasis: true,
    render: (v) => formatUsd(v as number),
  },
  {
    key: "additionalMileRateUsd",
    label: "Additional mile rate",
    align: "right",
    render: (v) => `${formatUsd(v as number)} / mi`,
  },
];

const impoundmentColumns: PriceColumn[] = [
  { key: "durationDays", label: "Duration" },
  {
    key: "ratePerDayUsd",
    label: "Rate per day",
    align: "right",
    emphasis: true,
    render: (v, row) => {
      if (v === 0) return <Badge variant="success">Free</Badge>;
      if (v === null || v === undefined)
        return (
          <span className="text-sm font-semibold text-ltm-slate">
            {(row.notes as string) ?? "Set by traffic law"}
          </span>
        );
      return formatUsd(v as number);
    },
  },
];

// Build the enriched rows once at module load. Each row gets a hidden
// `_search` field that includes everyday Liberian words (taxi, motorcycle,
// bike, pickup, SUV, bus, cargo, truck, trailer, …) on top of the official
// category text. The user can type any of those and find the right fee.
const REGISTRATION_ROWS = enrichRegistrationRows(vehicleRegistrationCharges);
const LICENSE_ROWS = enrichDriverLicenseRows(driverLicenseCharges);
const DRIVING_TEST_ROWS = enrichDrivingTestRows(drivingTestCharges);
const INSPECTION_ROWS = enrichInspectionRows(vehicleInspectionCharges);
const TOWING_ROWS = enrichTowingRows(vehicleTowingCharges);
const IMPOUNDMENT_ROWS = enrichImpoundmentRows(vehicleImpoundmentCharges);

type TabId = (typeof pricingTabs)[number]["id"];

function countMatches(rows: { _search: string }[], q: string): number {
  if (!q) return 0;
  return rows.filter((r) => r._search.includes(q)).length;
}

export function PricingPageClient() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [tab, setTab] = React.useState<TabId>("registration");

  const handlePrint = React.useCallback(() => {
    if (typeof window !== "undefined") window.print();
  }, []);

  const primaryPhone = serviceCenters[0]?.phones[0];

  // The input value stays instant; filtering and counts run off the debounced
  // value so we don't recompute every table on each keystroke.
  const debouncedQuery = useDebouncedValue(searchQuery, 150);

  // Per-tab match counts, used to power the cross-tab hint banner so users
  // never get a dead-end "no results" when the answer is one tab away.
  const q = debouncedQuery.trim().toLowerCase();
  const counts: Record<TabId, number> = {
    registration: countMatches(REGISTRATION_ROWS, q),
    license: countMatches(LICENSE_ROWS, q),
    "driving-test": countMatches(DRIVING_TEST_ROWS, q),
    inspection: countMatches(INSPECTION_ROWS, q),
    towing: countMatches(TOWING_ROWS, q),
    impoundment: countMatches(IMPOUNDMENT_ROWS, q),
    plates: 0,
  };

  const otherTabsWithHits = q
    ? pricingTabs.filter((t) => t.id !== tab && counts[t.id] > 0)
    : [];

  return (
    <>
      <PageHeader
        title="Pricing"
        actions={
          <Button
            variant="whitePrimary"
            size="lg"
            onClick={handlePrint}
            type="button"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print
          </Button>
        }
      />

      <section className="container-ltm py-8 md:py-16">
        {/* Search — plain language: taxi, motorcycle, pickup, bus, custom plate… */}
        <div className="mb-4 print:hidden">
          <label
            htmlFor="pricing-search"
            className="mb-2 block text-sm font-semibold text-ltm-ink"
          >
            Find a fee
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ltm-slate"
              aria-hidden="true"
            />
            <Input
              id="pricing-search"
              type="search"
              placeholder="Try: taxi, motorcycle, pickup, bus, custom plate…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-10 text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ltm-slate hover:bg-ltm-stone hover:text-ltm-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ltm-navy"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-ltm-slate">
            You can type everyday words (sedan, jeep, bike, keke, lorry) — you
            don&rsquo;t need the category code (A1, B2, C3).
          </p>
        </div>

        {/* Cross-tab hint: if the current tab has 0 hits but another tab does,
            offer a one-tap jump so the search never feels like a dead end. */}
        {q && counts[tab] === 0 && otherTabsWithHits.length > 0 && (
          <div className="mb-4 rounded-lg border border-ltm-charcoal bg-white p-4 print:hidden">
            <p className="text-sm font-semibold text-ltm-black">
              No matches on this tab. Try:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {otherTabsWithHits.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-ltm-border bg-ltm-stone px-3 py-1.5 text-sm font-semibold text-ltm-black hover:bg-ltm-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ltm-navy"
                >
                  {t.label}
                  <span className="rounded-full bg-ltm-black px-1.5 text-xs font-bold text-white">
                    {counts[t.id]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as TabId)}
          className="w-full"
        >
          <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1 bg-ltm-stone p-1 print:hidden">
            {pricingTabs.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="text-sm font-semibold"
              >
                {t.label}
                {q && counts[t.id] > 0 && (
                  <span className="ml-1.5 rounded-full bg-ltm-black px-1.5 text-[10px] font-bold text-white">
                    {counts[t.id]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="print:print-stack">
            <TabsContent value="registration" className="print:!block">
              <h2 className="mb-4 hidden text-xl font-semibold text-ltm-black print:block">
                Vehicle Registration
              </h2>
              <PriceTable
                columns={registrationColumns}
                rows={REGISTRATION_ROWS as unknown as Record<string, unknown>[]}
                searchQuery={debouncedQuery}
                searchKey="_search"
              />
            </TabsContent>

            <TabsContent value="license" className="print:!block">
              <h2 className="mb-4 hidden text-xl font-semibold text-ltm-black print:block">
                Driver License
              </h2>
              <PriceTable
                columns={driverLicenseColumns}
                rows={LICENSE_ROWS as unknown as Record<string, unknown>[]}
                searchQuery={debouncedQuery}
                searchKey="_search"
              />
            </TabsContent>

            <TabsContent value="driving-test" className="print:!block">
              <h2 className="mb-4 hidden text-xl font-semibold text-ltm-black print:block">
                Driving Test
              </h2>
              <PriceTable
                columns={drivingTestColumns}
                rows={DRIVING_TEST_ROWS as unknown as Record<string, unknown>[]}
                searchQuery={debouncedQuery}
                searchKey="_search"
              />
            </TabsContent>

            <TabsContent value="inspection" className="print:!block">
              <h2 className="mb-4 hidden text-xl font-semibold text-ltm-black print:block">
                Vehicle Inspection
              </h2>
              <PriceTable
                columns={inspectionColumns}
                rows={INSPECTION_ROWS as unknown as Record<string, unknown>[]}
                searchQuery={debouncedQuery}
                searchKey="_search"
              />
            </TabsContent>

            <TabsContent value="towing" className="print:!block">
              <h2 className="mb-4 hidden text-xl font-semibold text-ltm-black print:block">
                Towing
              </h2>
              <PriceTable
                columns={towingColumns}
                rows={TOWING_ROWS as unknown as Record<string, unknown>[]}
                searchQuery={debouncedQuery}
                searchKey="_search"
              />
            </TabsContent>

            <TabsContent value="impoundment" className="print:!block">
              <h2 className="mb-4 hidden text-xl font-semibold text-ltm-black print:block">
                Impoundment
              </h2>
              <PriceTable
                columns={impoundmentColumns}
                rows={IMPOUNDMENT_ROWS as unknown as Record<string, unknown>[]}
                searchQuery={debouncedQuery}
                searchKey="_search"
              />
            </TabsContent>

            <TabsContent value="plates" className="print:!block">
              <h2 className="mb-4 hidden text-xl font-semibold text-ltm-black print:block">
                License Plates
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Plate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold tabular-nums text-ltm-black">
                      {formatUsd(licensePlateCharges.testPlate)}
                    </p>
                    <p className="mt-2 text-sm font-medium text-ltm-slate">
                      Flat rate per test plate.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Customized Plate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold tabular-nums text-ltm-black">
                      {formatUsd(licensePlateCharges.customizedPlatePerCharacter)}
                      <span className="ml-2 text-base font-semibold text-ltm-slate">
                        per character
                      </span>
                    </p>
                    <p className="mt-2 text-sm font-medium text-ltm-slate">
                      Choose your own letter/number combination.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <p className="mt-10 text-sm font-medium leading-relaxed text-ltm-slate">
          Fees are set by the Government of Liberia. LTM cannot discount or
          waive them.
        </p>

        <p className="mt-3 hidden text-xs text-ltm-slate print:block">
          Printed from {SITE_URL.replace(/^https?:\/\//, "")}. For the most
          current pricing, visit the website.
        </p>

        {/* Questions? — Call LTM strip, mobile-prominent */}
        {primaryPhone && (
          <div className="mt-8 flex flex-col gap-3 rounded-lg border border-ltm-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <div>
              <p className="text-base font-semibold text-ltm-black">
                Questions about a fee?
              </p>
              <p className="text-sm text-ltm-slate">
                Call LTM and ask for the registration or licensing counter.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={`tel:${primaryPhone.dial}`}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {primaryPhone.display}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="/contact">
                  Find a location
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        <LastUpdated section="pricing" />
      </section>
    </>
  );
}
