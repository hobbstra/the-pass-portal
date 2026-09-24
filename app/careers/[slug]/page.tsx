import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { employers, getEmployer } from "@/lib/jobs";

export const dynamicParams = false;

export function generateStaticParams() {
  return employers.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const employer = getEmployer((await params).slug);
  return employer ? { title: `Jobs at ${employer.name}`, description: employer.tagline } : {};
}

export default async function EmployerJobs({ params }: { params: Promise<{ slug: string }> }) {
  const employer = getEmployer((await params).slug);
  if (!employer) notFound();

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm mb-2 font-sans-ui" style={{ color: "var(--accent-cyan)" }}>
          Now hiring
        </p>
        <h1 className="text-3xl font-semibold mb-3" style={{ color: "var(--ink)" }}>
          Jobs at {employer.name}
        </h1>
        <p className="mb-10 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
          {employer.tagline}
        </p>

        <div className="space-y-6">
          {employer.postings.map((job) => (
            <section
              key={job.id}
              id={job.id}
              className="rounded-lg border p-6 scroll-mt-24"
              style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
            >
              <h2 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>
                {job.title}
              </h2>
              <p className="text-sm mt-1 mb-4 font-sans-ui" style={{ color: "var(--ink-muted)" }}>
                {[job.employmentType, job.location, job.pay].filter(Boolean).join(" · ")}
              </p>
              <p className="leading-relaxed mb-4">{job.summary}</p>

              <h3 className="font-semibold mb-2">What you&rsquo;ll do</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4" style={{ color: "var(--ink-muted)" }}>
                {job.duties.map((d) => <li key={d}>{d}</li>)}
              </ul>

              <h3 className="font-semibold mb-2">What we&rsquo;re looking for</h3>
              <ul className="list-disc pl-5 space-y-1 mb-6" style={{ color: "var(--ink-muted)" }}>
                {job.requirements.map((r) => <li key={r}>{r}</li>)}
              </ul>

              <a
                href={`mailto:${employer.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                className="inline-block rounded-full px-5 py-2 font-sans-ui font-semibold text-sm"
                style={{ background: "var(--accent-gradient)", color: "var(--bg)" }}
              >
                Apply by email
              </a>
              <p className="text-sm mt-3 font-sans-ui" style={{ color: "var(--ink-muted)" }}>
                Send a few lines about yourself and your availability to{" "}
                <span style={{ color: "var(--ink)" }}>{employer.applyEmail}</span>.
              </p>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
