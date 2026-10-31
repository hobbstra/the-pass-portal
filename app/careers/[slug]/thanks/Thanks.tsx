"use client";

import Link from "next/link";
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
  let a: { first_name?: string; job_title?: string; texted?: boolean; opted_out?: boolean; phone?: string; org_name?: string; sms_number?: string | null } = {};
  try {
    a = raw ? JSON.parse(raw) : {};
  } catch {}
  const org = a.org_name || "We";
  return (
    <>
      <h1 className="text-3xl font-semibold mb-3" style={{ color: "var(--ink)" }}>
        {a.first_name && a.job_title ? `Thanks, ${a.first_name}. We've got your application for ${a.job_title}.` : "Thanks. We've got your application."}
      </h1>
      <p className="leading-relaxed" style={{ color: "var(--ink-muted)" }}>
        {a.texted && a.phone ? `${org} will text you at ${formatPhone(a.phone)} if we'd like to talk.` : "We'll be in touch."}
      </p>
      {a.opted_out && (
        <p className="leading-relaxed mt-3" style={{ color: "var(--ink)" }}>
          Text START to {a.sms_number ? formatPhone(a.sms_number) : "our number"} to get texts.
        </p>
      )}
      <p className="leading-relaxed mt-3" style={{ color: "var(--ink-muted)" }}>
        We read every application and text the people we&apos;d like to talk to.
      </p>
      <Link href={`/careers/${slug}`} className="inline-block mt-6 underline font-sans-ui" style={{ color: "var(--ink)" }}>
        Back to jobs
      </Link>
    </>
  );
}
