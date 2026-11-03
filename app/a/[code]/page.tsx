import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import { fetchOpenJobs, getEmployer } from "@/lib/jobs";
import ApplyForm from "../../careers/[slug]/ApplyForm";

// A personal apply link from a text (owner, 2026-11-03: "create a unique url for them with analytics and prefill
// their phone number in the link"). The code names the person and the job; their phone never sits in the URL.
// Opening it is recorded (apply_link_open); applying fills in the rest.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Opened = { careers_slug: string | null; job_token: string | null; phone: string | null; name: string | null };

async function open(code: string): Promise<Opened | null> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key || !/^[0-9a-f]{20}$/.test(code)) return null;
  try {
    const res = await fetch(`${base}/rest/v1/rpc/apply_link_open`, {
      method: "POST", cache: "no-store",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_token: code }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = (await res.json()) as Opened[];
    return rows[0] ?? null;
  } catch (e) {
    console.error("apply_link_open failed", e);
    return null;
  }
}

export default async function PersonalApplyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const link = await open(code);
  if (!link?.careers_slug) notFound();
  const employer = getEmployer(link.careers_slug);
  if (!employer) notFound();
  const jobs = (await fetchOpenJobs(employer.slug))?.jobs ?? [];
  const job = jobs.find((j) => j.token === link.job_token);
  // Their job closed (or none was named): the jobs list, where they can pick another.
  if (!job) redirect(`/careers/${employer.slug}`);
  const pay = employer.postings.find((p) => p.title.toLowerCase() === job.title.toLowerCase())?.pay ?? employer.pay?.[job.title];

  return (
    <PageShell employer={employer}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* The step before an interview, not a second application (recruiting critic, 2026-11-03). */}
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--pass-violet)" }}>You texted us about {job.title}</p>
        <h1 className="text-3xl font-semibold mb-2" style={{ color: "var(--ink)" }}>Last step: about 3 minutes</h1>
        <p className="leading-relaxed mb-1" style={{ color: "var(--ink-muted)" }}>Then we&rsquo;ll text you to set up an interview.</p>
        {pay && <p className="text-sm mb-4" style={{ color: "var(--ink-muted)" }}>{pay}</p>}
        <ApplyForm slug={employer.slug} jobs={jobs} selected={job.token} orgName={employer.name} fixed
                   defaultName={link.name ?? undefined} defaultPhone={link.phone ?? undefined} />
      </div>
    </PageShell>
  );
}
