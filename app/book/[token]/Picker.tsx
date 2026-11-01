"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { type Booking, meetingWord, whenText } from "@/lib/booking";

// Open times by day in the business's time zone, a time per tap, then one Book button.
export default function Picker({ token, booking: b }: { token: string; booking: Booking }) {
  const router = useRouter();
  const [changing, setChanging] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState<string | null>(null);
  const what = meetingWord(b.kind);
  const days = useMemo(() => {
    const out = new Map<string, { label: string; times: string[] }>();
    for (const t of b.times ?? []) {
      const d = new Date(t);
      const key = d.toLocaleDateString("en-CA", { timeZone: b.timezone });
      const label = d.toLocaleDateString("en-US", { timeZone: b.timezone, weekday: "long", month: "short", day: "numeric" });
      if (!out.has(key)) out.set(key, { label, times: [] });
      out.get(key)!.times.push(t);
    }
    return [...out.values()];
  }, [b.times, b.timezone]);

  const done = booked ?? (!changing ? b.booked_at : null);
  if (done) {
    return (
      <div role="status" className="rounded-lg border p-5 font-sans-ui" style={{ borderColor: "var(--brand-fill)", background: "rgba(242, 233, 255, 0.06)", color: "var(--ink)" }}>
        <p className="text-lg font-semibold">You&apos;re booked for {whenText(done, b.timezone)}.</p>
        <p className="mt-2" style={{ color: "var(--ink-muted)" }}>
          {b.can_change || booked
            ? "Keep this link: you can change your time here until the day before."
            : "It's less than a day away, so to change it, reply to our text."}
        </p>
        {(b.can_change || booked) && (
          <button type="button" className="underline mt-4 min-h-11" onClick={() => { setBooked(null); setChanging(true); setPick(null); router.refresh(); }}>
            Change time
          </button>
        )}
      </div>
    );
  }

  async function book() {
    if (!pick) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/book_from_link`, {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_token: token, p_at: pick }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        // The database's own words ("That time was just taken. Pick another."); fresh times follow.
        setError(typeof body?.message === "string" ? body.message : "That didn't go through. Try again.");
        setPick(null);
        router.refresh();
      } else {
        setBooked(typeof body === "string" ? body : pick);
      }
    } catch {
      setError("No connection. Check your signal and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (days.length === 0) {
    return <p className="font-sans-ui" style={{ color: "var(--ink-muted)" }}>No open times in the next two weeks. Reply to our text and we&apos;ll find one.</p>;
  }
  return (
    <div className="font-sans-ui">
      {days.map((d) => (
        <fieldset key={d.label} className="mb-7">
          <legend className="text-sm font-semibold uppercase tracking-wider pb-2 mb-3 border-b w-full" style={{ color: "var(--brand-accent)", borderColor: "var(--border)" }}>
            {d.label}
          </legend>
          <div className="bk-times">
            {d.times.map((t) => (
              <label key={t} className="bk-time">
                <input type="radio" name="time" value={t} checked={pick === t} onChange={() => setPick(t)} />
                <span>{new Date(t).toLocaleTimeString("en-US", { timeZone: b.timezone, hour: "numeric", minute: "2-digit" })}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {error && <p role="alert" className="mb-4" style={{ color: "#ff9db0" }}>{error}</p>}
      <div className="sticky bottom-0 py-4" style={{ background: "linear-gradient(transparent, var(--bg) 30%)" }}>
        <button type="button" disabled={!pick || busy} onClick={book} className="ap-submit">
          {busy ? "Booking…" : pick ? `Book ${whenText(pick, b.timezone)}` : `Pick a time for your ${what}`}
        </button>
      </div>
    </div>
  );
}
