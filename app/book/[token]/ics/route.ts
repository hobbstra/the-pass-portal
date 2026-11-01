import { fetchBooking, icsText } from "@/lib/booking";

// The booked meeting as a calendar file. Nothing booked (or no such link): 404.
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const b = await fetchBooking(token);
  if (!b || b === "error" || !b.booked_at) return new Response("Not found", { status: 404 });
  return new Response(icsText(b, b.booked_at, `https://thepass.cloud/book/${token}`), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="interview.ics"',
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex",
    },
  });
}
