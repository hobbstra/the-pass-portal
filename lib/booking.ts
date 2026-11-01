// The booking page's data (booking_page RPC): who it's with, what's booked, open times. Read per request:
// a time someone just took must not be offered from a cache.
export type Booking = {
  org_name: string;
  brand_color: string | null;
  timezone: string;
  // Dead links carry only live, org_name, brand_color, careers_slug, timezone, kind, booked_at, sms_number.
  first_name?: string | null;
  job_title?: string | null;
  kind: "call" | "interview" | "trial";
  minutes?: number;
  host_first_name?: string | null;
  booked_at: string | null;
  live: boolean;
  can_change?: boolean;
  times?: string[] | null;
  careers_slug: string | null;
  sms_number: string | null; // E.164: where "text us" goes
  place_name?: string | null; // where to come in (the business's main location)
  place_lat?: number | null;
  place_lon?: number | null;
};

// null = no such link; "error" = couldn't ask (shown as "try again", never as "expired").
export async function fetchBooking(token: string): Promise<Booking | null | "error"> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) {
    console.error("booking_page: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set");
    return "error";
  }
  try {
    const res = await fetch(`${base}/rest/v1/rpc/booking_page`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_token: token }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Booking | null;
  } catch (e) {
    console.error("booking_page failed", e);
    return "error";
  }
}

export const meetingWord = (k: Booking["kind"]) => (k === "call" ? "call" : k === "trial" ? "trial shift" : "interview");

// "PT", "ET": the zone the times are in, said once.
export function zoneText(tz: string, at = new Date()) {
  return at.toLocaleTimeString("en-US", { timeZone: tz, timeZoneName: "short" }).split(" ").pop()?.replace(/[SD]T$/, "T") ?? tz;
}

export const dayText = (iso: string, tz: string) =>
  new Date(iso).toLocaleDateString("en-US", { timeZone: tz, weekday: "long", month: "short", day: "numeric" });
export const timeText = (iso: string, tz: string) =>
  new Date(iso).toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" });

// An .ics for the booked time, as a data: link (nothing stored server-side).
export function icsHref(b: Booking, at: string) {
  const start = new Date(at), end = new Date(start.getTime() + (b.minutes ?? 30) * 60000);
  const z = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (t: string) => t.replace(/[\\;,]/g, (c) => "\\" + c);
  const title = esc(`${b.kind === "trial" ? "Trial shift" : b.kind === "call" ? "Call" : "Interview"} at ${b.org_name}`);
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//The Pass//Booking//EN", "BEGIN:VEVENT",
    `UID:${z(start)}-${b.org_name.length}@thepass.cloud`, `DTSTAMP:${z(start)}`, `DTSTART:${z(start)}`, `DTEND:${z(end)}`,
    `SUMMARY:${title}`, ...(b.place_name ? [`LOCATION:${esc(b.place_name)}`] : []), "END:VEVENT", "END:VCALENDAR"];
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(lines.join("\r\n"));
}

export const mapsHref = (b: Booking) =>
  b.place_lat != null && b.place_lon != null ? `https://maps.apple.com/?q=${encodeURIComponent(b.place_name ?? b.org_name)}&ll=${b.place_lat},${b.place_lon}` : null;

// "Tue, Nov 3 at 2:00 PM" in the business's time zone (the applicant comes to them).
export function whenText(iso: string, tz: string) {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" });
  return `${day} at ${time}`;
}
