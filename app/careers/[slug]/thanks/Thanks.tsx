"use client";

import Link from "next/link";
import { brandOf } from "@/lib/brand";
import { formatPhone } from "@/lib/phone";
import { useEffect, useSyncExternalStore } from "react";

const noop = () => () => {};
let cached = ""; // survives the removal below, so re-renders keep the text
function read() {
  try {
    cached = sessionStorage.getItem("applied") ?? cached;
  } catch {}
  return cached;
}

// The applicant's details come from sessionStorage (set by the form), so the
// phone number never travels in a URL.
export default function Thanks({ slug }: { slug: string }) {
  const raw = useSyncExternalStore(noop, read, () => "");
  useEffect(() => {
    try {
      sessionStorage.removeItem("applied");
    } catch {}
  }, []);
  let a: { first_name?: string; job_title?: string; texted?: boolean; opted_out?: boolean; phone?: string; org_name?: string; sms_number?: string | null; brand_color?: string | null } = {};
  try {
    a = raw ? JSON.parse(raw) : {};
  } catch {}
  const org = a.org_name || "We";
  const b = brandOf(a.brand_color);
  const btn = "inline-flex items-center min-h-11 rounded-full border px-5 py-2 font-sans-ui font-semibold text-sm";
  const nowrap = { whiteSpace: "nowrap" } as const;
  return (
    <>
      <div className="flex items-center justify-center w-14 h-14 rounded-full mb-5" style={{ background: b.fill, color: b.ink }} aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 10.5l3.5 3.5L15 7" /></svg>
      </div>
      <h1 className="text-3xl font-medium mb-3" style={{ color: "var(--ink)" }}>
        {a.first_name && a.job_title ? <>Thanks, {a.first_name}. We&apos;ve got your application for <span className="font-bold">{a.job_title}</span>.</> : "Thanks. We've got your application."}
      </h1>
      <p className="leading-relaxed" style={{ color: "var(--ink-muted)" }}>
        {a.texted && a.phone ? <>{org} will text you at <span style={nowrap}>{formatPhone(a.phone)}</span> if we&apos;d like to talk.</> : a.opted_out ? "Want updates by text?" : "We'll be in touch."}
      </p>
      {a.opted_out && (
        a.sms_number ? (
          <a href={`sms:${a.sms_number}?&body=START`} className={`${btn} mt-4 mr-3 border-transparent`} style={{ background: b.fill, color: b.ink }}>
            <span style={nowrap}>Text START to {formatPhone(a.sms_number)}</span>
          </a>
        ) : (
          <p className="leading-relaxed mt-3" style={{ color: "var(--ink)" }}>Text START to our number to get texts.</p>
        )
      )}
      <Link
        href={`/careers/${slug}`}
        className="inline-block mt-6 underline font-sans-ui"
        style={{ color: "var(--ink-muted)" }}
      >
        Back to jobs
      </Link>
    </>
  );
}
