"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OpenJob, ApplyQuestion } from "@/lib/jobs";
import { brandVars } from "@/lib/brand";

const labelCls = "block text-base font-semibold mb-2.5 font-sans-ui";
const errColor = "#ff8f8f"; // on #160a24 this is ~9:1

declare global {
  interface Window { turnstile?: { reset: () => void } }
}

const MAX_RESUME = 5242880;
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type Opt = { key: string; label: string };
const YES_NO: Opt[] = [{ key: "yes", label: "Yes" }, { key: "no", label: "No" }];

function Options({ type, name, options }: { type: "checkbox" | "radio"; name: string; options: Opt[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => (
        <label key={o.key} className="ap-opt font-sans-ui">
          <input type={type} name={name} value={o.key} />
          {o.label}
        </label>
      ))}
    </div>
  );
}

// Days down the side, parts of the day across the top. Each option label reads "Tue afternoon".
function DaysGrid({ name, options }: { name: string; options: Opt[] }) {
  const days: string[] = [];
  const parts: string[] = [];
  const byCell = new Map<string, Opt>();
  for (const o of options) {
    const [day, ...rest] = o.label.split(/\s+/);
    const part = rest.join(" ");
    if (!days.includes(day)) days.push(day);
    if (!parts.includes(part)) parts.push(part);
    byCell.set(`${day}|${part}`, o);
  }
  return (
    <table className="ap-grid font-sans-ui">
      <thead>
        <tr>
          <td />
          {parts.map((p) => <th key={p} scope="col">{p}</th>)}
        </tr>
      </thead>
      <tbody>
        {days.map((d) => (
          <tr key={d}>
            <th scope="row">{d}</th>
            {parts.map((p) => {
              const o = byCell.get(`${d}|${p}`);
              return (
                <td key={p}>
                  {o && (
                    <label className="ap-cell">
                      <input type="checkbox" name={name} value={o.key} aria-label={o.label} />
                      <span aria-hidden="true">&#10003;</span>
                    </label>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Question({ q }: { q: ApplyQuestion }) {
  const name = `q_${q.id}`;
  let input;
  switch (q.kind) {
    case "yes_no":
      input = <Options type="radio" name={name} options={q.options.length ? q.options : YES_NO} />;
      break;
    case "yes_no_soon":
      input = <Options type="radio" name={name} options={q.options} />;
      break;
    case "shifts":
      input = <Options type="checkbox" name={name} options={q.options} />;
      break;
    case "days_times":
      input = <DaysGrid name={name} options={q.options} />;
      break;
    case "date":
      input = <input type="date" name={name} className="ap-input font-sans-ui" />;
      break;
  }
  return (
    <fieldset className="mt-7 first:mt-0 min-w-0">
      <legend className={labelCls} style={{ color: "var(--ink)" }}>{q.prompt}</legend>
      {input}
    </fieldset>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider pb-2 mb-5 border-b font-sans-ui" style={{ color: "var(--brand-accent)", borderColor: "var(--border)" }}>
        {title}
      </h3>
      {children}
    </section>
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
  slug, jobs, selected, notice,
}: { slug: string; jobs: OpenJob[]; selected: string; notice?: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState(selected);
  const [error, setError] = useState("");
  const [expError, setExpError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [soon, setSoon] = useState(true);
  const [fileName, setFileName] = useState("");
  const job = jobs.find((j) => j.token === token) ?? jobs[0];
  const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const today = new Date();
  const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  const qs = (kinds: ApplyQuestion["kind"][]) => job.questions.filter((q) => kinds.includes(q.kind));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setExpError(false);
    const f = new FormData(e.currentTarget);
    const experience = String(f.get("experience") ?? "").trim();
    const file = f.get("resume");
    const picked = file instanceof File && file.name !== "";
    if (picked && file.size === 0) {
      setError("That file is empty.");
      return;
    }
    if (picked && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload your résumé as a PDF.");
      return;
    }
    if (picked && file.size > MAX_RESUME) {
      setError("That file is over 5 MB.");
      return;
    }
    if (!picked && !experience) {
      setExpError(true);
      document.getElementById("experience")?.focus();
      return;
    }
    // Answers are option keys; the server checks them against the job's options.
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
    if (picked) body.set("resume", file);

    setBusy(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/apply-submit`, {
        method: "POST",
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "" },
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error(`apply-submit rejected: HTTP ${res.status}`); // status only, never form data
        setError(data.error || "Something went wrong sending your application. Please try again.");
        window.turnstile?.reset();
        setBusy(false);
        return;
      }
      try {
        sessionStorage.setItem(
          "applied",
          JSON.stringify({ ...data, phone: body.get("phone"), org_name: job.org_name, sms_number: job.sms_number }),
        );
      } catch {}
      router.push(`/careers/${slug}/thanks`); // busy stays true: no double submit
    } catch {
      console.error("apply-submit network error");
      setError("We couldn't reach the server. Check your connection and try again.");
      window.turnstile?.reset();
      setBusy(false);
    }
  }

  const days = qs(["days_times"]);
  const avail = qs(["shifts", "date"]);
  const about = qs(["yes_no", "yes_no_soon"]);
  return (
    <section id="apply" className="rounded-lg border p-5 sm:p-8 mt-10 scroll-mt-24" style={{ ...brandVars(job.brand_color), borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      <h2 className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>Apply to {job.org_name}</h2>
      <form onSubmit={onSubmit}>
        <Section title="About you">
          <div>
            <label htmlFor="job" className={labelCls}>Position</label>
            <select id="job" value={job.token} onChange={(e) => setToken(e.target.value)} className="ap-input font-sans-ui">
              {jobs.map((j) => <option key={j.token} value={j.token}>{j.title}</option>)}
            </select>
          </div>
          <div className="mt-7">
            <label htmlFor="name" className={labelCls}>Full name</label>
            <input id="name" name="name" required maxLength={120} autoComplete="name" className="ap-input font-sans-ui" />
          </div>
          <div className="mt-7">
            <label htmlFor="phone" className={labelCls}>Mobile phone</label>
            <input id="phone" name="phone" type="tel" inputMode="tel" required autoComplete="tel" className="ap-input font-sans-ui" />
          </div>
        </Section>

        <Section title="Your experience">
          <label htmlFor="resume" className="ap-file font-sans-ui" style={expError ? { borderColor: errColor } : undefined}>
            <input
              id="resume" name="resume" type="file" accept="application/pdf" className="sr-only"
              aria-invalid={expError} aria-describedby={expError ? "exp-error" : undefined}
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
            <span className="break-all">{fileName || "Add your résumé (PDF)"}</span>
          </label>
          <div className="flex items-center gap-3 my-5 text-sm font-sans-ui" style={{ color: "var(--ink-muted)" }} aria-hidden="true">
            <span className="flex-1 border-t" style={{ borderColor: "var(--border)" }} />or<span className="flex-1 border-t" style={{ borderColor: "var(--border)" }} />
          </div>
          <label htmlFor="experience" className={labelCls}>Tell us about your experience</label>
          <textarea id="experience" name="experience" rows={5} maxLength={8000} aria-invalid={expError} aria-describedby={expError ? "exp-error" : undefined} className="ap-input font-sans-ui" />
          {expError && <p id="exp-error" role="alert" className="mt-2 text-sm font-sans-ui" style={{ color: errColor }}>Attach your résumé as a PDF or tell us about your experience.</p>}
          {about.length > 0 && <div className="mt-7">{about.map((q) => <Question key={`${job.token}-${q.id}`} q={q} />)}</div>}
        </Section>

        <Section title="Availability">
          {avail.map((q) => <Question key={`${job.token}-${q.id}`} q={q} />)}
          <fieldset className={`min-w-0 ${avail.length ? "mt-7" : ""}`}>
            <legend className={labelCls} style={{ color: "var(--ink)" }}>When can you start?</legend>
            <div className="flex flex-wrap gap-2.5 items-center">
              <label className="ap-opt font-sans-ui">
                <input type="radio" name="start_mode" checked={soon} onChange={() => setSoon(true)} /> Right away
              </label>
              <label className="ap-opt font-sans-ui">
                <input type="radio" name="start_mode" checked={!soon} onChange={() => setSoon(false)} /> On a date
              </label>
              {!soon && <input type="date" name="start_date" required min={ymd(today)} max={ymd(nextYear)} aria-label="Start date" className="ap-input font-sans-ui !w-auto" />}
            </div>
          </fieldset>
        </Section>

        {days.length > 0 && (
          <Section title="Interview">
            {days.map((q) => <Question key={`${job.token}-${q.id}`} q={q} />)}
          </Section>
        )}

        {job.consent_text && (
          <div className="mt-10">
            <label className="ap-consent flex items-start gap-3 text-sm font-sans-ui" style={{ color: "var(--ink)" }}>
              <input type="checkbox" name="consent" value="1" className="mt-0.5" />
              <span>{job.consent_text}</span>
            </label>
          </div>
        )}

        {turnstileKey && (
          <>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
            <div className="cf-turnstile mt-6" data-sitekey={turnstileKey} />
          </>
        )}

        {error && <p role="alert" className="mt-6 text-sm font-sans-ui" style={{ color: errColor }}>{error}</p>}
        <button type="submit" disabled={busy} className="ap-submit font-sans-ui mt-6">
          {busy ? "Sending…" : "Send application"}
        </button>

        {(job.fine_print || notice) && (
          <div className="mt-5 space-y-3 text-sm font-sans-ui" style={{ color: "var(--ink-muted)" }}>
            {job.fine_print && <p><FinePrint text={job.fine_print} slug={slug} /></p>}
            {notice}
          </div>
        )}
      </form>
      <p className="mt-8 text-xs text-center font-sans-ui" style={{ color: "var(--ink-muted)" }}>Powered by The Pass</p>
    </section>
  );
}
