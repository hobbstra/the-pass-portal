import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import { employers, fetchOpenJobs, getEmployer, type JobPosting } from "@/lib/jobs";

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
  const open = fetched?.jobs ?? [];
  // Old and Indeed links (?job=<token>) go to that job's own page; a closed one stays here and says so.
  if (wanted && open.some((j) => j.token === wanted)) redirect(`/careers/${employer.slug}/${wanted}`);
  const reachable = fetched !== null;
  const closed = !!wanted && !open.some((j) => j.token === wanted);
  const describe = (title: string) => employer.postings.find((p) => p.title.toLowerCase() === title.toLowerCase());
  const smsNotice = employer.smsNumber && (
    <p>
      {`Include your mobile number to hear back by text. By giving it, you agree to receive texts from ${employer.name} at `}
      <span style={{ whiteSpace: "nowrap" }}>{employer.smsNumber}</span>{" about your application. "}
      Message frequency varies. Msg &amp; data rates may apply. Reply
      HELP for help, STOP to opt out. See our{" "}
      <Link href={`/careers/${employer.slug}/sms-terms`} className="underline">Text Messaging Terms</Link>
      {" and "}
      <Link href="/privacy#applicant-texts" className="underline">Privacy Policy</Link>.
    </p>
  );
  const notice = (children: React.ReactNode) => (
    <p role="status" className="mb-6 rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--tint)", color: "var(--ink)" }}>
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
  const card = (key: string, id: string, title: string, desc: JobPosting | undefined, cta: React.ReactNode, accent?: boolean) => (
    <section key={key} id={id} className="rounded-lg border p-6 scroll-mt-24 relative" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      <h2 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>{title}</h2>
      {desc ? (
        <>
          <p className="text-sm mt-1 mb-4 font-sans-ui" style={{ color: "var(--ink-muted)" }}>
            {accent && (
              <span className="inline-block rounded-full px-2.5 py-0.5 mr-2 text-xs font-semibold" style={{ background: "var(--tint)", color: "var(--pass-violet)" }}>{desc.employmentType}</span>
            )}
            {[accent ? null : desc.employmentType, desc.location].filter(Boolean).join(" · ")}
            {desc.pay && <span className="block mt-1">{desc.pay}</span>}
          </p>
          <p className="leading-relaxed mb-4">{desc.summary}</p>
          {!accent && <>
          <h3 className="font-semibold mb-2">What you&rsquo;ll do</h3>
          <ul className="list-disc pl-5 space-y-1 mb-4" style={{ color: "var(--ink-muted)" }}>
            {desc.duties.map((d) => <li key={d}>{d}</li>)}
          </ul>
          <h3 className="font-semibold mb-2">What we&rsquo;re looking for</h3>
          <ul className="list-disc pl-5 space-y-1 mb-6" style={{ color: "var(--ink-muted)" }}>
            {desc.requirements.map((r) => <li key={r}>{r}</li>)}
          </ul>
          </>}
        </>
      ) : (
        <div className="mb-5" />
      )}
      {cta}
    </section>
  );
  const btn = "inline-flex items-center min-h-11 rounded-full px-5 py-2 font-sans-ui font-semibold text-sm";

  return (
    <PageShell employer={employer}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Not hiring: the message is the headline (no job cards follow). */}
        {reachable && open.length === 0 ? (
          <>
            <h1 className="text-3xl font-semibold mb-3" style={{ color: "var(--ink)" }}>We&apos;re not hiring right now</h1>
            <p className="mb-3 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
              {closed ? "That job isn't open any more. " : ""}{employer.tagline}
            </p>
            <p className="mb-5 leading-relaxed" style={{ color: "var(--ink-muted)" }}>Check back soon, or follow along:</p>
            <p className="flex flex-wrap gap-3 mb-10">
              <a href={employer.website} target="_blank" rel="noopener noreferrer" className="bk-secondary">Visit our website</a>
              <a href={employer.instagram} target="_blank" rel="noopener noreferrer" className="bk-secondary">Instagram</a>
            </p>
          </>
        ) : (
          <>
            {/* From a stale link, the answer to "where's my job?" comes first. */}
            {reachable && closed && notice(<>That job&apos;s closed. Here&apos;s what&apos;s open.</>)}
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--pass-violet)" }}>Now hiring</p>
            <h1 className="text-3xl font-semibold mb-3" style={{ color: "var(--ink)" }}>Jobs at {employer.name}</h1>
            <p className="mb-2 leading-relaxed" style={{ color: "var(--ink-muted)" }}>{employer.tagline}</p>
            {links}
            <div className="mb-10" />
          </>
        )}

        <div className="space-y-6">
          {reachable
            ? open.map((j) =>
                card(j.token, j.job_id, j.title, describe(j.title),
                  <Link href={`/careers/${employer.slug}/${j.token}`} className={`${btn} card-link`} style={{ background: "var(--pass-grad)", color: "#fff" }}>
                    See the job and apply
                  </Link>, true))
            : // Email fallback keeps the registered notice on purpose: the phone is optional there.
              employer.postings.map((job) =>
                card(job.id, job.id, job.title, job,
                  <>
                    <a
                      href={`mailto:${employer.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                      className={btn}
                      style={{ background: "var(--pass-grad)", color: "#fff" }}
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

        {employer.about && (
          <section aria-labelledby="about" className="mt-12">
            <h2 id="about" className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--pass-violet)" }}>About {employer.name}</h2>
            <p className="leading-relaxed" style={{ color: "var(--ink-muted)" }}>{employer.about}</p>
          </section>
        )}
        {employer.press && employer.press.length > 0 && (
          <section aria-labelledby="press" className="mt-10">
            <h2 id="press" className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--pass-violet)" }}>In the news</h2>
            {/* The three biggest as rows; every other outlet still linked, on one line (owner wants all the coverage). */}
            <ul className="divide-y rounded-lg border" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
              {employer.press.slice(0, 3).map((p) => (
                <li key={p.url} style={{ borderColor: "var(--border)" }}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 min-h-11">
                    <span className="flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>{p.outlet}</span>
                      <span className="block font-medium" style={{ color: "var(--ink)" }}>{p.title}</span>
                    </span>
                    <span aria-hidden="true" style={{ color: "var(--pass-violet)" }}>&#8599;</span>
                  </a>
                </li>
              ))}
            </ul>
            {employer.press.length > 3 && (
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                Also in:{" "}
                {employer.press.slice(3).map((p, i) => (
                  <span key={p.url}>{i > 0 && " · "}<a href={p.url} target="_blank" rel="noopener noreferrer" className="underline">{p.outlet}</a></span>
                ))}
              </p>
            )}
          </section>
        )}
      </div>
    </PageShell>
  );
}
