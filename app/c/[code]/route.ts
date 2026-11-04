// "Add to calendar" for a meeting (owner, 2026-11-03: "Can we also send me and the candidate a calendar invite?" →
// "Send over text"). The code names one meeting (meeting_calendar, anonymous — the code is the key); this answers
// with an .ics, which a phone opens as "Add to Calendar". Never indexed; no personal data in the URL.
export const dynamic = "force-dynamic";

type Row = { event_id: string; kind: string; starts_at: string; minutes: number | null; org_name: string;
             person: string | null; note_for_candidate: string | null; cancelled: boolean };

const LABEL: Record<string, string> = { call: "Phone call", interview: "Interview", trial: "Trial shift" };
const DEFAULT_MINUTES: Record<string, number> = { call: 15, interview: 30, trial: 120 };

// RFC 5545: UTC stamps, escaped text, lines folded at 75 octets.
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r\n|\r|\n/g, "\\n");
const fold = (line: string) => {
  const out: string[] = [];
  let rest = line;
  while (Buffer.byteLength(rest, "utf8") > 75) {
    let cut = 75;
    while (Buffer.byteLength(rest.slice(0, cut), "utf8") > 75) cut--;
    out.push(rest.slice(0, cut));
    rest = " " + rest.slice(cut);
  }
  out.push(rest);
  return out.join("\r\n");
};

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key || !/^[0-9a-f]{20}$/.test(code)) return new Response("Not found", { status: 404 });
  let row: Row | undefined;
  try {
    const res = await fetch(`${base}/rest/v1/rpc/meeting_calendar`, {
      method: "POST", cache: "no-store",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_token: code }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    row = ((await res.json()) as Row[])[0];
  } catch (e) {
    console.error("meeting_calendar failed", e);
    return new Response("Couldn't load that meeting. Try again in a minute.", { status: 502 });
  }
  if (!row) return new Response("Not found", { status: 404 });

  const start = new Date(row.starts_at);
  const end = new Date(start.getTime() + (row.minutes ?? DEFAULT_MINUTES[row.kind] ?? 30) * 60_000);
  const what = `${LABEL[row.kind] ?? "Meeting"} at ${row.org_name}`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//The Pass//Hiring//EN", "METHOD:PUBLISH", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${row.event_id}@thepass.cloud`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(what)}`,
    ...(row.note_for_candidate ? [`DESCRIPTION:${esc(row.note_for_candidate)}`] : []),
    `STATUS:${row.cancelled ? "CANCELLED" : "CONFIRMED"}`,
    "BEGIN:VALARM", "TRIGGER:-PT1H", "ACTION:DISPLAY", `DESCRIPTION:${esc(what)}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].map(fold).join("\r\n") + "\r\n";

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${row.kind}.ics"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
