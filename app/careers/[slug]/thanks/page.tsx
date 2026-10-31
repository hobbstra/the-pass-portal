import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { employers, getEmployer } from "@/lib/jobs";
import Thanks from "./Thanks";

export const dynamicParams = false;
export const metadata: Metadata = { title: "Application sent", robots: { index: false } };

export function generateStaticParams() {
  return employers.map((e) => ({ slug: e.slug }));
}

export default async function ThanksPage({ params }: { params: Promise<{ slug: string }> }) {
  const employer = getEmployer((await params).slug);
  if (!employer) notFound();
  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Thanks />
      </div>
    </PageShell>
  );
}
