"use client";

import * as React from "react";
import Link from "next/link";
import { MessagesSquare, Search } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { CTABanner } from "@/components/layout/CTABanner";
import { LastUpdated } from "@/components/LastUpdated";
import { PageHeader } from "@/components/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { faqCategories, faqs, type FAQ } from "@/data/faqs";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { highlightMatch } from "@/lib/format";

function HighlightedText({ text, query }: { text: string; query: string }) {
  const parts = highlightMatch(text, query);
  return (
    <>
      {parts.map((part, i) => (part.match ? <mark key={i} className="rounded-sm bg-yellow-200 px-0.5 text-ltm-black">{part.text}</mark> : <React.Fragment key={i}>{part.text}</React.Fragment>))}
    </>
  );
}

function FAQList({
  items,
  query,
  value,
  onValueChange,
}: {
  items: FAQ[];
  query: string;
  value?: string;
  onValueChange?: (v: string) => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="No questions match your search"
        description={
          <>
            Try a different word, or{" "}
            <Link
              href="/contact"
              className="font-medium text-ltm-black hover:underline"
            >
              contact us directly
            </Link>{" "}
            and we&rsquo;ll help.
          </>
        }
      />
    );
  }
  return (
    <Accordion
      type="single"
      collapsible
      value={value}
      onValueChange={onValueChange}
      className="rounded-lg border border-ltm-border bg-white px-4 sm:px-6"
    >
      {items.map((faq) => (
        <AccordionItem key={faq.id} id={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left">
            <HighlightedText text={faq.question} query={query} />
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-base leading-relaxed text-ltm-ink sm:text-[17px]">
              {faq.answer}
            </p>
            {faq.bullets && faq.bullets.length > 0 && (
              <ul className="mt-3 list-inside list-disc space-y-1 text-base text-ltm-ink sm:text-[17px]">
                {faq.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function FAQPageClient() {
  const [query, setQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [openItem, setOpenItem] = React.useState<string | undefined>(undefined);

  const debouncedQuery = useDebouncedValue(query, 150);
  const filtered = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.bullets ?? []).join(" ").toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  const byCategory = React.useCallback(
    (cat: string) => filtered.filter((f) => f.category === cat),
    [filtered]
  );

  // Deep-link support: /faq#<id> from the site search. Switch to the FAQ's
  // category tab, open its accordion item, then scroll it into view.
  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const target = faqs.find((f) => f.id === hash);
    if (!target) return;
    // The hash only exists in the browser (pages are prerendered), so it has
    // to be read after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab(target.category);
    setOpenItem(target.id);
    const timer = window.setTimeout(() => {
      document
        .getElementById(target.id)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <PageHeader
        title="Questions & Answers"
        subtitle="Find answers to common questions about our services."
      />

      <section className="container-ltm py-10">
        <blockquote className="mb-8 max-w-2xl border-l-4 border-ltm-red pl-4 font-display text-base italic text-ltm-black">
          &ldquo;The Love of Liberty Brought Us Here&rdquo;
          <footer className="mt-1 text-xs not-italic text-ltm-muted">
            National motto of the Republic of Liberia, 1847.
          </footer>
        </blockquote>

        <div className="mb-6">
          <label htmlFor="faq-search" className="sr-only">
            Search questions
          </label>
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ltm-muted"
              aria-hidden="true"
            />
            <Input
              id="faq-search"
              type="search"
              placeholder="Search questions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1 bg-ltm-stone p-1">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All
            </TabsTrigger>
            {faqCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="text-xs sm:text-sm"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <FAQList
              items={filtered}
              query={query}
              value={openItem}
              onValueChange={setOpenItem}
            />
          </TabsContent>
          {faqCategories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id}>
              <FAQList
                items={byCategory(cat.id)}
                query={query}
                value={openItem}
                onValueChange={setOpenItem}
              />
            </TabsContent>
          ))}
        </Tabs>

        <LastUpdated section="faq" />
      </section>

      <CTABanner />
    </>
  );
}
