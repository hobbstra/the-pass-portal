import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import { fetchOpenJobs, getEmployer } from "@/lib/jobs";
import ApplyForm from "../ApplyForm";

// One job: what it is, the full description folded away, then the form (owner, 2026-11-01: "Why is the
// new design one long page?"). This is where Indeed links land; applicants have read the job there already.
export async function generateMetadata({ params }: { params: Promise<{ slug: string; job: string }> }): Promise<Metadata> {
  const { slug, job } = await params;
  const employer = getEmployer(slug);
  const j = (await fetchOpenJobs(slug))?.jobs.find((x) => x.token === job);
  return employer && j ? { title: `${j.title} at ${employer.name}`, description: employer.tagline } : {};
}

export default async function JobPage({ params }: { params: Promise<{ slug: string; job: string }> }) {
  const { slug, job: token } = await params;
  const employer = getEmployer(slug);
  if (!employer) notFound();
  const fetched = await fetchOpenJobs(employer.slug);
  const open = fetched?.jobs ?? [];
  const job = open.find((j) => j.token === token);
  // Closed, renamed away, or the jobs couldn't be read: the list says which, and offers the rest.
  if (!job) redirect(`/careers/${employer.slug}?job=${encodeURIComponent(token)}`);
  const desc = employer.postings.find((p) => p.title.toLowerCase() === job.title.toLowerCase());

  return (
    <PageShell employer={employer}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {open.length > 1 && (
          <Link href={`/careers/${employer.slug}`} className="inline-flex items-center min-h-11 text-sm font-semibold mb-1" style={{ color: "var(--ink-muted)" }}>
            &larr; All jobs
          </Link>
        )}
        <h1 className="text-3xl font-semibold mb-2" style={{ color: "var(--ink)" }}>{job.title}</h1>
        {desc && (
          <>
            <p className="text-sm mb-4" style={{ color: "var(--ink-muted)" }}>
              <span className="inline-block rounded-full px-2.5 py-0.5 mr-2 text-xs font-semibold" style={{ background: "var(--tint)", color: "var(--pass-violet)" }}>{desc.employmentType}</span>
              {desc.location}
              {desc.pay && <span className="block mt-1">{desc.pay}</span>}
            </p>
            <p className="leading-relaxed mb-3">{desc.summary}</p>
            <details className="job-details mb-2">
              <summary className="inline-flex items-center min-h-11 font-semibold cursor-pointer" style={{ color: "var(--pass-violet)" }}>See the full job</summary>
              <div className="pt-2">
                <h2 className="font-semibold mb-2">What you&rsquo;ll do</h2>
                <ul className="list-disc pl-5 space-y-1 mb-4" style={{ color: "var(--ink-muted)" }}>
                  {desc.duties.map((d) => <li key={d}>{d}</li>)}
                </ul>
                <h2 className="font-semibold mb-2">What we&rsquo;re looking for</h2>
                <ul className="list-disc pl-5 space-y-1" style={{ color: "var(--ink-muted)" }}>
                  {desc.requirements.map((r) => <li key={r}>{r}</li>)}
                </ul>
              </div>
            </details>
          </>
        )}
        <ApplyForm slug={employer.slug} jobs={open} selected={job.token} orgName={employer.name} fixed />
      </div>
    </PageShell>
  );
}
