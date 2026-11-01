"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { type Booking, dayText, mapsHref, meetingWord, timeText, whenText, zoneText } from "@/lib/booking";
import { formatPhone } from "@/lib/phone";

// Pick a time (open times by day, in the business's time zone) or, once booked, what's booked and how to change it.
export default function Picker({ token, booking: b }: { token: string; booking: Booking }) {
  const router = useRouter();
  const [changing, setChanging] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState<string | null>(null);
  // Just booked: the rule is a day before that time (the page's can_change was about the old one).
  const [bookedCanChange, setBookedCanChange] = useState(false);
  const what = meetingWord(b.kind);
  const zone = zoneText(b.timezone);
  const days = useMemo(() => {
    const out = new Map<string, { label: string; times: string[] }>();
    for (const t of b.times ?? []) {
      const key = new Date(t).toLocaleDateString("en-CA", { timeZone: b.timezone });
      if (!out.has(key)) out.set(key, { label: dayText(t, b.timezone), times: [] });
      out.get(key)!.times.push(t);
    }
    return [...out.values()];
  }, [b.times, b.timezone]);
  const where = b.kind === "call"
    ? `${b.host_first_name ?? "We"} will call you.`
    : b.place_name ? `At ${b.place_name}` : null;
  const maps = b.kind === "call" ? null : mapsHref(b);
  const textUs = b.sms_number && <a href={`sms:${b.sms_number}`} className="underline">text us at {formatPhone(b.sms_number)}</a>;
  const eyebrow = b.careers_slug ? null : <p className="text-sm font-semibold uppercase tracking-wider font-sans-ui mb-2" style={{ color: "var(--brand-accent)" }}>{b.org_name}</p>;

  const done = booked ?? (!changing ? b.booked_at : null);
  if (done) {
    const canChange = booked ? bookedCanChange : !!b.can_change;
    const until = new Date(new Date(done).getTime() - 864e5);
    return (
      <>
        {eyebrow}
        <div className="flex items-center justify-center w-14 h-14 rounded-full mb-5" style={{ background: "var(--brand-fill)", color: "var(--brand-ink)" }} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 10.5l3.5 3.5L15 7" /></svg>
        </div>
        <h1 className="text-3xl font-medium mb-6" style={{ color: "var(--ink)" }}>You&apos;re booked{b.first_name ? `, ${b.first_name}` : ""}.</h1>
        <div role="status" className="rounded-lg border p-5 font-sans-ui" style={{ borderColor: "var(--border)", borderTop: "3px solid var(--brand-fill)", background: "var(--bg-elevated)", color: "var(--ink)" }}>
          <p className="text-lg font-semibold">{dayText(done, b.timezone)}</p>
          <p className="text-4xl font-semibold mt-1">{timeText(done, b.timezone)} <span className="text-base font-normal" style={{ color: "var(--ink-muted)" }}>{zone}</span></p>
          <p className="mt-3">
            {[`${b.minutes}-minute ${what}`, b.host_first_name && `with ${b.host_first_name}`].filter(Boolean).join(" ")}
            {b.job_title ? ` · ${b.job_title}` : ""}
          </p>
          {where && <p className="mt-1">{where}{maps && <> · <a href={maps} className="underline">Directions</a></>}</p>}
          <div className="flex flex-wrap gap-3 mt-5">
            <a href={`/book/${token}/ics`} className="bk-secondary">Add to calendar</a>
            {canChange && (
              <button type="button" className="bk-secondary" onClick={() => { setBooked(null); setChanging(true); setPick(null); router.refresh(); }}>
                Change time
              </button>
            )}
          </div>
        </div>
        <p className="mt-4 font-sans-ui text-sm" style={{ color: "var(--ink-muted)" }}>
          {canChange
            ? <>You can change it here until {whenText(until.toISOString(), b.timezone)}{textUs ? <>; after that, {textUs}</> : null}.</>
            : <>It&apos;s less than a day away, so to change it, {textUs ?? "reply to our text"}.</>}
        </p>
      </>
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
        const at = typeof body === "string" ? body : pick;
        setBooked(at);
        setBookedCanChange(new Date(at).getTime() - 864e5 > Date.now());
        setChanging(false);
      }
    } catch {
      setError("No connection. Check your signal and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="font-sans-ui">
      {eyebrow}
      <h1 className="text-3xl font-medium mb-2" style={{ color: "var(--ink)" }}>
        {changing ? "Pick a new time" : `${b.first_name ? `Hi ${b.first_name}, pick` : "Pick"} a time for your ${what}`}
      </h1>
      <p className="mb-1" style={{ color: "var(--ink-muted)" }}>
        {[b.job_title, `${b.minutes} minutes`, b.host_first_name && `with ${b.host_first_name}`].filter(Boolean).join(" · ")}
      </p>
      <p className="mb-8" style={{ color: "var(--ink-muted)" }}>
        {where ? <>{where}{maps && <> · <a href={maps} className="underline">Directions</a></>} · </> : ""}Times are {zone}
      </p>
      {changing && b.booked_at && (
        <p className="mb-6 rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "rgba(242, 233, 255, 0.06)", color: "var(--ink)" }}>
          Now: {whenText(b.booked_at, b.timezone)}.{" "}
          <button type="button" className="underline min-h-11" onClick={() => { setChanging(false); setPick(null); }}>Keep this time</button>
        </p>
      )}
      {days.length === 0 ? (
        <p style={{ color: "var(--ink-muted)" }}>No open times in the next two weeks. {textUs ? <>Please {textUs} and we&apos;ll find one.</> : "Reply to our text and we'll find one."}</p>
      ) : (
        <>
          {days.map((d) => (
            <fieldset key={d.label} className="mb-7">
              <legend className="text-sm font-semibold uppercase tracking-wider pb-2 mb-3 border-b w-full" style={{ color: "var(--brand-accent)", borderColor: "var(--border)" }}>
                {d.label}
              </legend>
              <div className="bk-times">
                {d.times.map((t) => (
                  <label key={t} className="bk-time">
                    <input type="radio" name="time" value={t} checked={pick === t} onChange={() => setPick(t)} />
                    <span>{timeText(t, b.timezone)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          {/* Room under the last row for the Book bar. */}
          <p className="mb-28 text-sm" style={{ color: "var(--ink-muted)" }}>None of these work? {textUs ? <>Please {textUs}.</> : "Reply to our text."}</p>
        </>
      )}
      {error && <p role="alert" className="mb-4" style={{ color: "var(--error)" }}>{error}</p>}
      {pick && (
        <div className="bk-bar">
          <button type="button" disabled={busy} onClick={book} className="ap-submit">
            {busy ? "Booking…" : `Book ${whenText(pick, b.timezone)}`}
          </button>
        </div>
      )}
    </div>
  );
}
