"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
function read() {
  try {
    return sessionStorage.getItem("applied") ?? "";
  } catch {
    return "";
  }
}

// The applicant's details come from sessionStorage (set by the form), so the
// phone number never travels in a URL.
export default function Thanks() {
  const raw = useSyncExternalStore(noop, read, () => "");
  let a: { first_name?: string; job_title?: string; texted?: boolean; phone?: string } = {};
  try {
    a = raw ? JSON.parse(raw) : {};
  } catch {}
  return (
    <>
      <h1 className="text-3xl font-semibold mb-3" style={{ color: "var(--ink)" }}>
        {a.first_name && a.job_title ? `Thanks, ${a.first_name}. We've got your application for ${a.job_title}.` : "Thanks. We've got your application."}
      </h1>
      <p className="leading-relaxed" style={{ color: "var(--ink-muted)" }}>
        {a.texted && a.phone ? `We'll text you at ${a.phone} if we'd like to talk.` : "We'll be in touch."}
      </p>
    </>
  );
}
