"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OpenJob, ApplyQuestion } from "@/lib/jobs";

const SHIFTS = ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Saturday", "Sunday"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PARTS = ["Morning", "Afternoon", "Evening"];

const field = "w-full rounded-md border px-3 py-2 font-sans-ui";
const fieldStyle = { borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" } as const;
const labelCls = "block text-sm font-semibold mb-1 font-sans-ui";

declare global {
  interface Window { turnstile?: { reset: () => void } }
}

const MAX_RESUME = 5242880;

function Checks({ name, options, labelOf }: { name: string; options: string[]; labelOf?: (o: string) => string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-sans-ui" style={{ borderColor: "var(--border)" }}>
          <input type="checkbox" name={name} value={o} aria-label={o} />
          {labelOf ? labelOf(o) : o}
        </label>
      ))}
    </div>
  );
}

function Radios({ name, options }: { name: string; options: [string, string][] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([v, l]) => (
        <label key={v} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-sans-ui" style={{ borderColor: "var(--border)" }}>
          <input type="radio" name={name} value={v} />
          {l}
        </label>
      ))}
    </div>
  );
}

function Question({ q }: { q: ApplyQuestion }) {
  const name = `q_${q.id}`;
  let input;
  switch (q.kind) {
    case "yes_no":
      input = <Radios name={name} options={[["yes", "Yes"], ["no", "No"]]} />;
      break;
    case "yes_no_soon":
      input = <Radios name={name} options={[["yes", "Yes"], ["no", "No"], ["soon", "Soon"]]} />;
      break;
    case "shifts":
      input = <Checks name={name} options={SHIFTS} />;
      break;
    case "days_times":
      input = (
        <div className="space-y-2">
          {DAYS.map((d) => (
            <div key={d} className="flex items-center gap-2 flex-wrap">
              <span className="w-10 text-sm font-sans-ui">{d}</span>
              <Checks name={name} options={PARTS.map((p) => `${d} ${p.toLowerCase()}`)} labelOf={(o) => o.split(" ")[1][0].toUpperCase() + o.split(" ")[1].slice(1)} />
            </div>
          ))}
        </div>
      );
      break;
    case "date":
      input = <input type="date" name={name} className={field} style={fieldStyle} />;
      break;
  }
  return (
    <fieldset className="mb-5">
      <legend className={labelCls}>{q.prompt}</legend>
      {input}
    </fieldset>
  );
}

function FinePrint({ text, slug }: { text: string; slug: string }) {
  const parts = text.split(/(Text Messaging Terms|Privacy Policy)/);
  return (
    <>
      {parts.map((p, i) =>
        p === "Text Messaging Terms" ? (
          <Link key={i} href={`/careers/${slug}/sms-terms`} className="underline">{p}</Link>
        ) : p === "Privacy Policy" ? (
          <Link key={i} href="/privacy#applicant-texts" className="underline">{p}</Link>
        ) : (
          p
        ),
      )}
    </>
  );
}

