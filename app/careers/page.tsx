import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { employers } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Jobs — The Pass",
  description: "Open roles at restaurants and bakeries that run on The Pass.",
};

export default function Careers() {
  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-3" style={{ color: "var(--ink)" }}>
          Jobs
        </h1>
        <p className="mb-10" style={{ color: "var(--ink-muted)" }}>
          Open roles at restaurants and bakeries that run on The Pass.
        </p>
        <div className="space-y-4">
          {employers.flatMap((e) =>
            e.postings.map((p) => (
              <Link
                key={`${e.slug}-${p.id}`}
                href={`/careers/${e.slug}#${p.id}`}
                className="block rounded-lg border border-[var(--border)] p-6 hover:border-[var(--accent-pink)] transition-colors"
                style={{ background: "var(--bg-elevated)" }}
              >
                <h2 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>{p.title}</h2>
                <p className="text-sm mt-1 font-sans-ui" style={{ color: "var(--ink-muted)" }}>
                  {[e.name, p.employmentType, p.location, p.pay].filter(Boolean).join(" · ")}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </PageShell>
  );
}
