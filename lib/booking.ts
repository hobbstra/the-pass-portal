// The booking page's data (booking_page RPC): who it's with, what's booked, open times. Read per request:
// a time someone just took must not be offered from a cache.
export type Booking = {
  org_name: string;
  brand_color: string | null;
  timezone: string;
  first_name: string | null;
  job_title: string | null;
  kind: "call" | "interview" | "trial";
  minutes: number;
  host_first_name: string | null;
  booked_at: string | null;
  live: boolean;
  can_change: boolean;
  times: string[] | null;
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

// "Tue, Nov 3 at 2:00 PM" in the business's time zone (the applicant comes to them).
export function whenText(iso: string, tz: string) {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" });
  return `${day} at ${time}`;
}