export default function ApplyForm({
  slug, jobs, selected,
}: { slug: string; jobs: OpenJob[]; selected: string }) {
  const router = useRouter();
  const [token, setToken] = useState(selected);
  const [error, setError] = useState("");
  const [expError, setExpError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [soon, setSoon] = useState(true);
  const job = jobs.find((j) => j.token === token) ?? jobs[0];
  const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setExpError(false);
    const f = new FormData(e.currentTarget);
    const experience = String(f.get("experience") ?? "").trim();
    const file = f.get("resume");
    const hasFile = file instanceof File && file.size > 0;
    if (hasFile && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload your résumé as a PDF.");
      return;
    }
    if (hasFile && file.size > MAX_RESUME) {
      setError("That file is over 5 MB.");
      return;
    }
    if (!hasFile && !experience) {
      setExpError(true);
      document.getElementById("experience")?.focus();
      return;
    }
    const answers: Record<string, unknown> = {};
    for (const q of job.questions) {
      const n = `q_${q.id}`;
      if (q.kind === "shifts" || q.kind === "days_times") answers[q.id] = f.getAll(n);
      else {
        const v = String(f.get(n) ?? "");
        if (!v) continue;
        answers[q.id] = q.kind === "yes_no" ? v === "yes" : v;
      }
    }
    const body = new FormData();
    body.set("token", job.token);
    body.set("name", String(f.get("name") ?? "").trim());
    body.set("phone", String(f.get("phone") ?? "").trim());
    body.set("experience", experience);
    body.set("start", soon ? "now" : String(f.get("start_date") ?? ""));
    body.set("answers", JSON.stringify(answers));
    body.set("consent", f.get("consent") ? "1" : "");
    body.set("turnstile", String(f.get("cf-turnstile-response") ?? ""));
    if (hasFile) body.set("resume", file);

    setBusy(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/apply-submit`, {
        method: "POST",
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "" },
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong sending your application. Please try again.");
        window.turnstile?.reset();
        setBusy(false);
        return;
      }
      try {
        sessionStorage.setItem("applied", JSON.stringify({ ...data, phone: body.get("phone") }));
      } catch {}
      router.push(`/careers/${slug}/thanks`); // busy stays true: no double submit
    } catch (err) {
      console.error("apply-submit failed", err);
      setError("We couldn't reach the server. Check your connection and try again.");
      window.turnstile?.reset();
      setBusy(false);
    }
  }

  return (
    <section id="apply" className="rounded-lg border p-6 mt-10 scroll-mt-24" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--ink)" }}>Apply</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-5">
          <label htmlFor="job" className={labelCls}>Position</label>
          <select id="job" value={job.token} onChange={(e) => setToken(e.target.value)} className={field} style={fieldStyle}>
            {jobs.map((j) => <option key={j.token} value={j.token}>{j.title}</option>)}
          </select>
        </div>
        <div className="mb-5">
          <label htmlFor="name" className={labelCls}>Full name</label>
          <input id="name" name="name" required maxLength={120} autoComplete="name" className={field} style={fieldStyle} />
        </div>
        <div className="mb-5">
          <label htmlFor="phone" className={labelCls}>Mobile phone</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" required autoComplete="tel" className={field} style={fieldStyle} />
        </div>
        <div className="mb-5">
          <label htmlFor="resume" className={labelCls}>Résumé (PDF)</label>
          <input id="resume" name="resume" type="file" accept="application/pdf" aria-invalid={expError} aria-describedby={expError ? "exp-error" : undefined} className="font-sans-ui text-sm" />
          <label htmlFor="experience" className={`${labelCls} mt-3`}>Or tell us about your experience</label>
          <textarea id="experience" name="experience" rows={5} maxLength={8000} aria-invalid={expError} aria-describedby={expError ? "exp-error" : undefined} className={field} style={fieldStyle} />
          {expError && <p id="exp-error" role="alert" className="mt-1 text-sm font-sans-ui" style={{ color: "#ff6b6b" }}>Attach your résumé as a PDF or tell us about your experience.</p>}
        </div>

        {job.questions.map((q) => <Question key={`${job.token}-${q.id}`} q={q} />)}

        <fieldset className="mb-5">
          <legend className={labelCls}>When can you start?</legend>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-sans-ui" style={{ borderColor: "var(--border)" }}>
              <input type="radio" name="start_mode" checked={soon} onChange={() => setSoon(true)} /> Right away
            </label>
            <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-sans-ui" style={{ borderColor: "var(--border)" }}>
              <input type="radio" name="start_mode" checked={!soon} onChange={() => setSoon(false)} /> On a date
            </label>
            {!soon && <input type="date" name="start_date" required aria-label="Start date" className={field + " !w-auto"} style={fieldStyle} />}
          </div>
        </fieldset>

        {job.consent_text && (
          <div className="mb-5">
            <label className="flex items-start gap-2 text-sm font-sans-ui">
              <input type="checkbox" name="consent" value="1" className="mt-1" />
              <span>{job.consent_text}</span>
            </label>
            {job.fine_print && (
              <p className="text-sm mt-2 font-sans-ui" style={{ color: "var(--ink-muted)" }}>
                <FinePrint text={job.fine_print} slug={slug} />
              </p>
            )}
          </div>
        )}

        {turnstileKey && (
          <>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
            <div className="cf-turnstile mb-5" data-sitekey={turnstileKey} />
          </>
        )}

        {error && <p role="alert" className="mb-4 text-sm font-sans-ui" style={{ color: "#ff6b6b" }}>{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full px-5 py-2 font-sans-ui font-semibold text-sm disabled:opacity-60"
          style={{ background: "var(--accent-gradient)", color: "var(--bg)" }}
        >
          {busy ? "Sending…" : "Send application"}
        </button>
      </form>
    </section>
  );
}
