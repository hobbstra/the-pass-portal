import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { employers, fetchOpenJobs, getEmployer, type JobPosting } from "@/lib/jobs";
import { brandOf } from "@/lib/brand";
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
  const fetched = await fetchOpenJobs(employer.slug);
  const open = fetched ?? [];
  const reachable = fetched !== null;
  const brand = brandOf(open[0]?.brand_color);
  const closed = !!wanted && !open.some((j) => j.token === wanted);
  const describe = (title: string) => employer.postings.find((p) => p.title.toLowerCase() === title.toLowerCase());
  const smsNotice = employer.smsNumber && (
    <p>
      {`Include your mobile number to hear back by text. By giving it, you agree to receive texts from ${employer.name} at ${employer.smsNumber} about your application. `}
      Message frequency varies. Msg &amp; data rates may apply. Reply
      HELP for help, STOP to opt out. See our{" "}
      <Link href={`/careers/${employer.slug}/sms-terms`} className="underline">Text Messaging Terms</Link>
      {" and "}
      <Link href="/privacy#applicant-texts" className="underline">Privacy Policy</Link>.
    </p>
  );
  const notice = (children: React.ReactNode) => (
    <p role="status" className="mb-6 rounded-lg border p-4 font-sans-ui" style={{ borderColor: "rgba(90, 216, 255, 0.4)", background: "rgba(90, 216, 255, 0.1)", color: "var(--ink)" }}>
      {children}
    </p>
  );
  const links = (
    <p className="text-sm mt-2 font-sans-ui" style={{ color: "var(--ink-muted)" }}>
      Get to know {employer.name}:{" "}
      <a href={employer.website} target="_blank" rel="noopener noreferrer" className="underline">Website</a>
      {" · "}
      <a href={employer.instagram} target="_blank" rel="noopener noreferrer" className="underline">Instagram</a>
    </p>
  );
  const card = (key: string, id: string, title: string, desc: JobPosting | undefined, cta: React.ReactNode) => (
    <section key={key} id={id} className="rounded-lg border p-6 scroll-mt-24" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      <h2 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>{title}</h2>
      {desc ? (
        <>
          <p className="text-sm mt-1 mb-4 font-sans-ui" style={{ color: "var(--ink-muted)" }}>
            {[desc.employmentType, desc.location, desc.pay].filter(Boolean).join(" · ")}
          </p>
          <p className="leading-relaxed mb-4">{desc.summary}</p>
          <h3 className="font-semibold mb-2">What you&rsquo;ll do</h3>
          <ul className="list-disc pl-5 space-y-1 mb-4" style={{ color: "var(--ink-muted)" }}>
            {desc.duties.map((d) => <li key={d}>{d}</li>)}
          </ul>
          <h3 className="font-semibold mb-2">What we&rsquo;re looking for</h3>
          <ul className="list-disc pl-5 space-y-1 mb-6" style={{ color: "var(--ink-muted)" }}>
            {desc.requirements.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </>
      ) : (
        <div className="mb-5" />
      )}
      {cta}
      {links}
    </section>
  );
  const btn = "inline-flex items-center min-h-11 rounded-full px-5 py-2 font-sans-ui font-semibold text-sm";

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm mb-2 font-sans-ui" style={{ color: brand.accent }}>
          Now hiring
        </p>
        <h1 className="text-3xl font-semibold mb-3" style={{ color: "var(--ink)" }}>
          Jobs at {employer.name}
        </h1>
        <p className="mb-10 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
          {employer.tagline}
        </p>

        {reachable && closed && notice(
          open.length > 0 ? (
            <>That job isn&apos;t open any more. <a href="#apply" className="underline">Pick one of the open jobs below.</a></>
          ) : (
            <>That job isn&apos;t open any more. We&apos;re not hiring right now. Check back soon.</>
          ),
        )}
        {reachable && !closed && open.length === 0 && notice(<>We&apos;re not hiring right now. Check back soon.</>)}

        <div className="space-y-6">
          {reachable
            ? open.map((j) =>
                card(j.token, j.job_id, j.title, describe(j.title),
                  <a href={`?job=${j.token}#apply`} className={btn} style={{ background: brand.fill, color: brand.ink, boxShadow: brand.ring }}>
                    Apply
                  </a>))
            : employer.postings.map((job) =>
                card(job.id, job.id, job.title, job,
                  <>
                    <a
                      href={`mailto:${employer.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                      className={btn}
                      style={{ background: "var(--accent-gradient)", color: "var(--bg)" }}
                    >
                      Apply by email
                    </a>
                    <p className="text-sm mt-3 font-sans-ui" style={{ color: "var(--ink-muted)" }}>
                      Send a few lines about yourself and your availability to{" "}
                      <span style={{ color: "var(--ink)" }}>{employer.applyEmail}</span>.
                    </p>
                    <div className="text-sm mt-2 font-sans-ui" style={{ color: "var(--ink-muted)" }}>{smsNotice}</div>
                  </>))}
        </div>

        {open.length > 0 && (
          // Registered notice stays (verbatim) until the campaign amendment is approved; it lives in the form's fine print.
          <ApplyForm slug={employer.slug} jobs={open} selected={wanted ?? ""} notice={smsNotice} />
        )}
      </div>
    </PageShell>
  );
}
