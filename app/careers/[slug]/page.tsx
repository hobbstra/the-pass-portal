import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { employers, fetchOpenJobs, getEmployer } from "@/lib/jobs";
import ApplyForm from "./ApplyForm";

export const dynamicParams = false;

export function generateStaticParams() {
  return employers.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const employer = getEmployer((await params).slug);
  return employer ? { title: `Jobs at ${employer.name}`, description: employer.tagline } : {};
}

export default async function EmployerJobs({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ job?: string }>;
}) {
  const employer = getEmployer((await params).slug);
  if (!employer) notFound();
  const wanted = (await searchParams).job;
  const open = (await fetchOpenJobs(employer.slug)) ?? [];
  const jobFor = (title: string) => open.find((j) => j.title.toLowerCase() === title.toLowerCase());
  const closed = !!wanted && !open.some((j) => j.token === wanted);
  const smsNotice = employer.smsNumber && (
    <p className="text-sm mt-2 font-sans-ui" style={{ color: "var(--ink-muted)" }}>
      {`Include your mobile number to hear back by text. By giving it, you agree to receive texts from ${employer.name} at ${employer.smsNumber} about your application. `}
      Message frequency varies. Msg &amp; data rates may apply. Reply
      HELP for help, STOP to opt out. See our{" "}
      <Link href={`/careers/${employer.slug}/sms-terms`} className="underline">Text Messaging Terms</Link>
      {" and "}
      <Link href="/privacy#applicant-texts" className="underline">Privacy Policy</Link>.
    </p>
  );

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

              {jobFor(job.title) ? (
                <a
                  href={`?job=${jobFor(job.title)!.token}#apply`}
                  className="inline-block rounded-full px-5 py-2 font-sans-ui font-semibold text-sm"
                  style={{ background: "var(--accent-gradient)", color: "var(--bg)" }}
                >
                  Apply
                </a>
              ) : (
                <>
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
                  {smsNotice}
                </>
              )}
              <p className="text-sm mt-2 font-sans-ui" style={{ color: "var(--ink-muted)" }}>
                Get to know {employer.name}:{" "}
                <a href={employer.website} target="_blank" rel="noopener noreferrer" className="underline">Website</a>
                {" · "}
                <a href={employer.instagram} target="_blank" rel="noopener noreferrer" className="underline">Instagram</a>
              </p>
            </section>
          ))}
        </div>

        {open.length > 0 && (
          <>
            <ApplyForm
              slug={employer.slug}
              jobs={open}
              selected={wanted ?? ""}
              notice={closed ? "That job isn't open any more." : undefined}
            />
            {/* Registered notice stays until the campaign amendment is approved. */}
            {smsNotice}
          </>
        )}
      </div>
    </PageShell>
  );
}
